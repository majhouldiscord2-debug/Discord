import { create } from "zustand";
import type { User, Server, Channel, Category, Message, DmChannel, TypingUser } from "@/types";
import {
  users as mockUsers,
  servers as mockServers,
  channels as mockChannels,
  categories as mockCategories,
  dmChannels as mockDmChannels,
  initialMessages,
  CURRENT_USER_ID,
} from "@/data/mockData";

interface AppState {
  currentUserId: string;
  users: Record<string, User>;
  servers: Server[];
  channels: Channel[];
  categories: Category[];
  dmChannels: DmChannel[];
  messages: Record<string, Message[]>;
  typingUsers: TypingUser[];

  activeServerId: string | null;
  activeChannelId: string | null;
  activeDmId: string | null;

  setActiveServer: (serverId: string | null) => void;
  setActiveChannel: (channelId: string | null) => void;
  setActiveDm: (dmId: string | null) => void;
  sendMessage: (channelId: string, content: string) => void;
  addSimulatedMessage: (channelId: string, authorId: string, content: string) => void;
  setTyping: (channelId: string, userId: string, isTyping: boolean) => void;
  markChannelRead: (channelId: string) => void;
  markDmRead: (dmId: string) => void;
  getUserById: (id: string) => User | undefined;
  getChannelsByServer: (serverId: string) => Channel[];
  getCategoriesByServer: (serverId: string) => Category[];
  getMessagesForChannel: (channelId: string) => Message[];
  getDmRecipient: (dmId: string) => User | undefined;
}

function generateId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUserId: CURRENT_USER_ID,
  users: mockUsers,
  servers: mockServers,
  channels: mockChannels,
  categories: mockCategories,
  dmChannels: mockDmChannels,
  messages: { ...initialMessages },
  typingUsers: [],

  activeServerId: null,
  activeChannelId: null,
  activeDmId: null,

  setActiveServer: (serverId) => {
    set({ activeServerId: serverId, activeChannelId: null, activeDmId: null });
  },

  setActiveChannel: (channelId) => {
    set({ activeChannelId: channelId, activeDmId: null });
    if (channelId) get().markChannelRead(channelId);
  },

  setActiveDm: (dmId) => {
    set({ activeDmId: dmId, activeChannelId: null, activeServerId: null });
    if (dmId) get().markDmRead(dmId);
  },

  sendMessage: (channelId, content) => {
    const msg: Message = {
      id: generateId(),
      channelId,
      authorId: get().currentUserId,
      content,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: [...(state.messages[channelId] ?? []), msg],
      },
    }));
  },

  addSimulatedMessage: (channelId, authorId, content) => {
    const msg: Message = {
      id: generateId(),
      channelId,
      authorId,
      content,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: [...(state.messages[channelId] ?? []), msg],
      },
    }));
  },

  setTyping: (channelId, userId, isTyping) => {
    set((state) => {
      const filtered = state.typingUsers.filter(
        (t) => !(t.channelId === channelId && t.userId === userId)
      );
      if (isTyping) {
        return { typingUsers: [...filtered, { userId, channelId, startedAt: Date.now() }] };
      }
      return { typingUsers: filtered };
    });
  },

  markChannelRead: (channelId) => {
    set((state) => ({
      channels: state.channels.map((ch) =>
        ch.id === channelId ? { ...ch, unreadCount: 0 } : ch
      ),
    }));
  },

  markDmRead: (dmId) => {
    set((state) => ({
      dmChannels: state.dmChannels.map((dm) =>
        dm.id === dmId ? { ...dm, unreadCount: 0 } : dm
      ),
    }));
  },

  getUserById: (id) => get().users[id],

  getChannelsByServer: (serverId) =>
    get().channels.filter((ch) => ch.serverId === serverId).sort((a, b) => a.position - b.position),

  getCategoriesByServer: (serverId) =>
    get().categories.filter((cat) => cat.serverId === serverId).sort((a, b) => a.position - b.position),

  getMessagesForChannel: (channelId) =>
    get().messages[channelId] ?? [],

  getDmRecipient: (dmId) => {
    const dm = get().dmChannels.find((d) => d.id === dmId);
    if (!dm) return undefined;
    return get().users[dm.recipientId];
  },
}));
