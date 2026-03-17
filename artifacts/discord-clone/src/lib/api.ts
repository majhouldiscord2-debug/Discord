const API_BASE = "/api";

export interface ToolSettings {
  toolId: number;
  autoJoin: boolean;
  smartMention: boolean;
  dmMode: boolean;
  delay: number;
  servers: string[];
  messages: string[];
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

export async function getAuthStatus(): Promise<AuthStatus> {
  const res = await fetch(`${API_BASE}/auth/status`);
  if (!res.ok) return { authenticated: false };
  return res.json();
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
