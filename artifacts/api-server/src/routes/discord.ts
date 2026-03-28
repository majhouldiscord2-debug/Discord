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

// ── Real Discord client fingerprint headers ───────────────────────────────────

const CLIENT_BUILD = 363561;
const CLIENT_VERSION = "1.0.9180";
const CHROME_VERSION = "128.0.6613.186";
const ELECTRON_VERSION = "32.2.7";
const BROWSER_UA = `Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/${CLIENT_VERSION} Chrome/${CHROME_VERSION} Electron/${ELECTRON_VERSION} Safari/537.36`;

function buildSuperProperties(): string {
  const props = {
    os: "Windows",
    browser: "Discord Client",
    release_channel: "stable",
    client_version: CLIENT_VERSION,
    os_version: "10.0.22631",
    os_arch: "x64",
    app_arch: "ia32",
    system_locale: "en-US",
    browser_user_agent: BROWSER_UA,
    browser_version: ELECTRON_VERSION,
    client_build_number: CLIENT_BUILD,
    native_build_number: 56131,
    client_event_source: null,
    design_id: 0,
  };
  return Buffer.from(JSON.stringify(props)).toString("base64");
}

function buildContextProperties(location: string, extra?: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify({ location, ...extra })).toString("base64");
}

function jitter(base: number, spread: number) {
  return base + Math.floor(Math.random() * spread);
}

function clientHeaders(token: string, tokenType: string, extra?: Record<string, string>): Record<string, string> {
  return {
    Authorization: authHeader(token, tokenType),
    "Content-Type": "application/json",
    "User-Agent": BROWSER_UA,
    "X-Super-Properties": buildSuperProperties(),
    "X-Discord-Locale": "en-US",
    "X-Discord-Timezone": "America/New_York",
    "X-Debug-Options": "bugReporterEnabled",
    "Accept-Language": "en-US,en;q=0.9",
    "sec-ch-ua": `"Chromium";v="${CHROME_VERSION.split(".")[0]}", "Not-A.Brand";v="99"`,
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    ...(extra ?? {}),
  };
}

async function discordFetch(path: string, token: string, tokenType: string, options?: RequestInit) {
  const res = await fetch(`${DISCORD_API}${path}`, {
    ...options,
    headers: {
      ...clientHeaders(token, tokenType),
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

// ── helpers for onboarding / verification bypass ─────────────────────────────

async function skipMemberVerification(guildId: string, token: string, tokenType: string): Promise<{ attempted: boolean; accepted?: boolean }> {
  await sleep(jitter(600, 400));
  const gateRes = await discordFetch(`/guilds/${guildId}/member-verification?with_guild=false&invite_code=`, token, tokenType);
  if (!gateRes.ok) return { attempted: false };

  const gate = gateRes.data as Record<string, unknown>;
  if (!gate?.form_fields) return { attempted: false };

  const formFields = (gate.form_fields as Array<Record<string, unknown>>).map((field) => ({
    field_type: field.field_type,
    label: field.label,
    values: field.values ?? [],
    required: field.required ?? true,
    response: true,
  }));

  await sleep(jitter(800, 600));

  const acceptRes = await discordFetch(`/guilds/${guildId}/requests/@me`, token, tokenType, {
    method: "PUT",
    body: JSON.stringify({ version: gate.version, form_fields: formFields }),
    headers: {
      "X-Context-Properties": buildContextProperties("Rules Screening"),
    },
  });

  return { attempted: true, accepted: acceptRes.ok };
}

async function completeOnboarding(guildId: string, token: string, tokenType: string) {
  await sleep(jitter(500, 400));
  const onboardingRes = await discordFetch(`/guilds/${guildId}/onboarding`, token, tokenType);
  if (onboardingRes.ok) {
    const data = onboardingRes.data as Record<string, unknown>;
    const prompts = Array.isArray(data?.prompts) ? data.prompts as Array<Record<string, unknown>> : [];
    const defaultOptionIds: string[] = [];
    for (const prompt of prompts) {
      const options = Array.isArray(prompt?.options) ? prompt.options as Array<Record<string, unknown>> : [];
      if (options.length > 0) {
        defaultOptionIds.push(options[0].id as string);
      }
    }
    if (defaultOptionIds.length > 0) {
      await sleep(jitter(700, 500));
      await discordFetch(`/guilds/${guildId}/onboarding-responses`, token, tokenType, {
        method: "POST",
        body: JSON.stringify({ onboarding_responses: defaultOptionIds, onboarding_prompts_seen: defaultOptionIds }),
      });
    }
  }
  await sleep(jitter(400, 300));
  await discordFetch(`/guilds/${guildId}/members/@me`, token, tokenType, {
    method: "PATCH",
    body: JSON.stringify({ flags: 5 }),
    headers: {
      "X-Context-Properties": buildContextProperties("Guild Onboarding"),
    },
  });
}

// ── join server ───────────────────────────────────────────────────────────────

router.post("/discord/join-server", async (req, res) => {
  res.socket?.setTimeout(0);
  const auth = await getStoredAuth();
  if (!auth) return res.status(401).json({ error: "Not authenticated" });
  const { inviteCode, guildId } = req.body as { inviteCode: string; guildId?: string };
  if (!inviteCode?.trim()) return res.status(400).json({ error: "inviteCode required" });

  const code = inviteCode.trim();

  // Step 1: Preview the invite first (simulates user clicking invite link)
  const previewRes = await discordFetch(
    `/invites/${code}?inputValue=${encodeURIComponent(code)}&with_counts=true&with_expiration=true`,
    auth.token, auth.tokenType,
  );
  const previewData = previewRes.data as Record<string, unknown>;
  const previewGuild = previewData?.guild as Record<string, unknown> | undefined;
  const previewGuildId = guildId ?? previewGuild?.id as string | undefined;
  const previewChannel = previewData?.channel as Record<string, unknown> | undefined;

  // Step 2: Simulate a human reading the invite preview (1.5–3.5 seconds)
  await sleep(jitter(1500, 2000));

  // Step 3: Accept the invite with full context properties (like real client)
  const contextProps: Record<string, unknown> = { location: "Join Guild" };
  if (previewGuildId) contextProps["location_guild_id"] = previewGuildId;
  if (previewChannel?.id) {
    contextProps["location_channel_id"] = previewChannel.id;
    contextProps["location_channel_type"] = previewChannel.type ?? 0;
  }

  const joinResult = await discordFetch(`/invites/${code}`, auth.token, auth.tokenType, {
    method: "POST",
    body: JSON.stringify({ session_id: null }),
    headers: {
      "X-Context-Properties": buildContextProperties("Join Guild", contextProps),
    },
  });

  if (!joinResult.ok) {
    const data = joinResult.data as Record<string, unknown>;
    if (joinResult.status === 400 && (data?.code === 40006 || String(data?.message).toLowerCase().includes("already"))) {
      const resolvedGuildId = previewGuildId ?? ((data?.guild as Record<string, unknown>)?.id as string | undefined);
      if (resolvedGuildId) {
        await skipMemberVerification(resolvedGuildId, auth.token, auth.tokenType);
        await completeOnboarding(resolvedGuildId, auth.token, auth.tokenType);
      }
      return res.json({ success: true, alreadyMember: true, guild: data?.guild ?? previewGuild ?? null });
    }
    return res.status(joinResult.status).json({
      error: (joinResult.data as Record<string, unknown>)?.message ?? "Failed to join",
      code: (joinResult.data as Record<string, unknown>)?.code,
    });
  }

  const joined = joinResult.data as Record<string, unknown>;
  const resolvedGuildId = previewGuildId ?? ((joined?.guild as Record<string, unknown>)?.id as string | undefined);

  const bypass: Record<string, unknown> = {};

  if (resolvedGuildId) {
    // Step 4: Handle verification gate (looks like user reading rules)
    await sleep(jitter(1200, 800));
    const vResult = await skipMemberVerification(resolvedGuildId, auth.token, auth.tokenType);
    bypass.verificationSkipped = vResult.accepted ?? false;

    // Step 5: Handle onboarding (looks like user going through welcome flow)
    await completeOnboarding(resolvedGuildId, auth.token, auth.tokenType);
    bypass.onboardingSkipped = true;
  }

  return res.json({ success: true, alreadyMember: false, guild: joined?.guild ?? null, ...bypass });
});

router.get("/discord/guild-membership/:guildId", async (req, res) => {
  const auth = await getStoredAuth();
  if (!auth) return res.status(401).json({ member: false });
  const { guildId } = req.params;

  const memberResult = await discordFetch(`/guilds/${guildId}/members/@me`, auth.token, auth.tokenType);
  if (memberResult.ok) return res.json({ member: true });

  const guildsResult = await discordFetch("/users/@me/guilds?limit=200", auth.token, auth.tokenType);
  if (guildsResult.ok && Array.isArray(guildsResult.data)) {
    const isMember = (guildsResult.data as Array<{ id: string }>).some((g) => g.id === guildId);
    return res.json({ member: isMember });
  }

  return res.json({ member: false });
});

router.post("/discord/auto-mention", async (req, res) => {
  const auth = await getStoredAuth();
  if (!auth) return res.status(401).json({ error: "Not authenticated" });

  const { guildId, channelHook, message, mentionCount, delayMs = 1200, activityOnly = false } =
    req.body as { guildId: string; channelHook?: string; message: string; mentionCount: number; delayMs?: number; activityOnly?: boolean };

  if (!guildId || !message) return res.status(400).json({ error: "guildId and message required" });

  const channelsResult = await discordFetch(`/guilds/${guildId}/channels`, auth.token, auth.tokenType);
  if (!channelsResult.ok) return res.status(400).json({ error: "Cannot access guild channels" });

  const channels = channelsResult.data as Array<{ id: string; name: string; type: number; nsfw?: boolean }>;
  const text = channels.filter((c) => (c.type === 0 || c.type === 5) && !c.nsfw);

  let target = channelHook
    ? text.find((c) => c.name === channelHook || c.id === channelHook)
    : text[0];
  if (!target) return res.status(400).json({ error: "No suitable text channel found" });

  const meResult = await discordFetch("/users/@me", auth.token, auth.tokenType);
  const meId = (meResult.data as Record<string, unknown>)?.id as string | undefined;

  let memberIds: string[] = [];

  if (activityOnly) {
    const recentResult = await discordFetchWithRetry(`/channels/${target.id}/messages?limit=100`, auth.token, auth.tokenType);
    if (recentResult.ok && Array.isArray(recentResult.data)) {
      const seen = new Set<string>();
      for (const msg of recentResult.data as Array<{ author: { id: string; bot?: boolean } }>) {
        const authorId = msg?.author?.id;
        if (authorId && authorId !== meId && !msg.author.bot && !seen.has(authorId)) {
          seen.add(authorId);
          memberIds.push(authorId);
          if (memberIds.length >= mentionCount) break;
        }
      }
    }
  }

  if (memberIds.length < mentionCount) {
    const membersResult = await discordFetch(`/guilds/${guildId}/members?limit=${Math.min(mentionCount * 2 + 10, 100)}`, auth.token, auth.tokenType);
    if (membersResult.ok && Array.isArray(membersResult.data)) {
      const existing = new Set(memberIds);
      for (const m of membersResult.data as Array<Record<string, unknown>>) {
        const uid = ((m?.user as Record<string, unknown>)?.id) as string;
        const isBot = (m?.user as Record<string, unknown>)?.bot as boolean;
        if (uid && uid !== meId && !isBot && !existing.has(uid)) {
          existing.add(uid);
          memberIds.push(uid);
          if (memberIds.length >= mentionCount) break;
        }
      }
    }
  }

  if (memberIds.length < mentionCount) {
    const fallbackResult = await discordFetchWithRetry(`/channels/${target.id}/messages?limit=100`, auth.token, auth.tokenType);
    if (fallbackResult.ok && Array.isArray(fallbackResult.data)) {
      const existing = new Set(memberIds);
      for (const msg of fallbackResult.data as Array<{ author: { id: string; bot?: boolean } }>) {
        const authorId = msg?.author?.id;
        if (authorId && authorId !== meId && !msg.author.bot && !existing.has(authorId)) {
          existing.add(authorId);
          memberIds.push(authorId);
          if (memberIds.length >= mentionCount) break;
        }
      }
    }
  }

  memberIds = memberIds.slice(0, mentionCount);

  const mentionStr = memberIds.map((id: string) => `<@${id}>`).join(" ");
  const content = mentionStr ? `${mentionStr}\n${message}` : message;

  await sleep(Math.min(delayMs, 3000));
  const sendResult = await discordFetch(`/channels/${target.id}/messages`, auth.token, auth.tokenType, {
    method: "POST",
    body: JSON.stringify({ content }),
  });

  if (!sendResult.ok) {
    return res.status(sendResult.status).json({ error: "Failed to send message", details: sendResult.data });
  }
  const sent = sendResult.data as Record<string, unknown>;
  return res.json({ success: true, messageId: sent?.id, channel: target.name, mentionedCount: memberIds.length });
});

router.get("/discord/guild-counts/:guildId", async (req, res) => {
  const { guildId } = req.params;
  let onlineCount: number | null = null;
  let memberCount: number | null = null;

  try {
    const widgetRes = await fetch(`https://discord.com/api/guilds/${guildId}/widget.json`, {
      headers: { "User-Agent": "DiscordBot (https://discord.com, 10)" },
    });
    if (widgetRes.ok) {
      const data = await widgetRes.json() as Record<string, unknown>;
      if (typeof data.presence_count === "number") onlineCount = data.presence_count;
    }
  } catch {}

  try {
    const previewRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/preview`, {
      headers: { "User-Agent": "DiscordBot (https://discord.com, 10)" },
    });
    if (previewRes.ok) {
      const data = await previewRes.json() as Record<string, unknown>;
      if (typeof data.approximate_member_count === "number") memberCount = data.approximate_member_count;
      if (typeof data.approximate_presence_count === "number") onlineCount = data.approximate_presence_count;
    }
  } catch {}

  return res.json({ onlineCount, memberCount });
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
