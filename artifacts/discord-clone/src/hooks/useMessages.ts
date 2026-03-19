import { useEffect, useRef, useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import { simulatedMessages } from "@/data/mockData";

export function useMessages(channelId: string | null) {
  const messages = useAppStore((s) => channelId ? (s.messages[channelId] ?? []) : []);
  return messages;
}

export function useTypingUsers(channelId: string | null) {
  const typingUsers = useAppStore((s) => s.typingUsers);
  const users = useAppStore((s) => s.users);
  if (!channelId) return [];
  const currentUserId = useAppStore((s) => s.currentUserId);
  return typingUsers
    .filter((t) => t.channelId === channelId && t.userId !== currentUserId)
    .map((t) => users[t.userId])
    .filter(Boolean);
}

export function useSimulatedActivity(channelId: string | null) {
  const addMessage = useAppStore((s) => s.addSimulatedMessage);
  const setTyping = useAppStore((s) => s.setTyping);
  const simulatedPool = channelId ? (simulatedMessages[channelId] ?? []) : [];
  const poolRef = useRef(simulatedPool);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!channelId || poolRef.current.length === 0) return;

    const scheduleNext = () => {
      const delay = 18000 + Math.random() * 22000;
      return setTimeout(async () => {
        const item = poolRef.current[indexRef.current % poolRef.current.length];
        indexRef.current++;

        setTyping(channelId, item.authorId, true);
        const typingDuration = 1500 + Math.random() * 2000;

        await new Promise((r) => setTimeout(r, typingDuration));
        setTyping(channelId, item.authorId, false);
        addMessage(channelId, item.authorId, item.content);

        timer = scheduleNext();
      }, delay);
    };

    let timer = scheduleNext();
    return () => clearTimeout(timer);
  }, [channelId, addMessage, setTyping]);
}
