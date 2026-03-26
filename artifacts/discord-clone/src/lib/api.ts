const API_BASE = "/api";

export interface ServerMentioConfig {
  serverId: number;
  guildId: string;
  name: string;
  inviteCode: string;
  logoUrl: string;
  accentColor: string;
  enabled: boolean;
  mentionCount: number;
  cooldownMin: number;
  channelHook: string;
  activityOnly: boolean;
  customMessages: string[];
}

export interface ToolSettings {
  toolId: number;
  autoJoin: boolean;
  smartMention: boolean;
  dmMode: boolean;
  delay: number;
  safeMode: boolean;
  quickWave: boolean;
  servers: string[];
  messages: string[];
  serverConfigs: ServerMentioConfig[] | null;
}

export async function getToolSettings(toolId: number): Promise<ToolSettings> {
  const res = await fetch(`${API_BASE}/tool-settings/${toolId}`);
  if (!res.ok) throw new Error("Failed to load settings");
  return res.json();
}

export async function saveToolSettings(settings: ToolSettings): Promise<void> {
  const res = await fetch(`${API_BASE}/tool-settings/${settings.toolId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error("Failed to save settings");
}

export async function joinServer(inviteCode: string): Promise<{ success: boolean; alreadyMember?: boolean; guild?: { id: string; name: string } | null; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/discord/join-server`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inviteCode }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error ?? "Failed to join" };
    return data;
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function checkGuildMembership(guildId: string): Promise<{ member: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/discord/guild-membership/${guildId}`);
    if (!res.ok) return { member: false };
    return res.json();
  } catch {
    return { member: false };
  }
}

export async function runAutoMention(params: {
  guildId: string;
  channelHook: string;
  message: string;
  mentionCount: number;
  delayMs: number;
}): Promise<{ success: boolean; messageId?: string; channel?: string; mentionedCount?: number; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/discord/auto-mention`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error ?? "Failed" };
    return data;
  } catch {
    return { success: false, error: "Network error" };
  }
}

export interface DiscordUser {
  id: string;
  username: string;
  global_name?: string;
  discriminator: string;
  avatar?: string;
  bot?: boolean;
  email?: string;
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon?: string;
  owner?: boolean;
}

export interface GuildChannel {
  id: string;
  type: number;
  name: string;
  position: number;
  parent_id?: string;
  topic?: string;
  nsfw?: boolean;
}

export interface DiscordChannel {
  id: string;
  type: number;
  recipients?: DiscordUser[];
  name?: string;
  icon?: string;
}

export interface DiscordRelationship {
  id: string;
  type: number;
  user: DiscordUser;
  nickname?: string;
}

export interface MessageAttachment {
  id: string;
  filename: string;
  url: string;
  proxy_url: string;
  content_type?: string;
  size: number;
  width?: number;
  height?: number;
}

export interface DiscordMessage {
  id: string;
  channel_id: string;
  author: DiscordUser;
  content: string;
  timestamp: string;
  edited_timestamp: string | null;
  attachments: MessageAttachment[];
  embeds: unknown[];
  type: number;
  referenced_message?: DiscordMessage | null;
}

export interface AuthStatus {
  authenticated: boolean;
  user?: DiscordUser;
  tokenType?: string;
}

export function avatarUrl(user: DiscordUser): string | null {
  if (!user.avatar) return null;
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}?size=128`;
}

export function guildIconUrl(guild: DiscordGuild): string | null {
  if (!guild.icon) return null;
  return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=64`;
}

async function fetchWithRetry(url: string, options?: RequestInit, retries = 4, baseDelay = 600): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      return res;
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, baseDelay * Math.pow(1.8, attempt)));
    }
  }
  throw new Error("fetchWithRetry: unreachable");
}

export async function getAuthStatus(): Promise<AuthStatus> {
  try {
    const res = await fetchWithRetry(`${API_BASE}/auth/status`);
    if (!res.ok) return { authenticated: false };
    return res.json();
  } catch {
    return { authenticated: false };
  }
}

export async function loginWithToken(token: string, tokenType: "user" | "bot"): Promise<{ success: boolean; user?: DiscordUser; error?: string }> {
  const res = await fetch(`${API_BASE}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, tokenType }),
  });
  const data = await res.json();
  if (!res.ok) return { success: false, error: data.error ?? "Invalid token" };
  return { success: true, user: data.user };
}

export async function logout(): Promise<void> {
  await fetch(`${API_BASE}/auth/token`, { method: "DELETE" });
}

export async function getDiscordMe(): Promise<DiscordUser> {
  const res = await fetch(`${API_BASE}/discord/me`);
  if (!res.ok) throw new Error("Not authenticated");
  return res.json();
}

export async function getDiscordGuilds(): Promise<DiscordGuild[]> {
  const res = await fetch(`${API_BASE}/discord/guilds`);
  if (!res.ok) return [];
  return res.json();
}

export async function getDiscordChannels(): Promise<DiscordChannel[]> {
  const res = await fetch(`${API_BASE}/discord/channels`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function getDiscordRelationships(): Promise<DiscordRelationship[]> {
  const res = await fetch(`${API_BASE}/discord/relationships`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function getGuildChannels(guildId: string): Promise<GuildChannel[]> {
  const res = await fetch(`${API_BASE}/discord/guilds/${guildId}/channels`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function getChannelMessages(channelId: string, limit = 50, before?: string): Promise<DiscordMessage[]> {
  let url = `${API_BASE}/discord/channels/${channelId}/messages?limit=${limit}`;
  if (before) url += `&before=${before}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export interface MessageStats {
  dmMessages: number;
  dmTotal: number;
  serverMessages: number;
  serverTotal: number;
  totalMessages: number;
  channelsSampled: number;
  guildsSampled: number;
}

export async function getPinnedMessages(channelId: string): Promise<DiscordMessage[]> {
  try {
    const res = await fetch(`${API_BASE}/discord/channels/${channelId}/pins`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

export interface ChannelPreview {
  channel: DiscordChannel;
  lastMsg: { id: string; content: string; author: { id: string; username: string; global_name?: string }; timestamp: string } | null;
  mentions: Array<{ id: string; content: string; author: { id: string; username: string; global_name?: string }; timestamp: string }>;
}

export async function getChannelPreviews(): Promise<ChannelPreview[]> {
  try {
    const res = await fetch(`${API_BASE}/discord/channel-previews`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

export async function getMessageStats(): Promise<MessageStats | null> {
  try {
    const res = await fetch(`${API_BASE}/discord/message-stats`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function sendMessage(channelId: string, content: string): Promise<DiscordMessage | null> {
  const res = await fetch(`${API_BASE}/discord/channels/${channelId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) return null;
  return res.json();
}
