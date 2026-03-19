import { createContext, useContext, type ReactNode } from "react";
import { useAppStore } from "@/store/useAppStore";
import type { User } from "@/types";

interface DiscordContextValue {
  loading: boolean;
  authenticated: boolean;
  user: User | null;
}

const DiscordContext = createContext<DiscordContextValue | null>(null);

export function DiscordProvider({ children }: { children: ReactNode }) {
  const currentUserId = useAppStore((s) => s.currentUserId);
  const users = useAppStore((s) => s.users);
  const currentUser = users[currentUserId] ?? null;

  return (
    <DiscordContext.Provider value={{ loading: false, authenticated: true, user: currentUser }}>
      {children}
    </DiscordContext.Provider>
  );
}

export function useDiscord() {
  const ctx = useContext(DiscordContext);
  if (!ctx) throw new Error("useDiscord must be used inside DiscordProvider");
  return ctx;
}
