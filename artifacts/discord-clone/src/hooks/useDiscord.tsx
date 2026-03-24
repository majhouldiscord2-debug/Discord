import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  getAuthStatus,
  loginWithToken,
  logout as apiLogout,
  getDiscordGuilds,
  getDiscordChannels,
  getDiscordRelationships,
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
  login: (token: string, type: "user" | "bot") => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
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

  async function loadData() {
    const [g, ch, rel] = await Promise.all([
      getDiscordGuilds(),
      getDiscordChannels(),
      getDiscordRelationships(),
    ]);
    setGuilds(g);
    setChannels(ch);
    setRelationships(rel);
  }

  useEffect(() => {
    getAuthStatus().then((status) => {
      if (status.authenticated && status.user) {
        setAuthenticated(true);
        setUser(status.user);
        setTokenType(status.tokenType ?? "user");
        loadData();
      }
      setLoading(false);
    });
  }, []);

  async function login(token: string, type: "user" | "bot") {
    const result = await loginWithToken(token, type);
    if (result.success && result.user) {
      setAuthenticated(true);
      setUser(result.user);
      setTokenType(type);
      await loadData();
    }
    return { success: result.success, error: result.error };
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
    <DiscordContext.Provider
      value={{ loading, authenticated, user, tokenType, guilds, channels, relationships, login, logout }}
    >
      {children}
    </DiscordContext.Provider>
  );
}

export function useDiscord() {
  const ctx = useContext(DiscordContext);
  if (!ctx) throw new Error("useDiscord must be used inside DiscordProvider");
  return ctx;
}
