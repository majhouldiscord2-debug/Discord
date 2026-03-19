import { useAppStore } from "@/store/useAppStore";

export function useCurrentUser() {
  const userId = useAppStore((s) => s.currentUserId);
  const users = useAppStore((s) => s.users);
  return users[userId];
}
