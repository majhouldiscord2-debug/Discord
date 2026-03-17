import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  getAuthStatus,
  getDiscordMe,
  getDiscordGuilds,
  getDiscordChannels,
  getDiscordRelationships,
  loginWithToken,
  logout as apiLogout,
  type DiscordUser,
  type DiscordGuild,
  type DiscordChannel,
  type DiscordRelationship,
} from "@/lib/api";

interface DiscordContextValue {
  loading: boolean;
  authenticated: boolean;
  user: DiscordUser | null;
  tokenType: string;
  guilds: DiscordGuild[];
  channels: DiscordChannel[];
  relationships: DiscordRelationship[];
  login: (token: string, tokenType: "user" | "bot") => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refresh: () => void;
}

const DiscordContext = createContext<DiscordContextValue | null>(null);

export function DiscordProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [tokenType, setTokenType] = useState("user");
  const [guilds, setGuilds] = useState<DiscordGuild[]>([]);
  const [channels, setChannels] = useState<DiscordChannel[]>([]);
  const [relationships, setRelationships] = useState<DiscordRelationship[]>([]);

  async function load() {
    setLoading(true);
    try {
      const status = await getAuthStatus();
      if (!status.authenticated) {
        setAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }
      setAuthenticated(true);
      setUser(status.user ?? null);
      setTokenType(status.tokenType ?? "user");

      const [g, ch, rel] = await Promise.all([
        getDiscordGuilds(),
        getDiscordChannels(),
        getDiscordRelationships(),
      ]);
      setGuilds(g);
      setChannels(ch);
      setRelationships(rel);
    } catch {
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function login(token: string, type: "user" | "bot") {
    const res = await loginWithToken(token, type);
    if (res.success) {
      setAuthenticated(true);
      setUser(res.user ?? null);
      setTokenType(type);
      load();
    }
    return res;
  }

  async function logout() {
    await apiLogout();
    setAuthenticated(false);
    setUser(null);
    setGuilds([]);
    setChannels([]);
    setRelationships([]);
  }

  return (
    <DiscordContext.Provider value={{ loading, authenticated, user, tokenType, guilds, channels, relationships, login, logout, refresh: load }}>
      {children}
    </DiscordContext.Provider>
  );
}

export function useDiscord() {
  const ctx = useContext(DiscordContext);
  if (!ctx) throw new Error("useDiscord must be used inside DiscordProvider");
  return ctx;
}
