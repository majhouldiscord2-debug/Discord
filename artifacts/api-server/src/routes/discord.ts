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

// ── helpers ────────────────────────────────────────────────────────────────
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number,
): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let idx = 0;
  async function worker() {
    while (idx < tasks.length) {
      const i = idx++;
      results[i] = await tasks[i]();
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, tasks.length) }, worker));
  return results;
}

async function discordFetchWithRetry(
  path: string,
  token: string,
  tokenType: string,
  maxRetries = 6,
) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const result = await discordFetch(path, token, tokenType);
    if (result.status === 429) {
      const retryAfter = ((result.data as Record<string, unknown>)?.retry_after as number) ?? 1;
      await sleep(retryAfter * 1000 + 200);
      continue;
    }
    return result;
  }
  return { ok: false, status: 429, data: null };
}

async function countAllMessagesInChannel(
  channelId: string,
  userId: string,
  token: string,
  tokenType: string,
): Promise<{ mine: number; total: number }> {
  let mine = 0;
  let total = 0;
  let before: string | undefined;

  while (true) {
    let url = `/channels/${channelId}/messages?limit=100`;
    if (before) url += `&before=${before}`;

    const result = await discordFetchWithRetry(url, token, tokenType);
    if (!result.ok || !Array.isArray(result.data) || result.data.length === 0) break;

    const msgs = result.data as Array<{ id: string; author: { id: string } }>;
    total += msgs.length;
    mine += msgs.filter((m) => m.author?.id === userId).length;

    if (msgs.length < 100) break;
    before = msgs[msgs.length - 1].id;
    await sleep(150);
  }

  return { mine, total };
}
// ────────────────────────────────────────────────────────────────────────────

async function searchMessageCount(
  path: string,
  userId: string,
  token: string,
  tokenType: string,
): Promise<number> {
  const result = await discordFetchWithRetry(`${path}?author_id=${userId}`, token, tokenType);
  if (!result.ok) return 0;
  const data = result.data as { total_results?: number };
  return data.total_results ?? 0;
}

router.get("/discord/message-stats", async (_req, res) => {
  const auth = await getStoredAuth();
  if (!auth) return res.status(401).json({ error: "Not authenticated" });

  res.socket?.setTimeout(0);

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
    const dmChannels = allChannels.filter((c) => c.type === 1 || c.type === 3);

    // ── Use Discord's search API to count user's messages in DM channels ─
    const dmCounts = await runWithConcurrency(
      dmChannels.map((ch) => () =>
        searchMessageCount(`/channels/${ch.id}/messages/search`, me.id, auth.token, auth.tokenType).catch(() => 0)
      ),
      5,
    );
    const dmMessages = dmCounts.reduce((a, b) => a + b, 0);

    // ── Use Discord's search API to count user's messages per guild ───────
    const guildCounts = await runWithConcurrency(
      guilds.map((g) => () =>
        searchMessageCount(`/guilds/${g.id}/messages/search`, me.id, auth.token, auth.tokenType).catch(() => 0)
      ),
      5,
    );
    const serverMessages = guildCounts.reduce((a, b) => a + b, 0);

    return res.json({
      dmMessages,
      dmTotal: dmMessages,
      serverMessages,
      serverTotal: serverMessages,
      totalMessages: dmMessages + serverMessages,
      channelsSampled: dmChannels.length,
      guildsSampled: guilds.length,
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch message stats" });
  }
});

router.get("/discord/channels/:channelId/pins", async (req, res) => {
  const auth = await getStoredAuth();
  if (!auth) return res.status(401).json({ error: "Not authenticated" });
  const { channelId } = req.params;
  const result = await discordFetch(`/channels/${channelId}/pins`, auth.token, auth.tokenType);
  if (!result.ok) return res.status(result.status).json(result.data);
  return res.json(result.data);
});

router.get("/discord/channel-previews", async (_req, res) => {
  const auth = await getStoredAuth();
  if (!auth) return res.status(401).json({ error: "Not authenticated" });
  try {
    const [meResult, chResult] = await Promise.all([
      discordFetch("/users/@me", auth.token, auth.tokenType),
      discordFetch("/users/@me/channels", auth.token, auth.tokenType),
    ]);
    if (!meResult.ok) return res.status(401).json({ error: "Not authenticated" });
    const me = meResult.data as { id: string };
    const channels: Array<{ id: string; type: number; recipients?: Array<{ id: string; username: string; global_name?: string; avatar?: string }>; name?: string }> =
      Array.isArray(chResult.data) ? chResult.data : [];

    const previews = await Promise.all(
      channels.slice(0, 25).map(async (ch) => {
        try {
          const r = await discordFetchWithRetry(`/channels/${ch.id}/messages?limit=5`, auth.token, auth.tokenType);
          const msgs: Array<{ id: string; content: string; author: { id: string; username: string; global_name?: string }; timestamp: string }> =
            Array.isArray(r.data) ? r.data : [];
          const lastMsg = msgs[0] ?? null;
          const mentions = msgs.filter((m) => m.content.includes(`<@${me.id}>`) || m.content.includes(`<@!${me.id}>`));
          return { channel: ch, lastMsg, mentions };
        } catch {
          return { channel: ch, lastMsg: null, mentions: [] };
        }
      })
    );
    return res.json(previews);
  } catch {
    return res.status(500).json({ error: "Failed" });
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
