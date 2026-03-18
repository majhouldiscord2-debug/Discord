import { Router } from "express";
import { db, discordAuthTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();
const DISCORD_API = "https://discord.com/api/v10";

async function getStoredAuth() {
  try {
    const rows = await db.select().from(discordAuthTable).where(eq(discordAuthTable.id, 1));
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

function authHeader(token: string, tokenType: string) {
  return tokenType === "bot" ? `Bot ${token}` : token;
}

async function discordFetch(path: string, token: string, tokenType: string, options?: RequestInit) {
  const res = await fetch(`${DISCORD_API}${path}`, {
    ...options,
    headers: {
      Authorization: authHeader(token, tokenType),
      "Content-Type": "application/json",
      ...(options?.headers as Record<string, string> ?? {}),
    },
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

router.get("/discord/me", async (_req, res) => {
  const auth = await getStoredAuth();
  if (!auth) return res.status(401).json({ error: "Not authenticated" });
  const result = await discordFetch("/users/@me", auth.token, auth.tokenType);
  if (!result.ok) return res.status(result.status).json(result.data);
  return res.json(result.data);
});

router.get("/discord/guilds", async (_req, res) => {
  const auth = await getStoredAuth();
  if (!auth) return res.status(401).json({ error: "Not authenticated" });
  const result = await discordFetch("/users/@me/guilds?limit=100", auth.token, auth.tokenType);
  if (!result.ok) return res.status(result.status).json(result.data);
  return res.json(result.data);
});

router.get("/discord/guilds/:guildId/channels", async (req, res) => {
  const auth = await getStoredAuth();
  if (!auth) return res.status(401).json({ error: "Not authenticated" });
  const { guildId } = req.params;
  const result = await discordFetch(`/guilds/${guildId}/channels`, auth.token, auth.tokenType);
  if (!result.ok) return res.status(result.status).json(result.data);
  return res.json(result.data);
});

router.get("/discord/channels", async (_req, res) => {
  const auth = await getStoredAuth();
  if (!auth) return res.status(401).json({ error: "Not authenticated" });
  const result = await discordFetch("/users/@me/channels", auth.token, auth.tokenType);
  if (!result.ok) return res.status(result.status).json(result.data);
  return res.json(result.data);
});

router.get("/discord/channels/:channelId/messages", async (req, res) => {
  const auth = await getStoredAuth();
  if (!auth) return res.status(401).json({ error: "Not authenticated" });
  const { channelId } = req.params;
  const { limit = "50", before } = req.query as { limit?: string; before?: string };
  let path = `/channels/${channelId}/messages?limit=${Math.min(Number(limit), 100)}`;
  if (before) path += `&before=${before}`;
  const result = await discordFetch(path, auth.token, auth.tokenType);
  if (!result.ok) return res.status(result.status).json(result.data);
  return res.json(result.data);
});

router.post("/discord/channels/:channelId/messages", async (req, res) => {
  const auth = await getStoredAuth();
  if (!auth) return res.status(401).json({ error: "Not authenticated" });
  const { channelId } = req.params;
  const { content } = req.body as { content: string };
  if (!content?.trim()) return res.status(400).json({ error: "Content required" });
  const result = await discordFetch(`/channels/${channelId}/messages`, auth.token, auth.tokenType, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
  if (!result.ok) return res.status(result.status).json(result.data);
  return res.json(result.data);
});

router.get("/discord/message-stats", async (_req, res) => {
  const auth = await getStoredAuth();
  if (!auth) return res.status(401).json({ error: "Not authenticated" });

  try {
    const [meResult, dmResult, guildsResult] = await Promise.all([
      discordFetch("/users/@me", auth.token, auth.tokenType),
      discordFetch("/users/@me/channels", auth.token, auth.tokenType),
      discordFetch("/users/@me/guilds?limit=100", auth.token, auth.tokenType),
    ]);

    if (!meResult.ok) return res.status(401).json({ error: "Not authenticated" });

    const me = meResult.data as { id: string };
    const allChannels: Array<{ id: string; type: number }> = Array.isArray(dmResult.data) ? dmResult.data : [];
    const guilds: Array<{ id: string }> = Array.isArray(guildsResult.data) ? guildsResult.data : [];

    const dmChannels = allChannels.filter((c) => c.type === 1 || c.type === 3).slice(0, 30);

    let dmMessages = 0;
    let dmTotal = 0;

    await Promise.all(
      dmChannels.map(async (ch) => {
        try {
          const r = await discordFetch(`/channels/${ch.id}/messages?limit=100`, auth.token, auth.tokenType);
          if (!r.ok || !Array.isArray(r.data)) return;
          const msgs = r.data as Array<{ author: { id: string } }>;
          dmTotal += msgs.length;
          dmMessages += msgs.filter((m) => m.author?.id === me.id).length;
        } catch { /* skip */ }
      })
    );

    let serverMessages = 0;
    let serverTotal = 0;
    const sampledGuilds = guilds.slice(0, 8);

    await Promise.all(
      sampledGuilds.map(async (g) => {
        try {
          const chRes = await discordFetch(`/guilds/${g.id}/channels`, auth.token, auth.tokenType);
          if (!chRes.ok || !Array.isArray(chRes.data)) return;
          const textChannels = (chRes.data as Array<{ id: string; type: number }>)
            .filter((c) => c.type === 0)
            .slice(0, 4);

          await Promise.all(
            textChannels.map(async (ch) => {
              try {
                const r = await discordFetch(`/channels/${ch.id}/messages?limit=100`, auth.token, auth.tokenType);
                if (!r.ok || !Array.isArray(r.data)) return;
                const msgs = r.data as Array<{ author: { id: string } }>;
                serverTotal += msgs.length;
                serverMessages += msgs.filter((m) => m.author?.id === me.id).length;
              } catch { /* skip */ }
            })
          );
        } catch { /* skip */ }
      })
    );

    return res.json({
      dmMessages,
      dmTotal,
      serverMessages,
      serverTotal,
      totalMessages: dmMessages + serverMessages,
      channelsSampled: dmChannels.length,
      guildsSampled: sampledGuilds.length,
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch message stats" });
  }
});

router.get("/discord/relationships", async (_req, res) => {
  const auth = await getStoredAuth();
  if (!auth) return res.status(401).json({ error: "Not authenticated" });
  const result = await discordFetch("/users/@me/relationships", auth.token, auth.tokenType);
  if (!result.ok) return res.status(result.status).json(result.data);
  return res.json(result.data);
});

router.post("/auth/token", async (req, res, next) => {
  try {
    const { token, tokenType } = req.body as { token: string; tokenType: string };
    if (!token) return res.status(400).json({ error: "Token required" });
    const type = tokenType === "bot" ? "bot" : "user";
    const verify = await discordFetch("/users/@me", token, type);
    if (!verify.ok) {
      return res.status(401).json({ error: "Invalid token", details: verify.data });
    }
    await db
      .insert(discordAuthTable)
      .values({ id: 1, token, tokenType: type })
      .onConflictDoUpdate({
        target: discordAuthTable.id,
        set: { token, tokenType: type, createdAt: new Date() },
      });
    return res.json({ success: true, user: verify.data });
  } catch (err) {
    next(err);
  }
});

router.delete("/auth/token", async (_req, res) => {
  await db.delete(discordAuthTable).where(eq(discordAuthTable.id, 1));
  return res.json({ success: true });
});

router.get("/auth/status", async (_req, res) => {
  const auth = await getStoredAuth();
  if (!auth) return res.json({ authenticated: false });
  const result = await discordFetch("/users/@me", auth.token, auth.tokenType);
  if (!result.ok) return res.json({ authenticated: false });
  return res.json({ authenticated: true, user: result.data, tokenType: auth.tokenType });
});

export default router;
