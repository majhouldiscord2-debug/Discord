import * as React from "react"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// --- Utils ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- Hooks ---
const MOBILE_BREAKPOINT = 768
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])
  return !!isMobile
}

// --- Mock Data & Types ---
export type Status = "online" | "idle" | "dnd" | "offline"
export interface User {
  id: string | number; name: string; username: string; status: Status;
  statusText?: string; avatarColor: string; initials: string;
}
export const currentUser: User = { id: "me", name: "velvetsky", username: "velvetsky", statusText: "Building something cool...", status: "online", avatarColor: "#5865f2", initials: "V" };
export const friendsOnline: User[] = [
  { id: 1, name: "nova_storm", username: "nova_storm", status: "online", statusText: "Online", avatarColor: "#3ba55c", initials: "N" },
  { id: 2, name: "pixelwitch", username: "pixelwitch", status: "online", statusText: "Playing Valorant", avatarColor: "#ed4245", initials: "P" },
  { id: 3, name: "driftwood", username: "driftwood", status: "idle", statusText: "Idle", avatarColor: "#faa61a", initials: "D" },
];
export const pendingFriends: User[] = [{ id: 10, name: "cosmicdust", username: "cosmicdust", status: "online", statusText: "Incoming Friend Request", avatarColor: "#eb459e", initials: "C" }];
export const allFriends: User[] = [...friendsOnline, { id: 4, name: "ghostline", username: "ghostline", status: "dnd", statusText: "Do Not Disturb", avatarColor: "#747f8d", initials: "G" }, { id: 5, name: "lunarbyte", username: "lunarbyte", status: "offline", statusText: "Last seen 2 hours ago", avatarColor: "#5865f2", initials: "L" }];
export const dmContacts: User[] = [...allFriends, { id: 7, name: "stormchaser", username: "stormchaser", status: "offline", avatarColor: "#1abc9c", initials: "S" }, { id: 8, name: "zephyrcode", username: "zephyrcode", status: "idle", avatarColor: "#e67e22", initials: "Z" }];
export interface Server { id: number; name: string; initials: string; color: string; hasNotification: boolean; notificationCount?: number; iconUrl?: string; }
export const servers: Server[] = [
  { id: 1, name: "Reactiflux", initials: "⚛", color: "#61dafb", hasNotification: true, notificationCount: 3 },
  { id: 2, name: "Next.js", initials: "N", color: "#000000", hasNotification: false },
  { id: 3, name: "Tailwind CSS", initials: "T", color: "#06b6d4", hasNotification: false }
];
