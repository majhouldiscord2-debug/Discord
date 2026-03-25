export type UserStatus = "online" | "idle" | "dnd" | "offline";

export interface User {
  id: string;
  username: string;
  displayName: string;
  discriminator: string;
  avatarColor: string;
  initials: string;
  status: UserStatus;
  statusText?: string;
  bot?: boolean;
  isCurrentUser?: boolean;
}

export interface Message {
  id: string;
  channelId: string;
  authorId: string;
  content: string;
  timestamp: string;
  editedAt?: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  contentType?: string;
  width?: number;
  height?: number;
}

export type ChannelType = "text" | "voice" | "announcement" | "forum";

export interface Channel {
  id: string;
  serverId: string;
  name: string;
  type: ChannelType;
  topic?: string;
  position: number;
  categoryId?: string;
  unreadCount?: number;
}

export interface Category {
  id: string;
  serverId: string;
  name: string;
  position: number;
}

export interface Server {
  id: string;
  name: string;
  initials: string;
  iconColor: string;
  ownerId: string;
  notificationCount?: number;
  iconUrl?: string;
  profile?: number;
  invite?: string;
  description?: string;
  tags?: string[];
}

export interface DmChannel {
  id: string;
  recipientId: string;
  unreadCount?: number;
  lastMessageAt?: string;
}

export interface TypingUser {
  userId: string;
  channelId: string;
  startedAt: number;
}
