export type UserStatus = "online" | "idle" | "dnd" | "offline";

export interface User {
  id: string | number;
  name: string;
  username: string;
  status: UserStatus;
  statusText?: string;
  avatarColor: string;
  initials: string;
}

export const currentUser: User = {
  id: "me",
  name: "! MajHouL",
  username: "majhoul.gg",
  statusText: "Getting members for our server",
  status: "dnd",
  avatarColor: "#111214",
  initials: "M",
};

export const friendsOnline: User[] = [
  {
    id: 1,
    name: "nova_storm",
    username: "nova_storm",
    status: "online",
    statusText: "Online",
    avatarColor: "#3ba55c",
    initials: "N",
  },
  {
    id: 2,
    name: "pixelwitch",
    username: "pixelwitch",
    status: "online",
    statusText: "Playing Valorant",
    avatarColor: "#ed4245",
    initials: "P",
  },
  {
    id: 3,
    name: "driftwood",
    username: "driftwood",
    status: "idle",
    statusText: "Idle",
    avatarColor: "#faa61a",
    initials: "D",
  },
];

export const pendingFriends: User[] = [
  {
    id: 10,
    name: "cosmicdust",
    username: "cosmicdust",
    status: "online",
    statusText: "Incoming Friend Request",
    avatarColor: "#eb459e",
    initials: "C",
  },
];

export const allFriends: User[] = [
  ...friendsOnline,
  {
    id: 4,
    name: "ghostline",
    username: "ghostline",
    status: "dnd",
    statusText: "Do Not Disturb",
    avatarColor: "#747f8d",
    initials: "G",
  },
  {
    id: 5,
    name: "lunarbyte",
    username: "lunarbyte",
    status: "offline",
    statusText: "Last seen 2 hours ago",
    avatarColor: "#cc0000",
    initials: "L",
  },
  {
    id: 6,
    name: "ravencloak",
    username: "ravencloak",
    status: "offline",
    statusText: "Offline",
    avatarColor: "#8b0000",
    initials: "R",
  },
];

export const dmContacts: User[] = [
  {
    id: 1,
    name: "nova_storm",
    username: "nova_storm",
    status: "online",
    avatarColor: "#3ba55c",
    initials: "N",
  },
  {
    id: 2,
    name: "pixelwitch",
    username: "pixelwitch",
    status: "online",
    avatarColor: "#ed4245",
    initials: "P",
  },
  {
    id: 3,
    name: "driftwood",
    username: "driftwood",
    status: "idle",
    avatarColor: "#faa61a",
    initials: "D",
  },
  {
    id: 4,
    name: "ghostline",
    username: "ghostline",
    status: "dnd",
    avatarColor: "#747f8d",
    initials: "G",
  },
  {
    id: 5,
    name: "lunarbyte",
    username: "lunarbyte",
    status: "offline",
    avatarColor: "#cc0000",
    initials: "L",
  },
  {
    id: 6,
    name: "ravencloak",
    username: "ravencloak",
    status: "offline",
    avatarColor: "#8b0000",
    initials: "R",
  },
  {
    id: 7,
    name: "stormchaser",
    username: "stormchaser",
    status: "offline",
    avatarColor: "#1abc9c",
    initials: "S",
  },
  {
    id: 8,
    name: "zephyrcode",
    username: "zephyrcode",
    status: "idle",
    avatarColor: "#e67e22",
    initials: "Z",
  },
];

export interface Server {
  id: number;
  name: string;
  initials: string;
  color: string;
  hasNotification: boolean;
  notificationCount?: number;
  iconUrl?: string;
}

export const servers: Server[] = [
  {
    id: 1,
    name: "Reactiflux",
    initials: "⚛",
    color: "#61dafb",
    hasNotification: true,
    notificationCount: 3,
  },
  {
    id: 2,
    name: "Next.js",
    initials: "N",
    color: "#000000",
    hasNotification: false,
  },
  {
    id: 3,
    name: "Tailwind CSS",
    initials: "T",
    color: "#e05050",
    hasNotification: false,
  },
  {
    id: 4,
    name: "Lofi Chill Zone",
    initials: "🎵",
    color: "#8b0000",
    hasNotification: true,
    notificationCount: 1,
  },
  {
    id: 5,
    name: "Game Night HQ",
    initials: "🎮",
    color: "#e74c3c",
    hasNotification: false,
  },
  {
    id: 6,
    name: "Open Source Hub",
    initials: "OS",
    color: "#27ae60",
    hasNotification: false,
  },
];
