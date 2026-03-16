export type UserStatus = "online" | "idle" | "dnd" | "offline";

export interface User {
  id: string | number;
  name: string;
  status: UserStatus;
  statusText?: string;
  avatarColor: string;
  initials: string;
}

export const currentUser: User = {
  id: "me",
  name: "! MajHouL",
  statusText: "Getting members for our s...",
  status: "online",
  avatarColor: "bg-indigo-600",
  initials: "M"
};

export const friendsOnline: User[] = [
  { id: 1, name: "| Amaan", status: "online", statusText: "Playing VS Code", avatarColor: "bg-blue-500", initials: "A" }
];

export const allFriends: User[] = [
  ...friendsOnline,
  { id: 2, name: "Monkey D luffy", status: "offline", avatarColor: "bg-yellow-500", initials: "M" },
  { id: 3, name: "SaMi♥🗡🐭", status: "offline", avatarColor: "bg-rose-500", initials: "S" },
  { id: 4, name: "ARCHIS", status: "offline", avatarColor: "bg-orange-500", initials: "A" },
];

export const dmContacts: User[] = [
  { id: 1, name: "Saumitra@", status: "online", avatarColor: "bg-emerald-500", initials: "S" },
  { id: 2, name: "Monkey D luffy", status: "idle", avatarColor: "bg-yellow-500", initials: "M" },
  { id: 3, name: "SaMi♥🗡🐭", status: "dnd", avatarColor: "bg-rose-500", initials: "S" },
  { id: 4, name: "Boaaa", status: "offline", avatarColor: "bg-purple-500", initials: "B" },
  { id: 5, name: "itzxx.prateem", status: "online", avatarColor: "bg-indigo-500", initials: "I" },
  { id: 6, name: "ARCHIS", status: "dnd", avatarColor: "bg-orange-500", initials: "A" },
  { id: 7, name: "magicalbus", status: "online", avatarColor: "bg-pink-500", initials: "m" },
  { id: 8, name: "farp", status: "idle", avatarColor: "bg-cyan-500", initials: "f" }
];

export const servers = [
  { id: 1, name: "Reactiflux", initials: "R", color: "bg-blue-600", hasNotification: false },
  { id: 2, name: "Next.js", initials: "N", color: "bg-slate-800", hasNotification: true },
  { id: 3, name: "Tailwind", initials: "T", color: "bg-sky-500", hasNotification: false }
];
