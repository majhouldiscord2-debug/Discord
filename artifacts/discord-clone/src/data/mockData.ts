import type { User, Server, Channel, Category, Message, DmChannel } from "@/types";

export const CURRENT_USER_ID = "user-me";

export const users: Record<string, User> = {
  "user-me": {
    id: "user-me",
    username: "majhoul.gg",
    displayName: "MajHouL",
    discriminator: "0001",
    avatarColor: "#cc0000",
    initials: "M",
    status: "online",
    statusText: "Building something cool",
    isCurrentUser: true,
  },
  "user-nova": {
    id: "user-nova",
    username: "nova_storm",
    displayName: "nova_storm",
    discriminator: "1234",
    avatarColor: "#3ba55c",
    initials: "N",
    status: "online",
    statusText: "Playing Valorant",
  },
  "user-pixel": {
    id: "user-pixel",
    username: "pixelwitch",
    displayName: "Pixel Witch",
    discriminator: "5678",
    avatarColor: "#ed4245",
    initials: "P",
    status: "online",
    statusText: "Listening to Spotify",
  },
  "user-drift": {
    id: "user-drift",
    username: "driftwood",
    displayName: "driftwood",
    discriminator: "9012",
    avatarColor: "#faa61a",
    initials: "D",
    status: "idle",
    statusText: "Away for a bit",
  },
  "user-ghost": {
    id: "user-ghost",
    username: "ghostline",
    displayName: "Ghostline",
    discriminator: "3456",
    avatarColor: "#747f8d",
    initials: "G",
    status: "dnd",
    statusText: "In a deep focus session",
  },
  "user-lunar": {
    id: "user-lunar",
    username: "lunarbyte",
    displayName: "lunarbyte",
    discriminator: "7890",
    avatarColor: "#cc0000",
    initials: "L",
    status: "offline",
    statusText: "Last seen 2 hours ago",
  },
  "user-raven": {
    id: "user-raven",
    username: "ravencloak",
    displayName: "RavenCloak",
    discriminator: "2345",
    avatarColor: "#8b0000",
    initials: "R",
    status: "offline",
  },
  "user-storm": {
    id: "user-storm",
    username: "stormchaser",
    displayName: "StormChaser",
    discriminator: "6789",
    avatarColor: "#1abc9c",
    initials: "S",
    status: "online",
    statusText: "Working on a project",
  },
  "user-zeph": {
    id: "user-zeph",
    username: "zephyrcode",
    displayName: "ZephyrCode",
    discriminator: "0123",
    avatarColor: "#e67e22",
    initials: "Z",
    status: "idle",
  },
  "user-cosmic": {
    id: "user-cosmic",
    username: "cosmicdust",
    displayName: "CosmicDust",
    discriminator: "4567",
    avatarColor: "#eb459e",
    initials: "C",
    status: "online",
  },
};

export const servers: Server[] = [
  { id: "srv-react", name: "Reactiflux", initials: "⚛", iconColor: "#61dafb", ownerId: "user-nova", notificationCount: 3 },
  { id: "srv-nextjs", name: "Next.js", initials: "N", iconColor: "#0f172a", ownerId: "user-pixel" },
  { id: "srv-tailwind", name: "Tailwind CSS", initials: "T", iconColor: "#e05050", ownerId: "user-storm" },
  { id: "srv-lofi", name: "Lofi Chill Zone", initials: "🎵", iconColor: "#8b0000", ownerId: "user-drift", notificationCount: 1 },
  { id: "srv-games", name: "Game Night HQ", initials: "🎮", iconColor: "#e74c3c", ownerId: "user-ghost" },
  { id: "srv-oss", name: "Open Source Hub", initials: "OS", iconColor: "#27ae60", ownerId: "user-me" },
];

export const categories: Category[] = [
  { id: "cat-info", serverId: "srv-react", name: "Information", position: 0 },
  { id: "cat-general", serverId: "srv-react", name: "General", position: 1 },
  { id: "cat-help", serverId: "srv-react", name: "Help & Support", position: 2 },
  { id: "cat-info2", serverId: "srv-nextjs", name: "Information", position: 0 },
  { id: "cat-dev", serverId: "srv-nextjs", name: "Development", position: 1 },
  { id: "cat-oss-info", serverId: "srv-oss", name: "Information", position: 0 },
  { id: "cat-oss-dev", serverId: "srv-oss", name: "Development", position: 1 },
  { id: "cat-oss-community", serverId: "srv-oss", name: "Community", position: 2 },
];

export const channels: Channel[] = [
  { id: "ch-rules", serverId: "srv-react", name: "rules", type: "text", position: 0, categoryId: "cat-info", topic: "Server rules and guidelines" },
  { id: "ch-announcements", serverId: "srv-react", name: "announcements", type: "announcement", position: 1, categoryId: "cat-info", topic: "Official announcements" },
  { id: "ch-general", serverId: "srv-react", name: "general", type: "text", position: 2, categoryId: "cat-general", topic: "General React discussion", unreadCount: 12 },
  { id: "ch-showcase", serverId: "srv-react", name: "showcase", type: "text", position: 3, categoryId: "cat-general", topic: "Show off your React projects" },
  { id: "ch-help", serverId: "srv-react", name: "help", type: "text", position: 4, categoryId: "cat-help", topic: "Get help with React questions", unreadCount: 5 },
  { id: "ch-hooks", serverId: "srv-react", name: "hooks", type: "text", position: 5, categoryId: "cat-help", topic: "React hooks discussion" },

  { id: "ch-next-announce", serverId: "srv-nextjs", name: "announcements", type: "announcement", position: 0, categoryId: "cat-info2" },
  { id: "ch-next-general", serverId: "srv-nextjs", name: "general", type: "text", position: 1, categoryId: "cat-dev", topic: "General Next.js chat", unreadCount: 7 },
  { id: "ch-next-app-router", serverId: "srv-nextjs", name: "app-router", type: "text", position: 2, categoryId: "cat-dev", topic: "App Router specific discussion" },
  { id: "ch-next-help", serverId: "srv-nextjs", name: "help", type: "text", position: 3, categoryId: "cat-dev" },

  { id: "ch-oss-readme", serverId: "srv-oss", name: "readme", type: "text", position: 0, categoryId: "cat-oss-info" },
  { id: "ch-oss-general", serverId: "srv-oss", name: "general", type: "text", position: 1, categoryId: "cat-oss-community", topic: "Open source chat", unreadCount: 2 },
  { id: "ch-oss-projects", serverId: "srv-oss", name: "projects", type: "text", position: 2, categoryId: "cat-oss-dev", topic: "Share your open source projects" },
  { id: "ch-oss-prs", serverId: "srv-oss", name: "pull-requests", type: "text", position: 3, categoryId: "cat-oss-dev", topic: "PR reviews and discussions" },

  { id: "ch-lofi-chill", serverId: "srv-lofi", name: "chill-chat", type: "text", position: 0, topic: "Relax and chat", unreadCount: 1 },
  { id: "ch-lofi-music", serverId: "srv-lofi", name: "music-recs", type: "text", position: 1, topic: "Share your playlist" },

  { id: "ch-games-lobby", serverId: "srv-games", name: "lobby", type: "text", position: 0, topic: "Game night lobby" },
  { id: "ch-games-lfg", serverId: "srv-games", name: "looking-for-group", type: "text", position: 1, topic: "Find players to game with" },

  { id: "ch-tailwind-general", serverId: "srv-tailwind", name: "general", type: "text", position: 0, topic: "Tailwind CSS discussion" },
  { id: "ch-tailwind-showcase", serverId: "srv-tailwind", name: "showcase", type: "text", position: 1, topic: "Share your Tailwind designs" },
];

export const dmChannels: DmChannel[] = [
  { id: "dm-nova", recipientId: "user-nova", unreadCount: 2, lastMessageAt: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: "dm-pixel", recipientId: "user-pixel", lastMessageAt: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: "dm-drift", recipientId: "user-drift", lastMessageAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: "dm-ghost", recipientId: "user-ghost", lastMessageAt: new Date(Date.now() - 24 * 3600000).toISOString() },
  { id: "dm-lunar", recipientId: "user-lunar", lastMessageAt: new Date(Date.now() - 48 * 3600000).toISOString() },
  { id: "dm-storm", recipientId: "user-storm", lastMessageAt: new Date(Date.now() - 10 * 60000).toISOString() },
  { id: "dm-zeph", recipientId: "user-zeph", lastMessageAt: new Date(Date.now() - 4 * 3600000).toISOString() },
];

function ts(minutesAgo: number): string {
  return new Date(Date.now() - minutesAgo * 60000).toISOString();
}

export const initialMessages: Record<string, Message[]> = {
  "ch-general": [
    { id: "msg-1", channelId: "ch-general", authorId: "user-nova", content: "Hey everyone! Just shipped a new hook library using React 19 concurrent features 🚀", timestamp: ts(180) },
    { id: "msg-2", channelId: "ch-general", authorId: "user-pixel", content: "Oh nice! What's the library called? I've been looking for something like that", timestamp: ts(178) },
    { id: "msg-3", channelId: "ch-general", authorId: "user-nova", content: "It's called `react-concurrent-tools` — still in beta but working great so far", timestamp: ts(177) },
    { id: "msg-4", channelId: "ch-general", authorId: "user-storm", content: "Anyone else noticed the performance improvements in the latest React 19 release? My app went from 3.2s to 1.1s TTI after upgrading", timestamp: ts(150) },
    { id: "msg-5", channelId: "ch-general", authorId: "user-ghost", content: "Yeah the compiler optimizations are crazy good. Memoization is basically automatic now", timestamp: ts(148) },
    { id: "msg-6", channelId: "ch-general", authorId: "user-zeph", content: "Has anyone tried the new `use()` hook with Suspense? I'm confused about the error boundaries setup", timestamp: ts(120) },
    { id: "msg-7", channelId: "ch-general", authorId: "user-pixel", content: "Yeah it's a bit different — you need to wrap in a Suspense boundary AND an ErrorBoundary. Once you get the pattern it's super clean though", timestamp: ts(118) },
    { id: "msg-8", channelId: "ch-general", authorId: "user-drift", content: "Good morning everyone! What are we discussing today?", timestamp: ts(60) },
    { id: "msg-9", channelId: "ch-general", authorId: "user-nova", content: "Good morning! We were talking about React 19 perf improvements and concurrent features", timestamp: ts(58) },
    { id: "msg-10", channelId: "ch-general", authorId: "user-me", content: "Just joined — this place is super active 👋", timestamp: ts(30) },
    { id: "msg-11", channelId: "ch-general", authorId: "user-nova", content: "Welcome! Yeah it's a great community. We share a lot of cool stuff here", timestamp: ts(28) },
    { id: "msg-12", channelId: "ch-general", authorId: "user-storm", content: "What stack are you using these days?", timestamp: ts(25) },
    { id: "msg-13", channelId: "ch-general", authorId: "user-me", content: "React + Vite + Tailwind. Trying to figure out the best state management approach for a medium-sized app", timestamp: ts(22) },
    { id: "msg-14", channelId: "ch-general", authorId: "user-ghost", content: "Zustand all the way. I switched from Redux and never looked back — way simpler API", timestamp: ts(20) },
    { id: "msg-15", channelId: "ch-general", authorId: "user-pixel", content: "+1 for Zustand. Jotai is also great if you want more atomic state", timestamp: ts(18) },
    { id: "msg-16", channelId: "ch-general", authorId: "user-me", content: "Thanks for the suggestions! I'll check out Zustand", timestamp: ts(10) },
  ],

  "ch-help": [
    { id: "help-1", channelId: "ch-help", authorId: "user-zeph", content: "I keep getting this error: `Cannot read properties of undefined (reading 'map')` — any idea what's causing it?", timestamp: ts(90) },
    { id: "help-2", channelId: "ch-help", authorId: "user-pixel", content: "Sounds like your data isn't loaded yet when the component renders. Try adding a loading check before the map", timestamp: ts(88) },
    { id: "help-3", channelId: "ch-help", authorId: "user-zeph", content: "Ohh yeah I see it now — I forgot to handle the undefined case. Thanks!", timestamp: ts(85) },
    { id: "help-4", channelId: "ch-help", authorId: "user-storm", content: "Quick tip: always default your arrays — `const items = data?.items ?? []` saves a lot of these bugs", timestamp: ts(82) },
    { id: "help-5", channelId: "ch-help", authorId: "user-drift", content: "How do you properly type a ref that can be multiple element types? Like `HTMLDivElement | HTMLButtonElement`", timestamp: ts(45) },
    { id: "help-6", channelId: "ch-help", authorId: "user-ghost", content: "Use `useRef<HTMLDivElement | HTMLButtonElement>(null)` — or use `HTMLElement` if you don't need the specifics", timestamp: ts(42) },
    { id: "help-7", channelId: "ch-help", authorId: "user-drift", content: "That's clean, thanks!", timestamp: ts(40) },
  ],

  "ch-next-general": [
    { id: "next-1", channelId: "ch-next-general", authorId: "user-pixel", content: "Anyone have experience migrating from Pages Router to App Router on a large codebase?", timestamp: ts(200) },
    { id: "next-2", channelId: "ch-next-general", authorId: "user-storm", content: "Done it for two big projects. Biggest thing: understand the Server vs Client component boundary upfront", timestamp: ts(198) },
    { id: "next-3", channelId: "ch-next-general", authorId: "user-nova", content: "Yeah — I'd suggest migrating route by route rather than all at once", timestamp: ts(196) },
    { id: "next-4", channelId: "ch-next-general", authorId: "user-ghost", content: "The `next/navigation` vs `next/router` swap trips people up too — different APIs", timestamp: ts(150) },
    { id: "next-5", channelId: "ch-next-general", authorId: "user-me", content: "Been loving `next/image` in App Router — the performance is noticeably better", timestamp: ts(40) },
    { id: "next-6", channelId: "ch-next-general", authorId: "user-storm", content: "Agreed. And `generateStaticParams` is so much cleaner than `getStaticPaths`", timestamp: ts(35) },
  ],

  "ch-oss-general": [
    { id: "oss-1", channelId: "ch-oss-general", authorId: "user-storm", content: "Just merged my 100th PR! 🎉 What a journey open source has been", timestamp: ts(120) },
    { id: "oss-2", channelId: "ch-oss-general", authorId: "user-nova", content: "Congrats!! That's a huge milestone", timestamp: ts(118) },
    { id: "oss-3", channelId: "ch-oss-general", authorId: "user-me", content: "Amazing! What project?", timestamp: ts(115) },
    { id: "oss-4", channelId: "ch-oss-general", authorId: "user-storm", content: "A CLI tool for generating TypeScript interfaces from OpenAPI specs. Super useful for API-heavy projects", timestamp: ts(112) },
    { id: "oss-5", channelId: "ch-oss-general", authorId: "user-zeph", content: "Oh I've used something like that before! Would love to check it out", timestamp: ts(30) },
  ],

  "ch-lofi-chill": [
    { id: "lofi-1", channelId: "ch-lofi-chill", authorId: "user-drift", content: "Good vibes only 🌿", timestamp: ts(60) },
    { id: "lofi-2", channelId: "ch-lofi-chill", authorId: "user-lunar", content: "Anyone else coding late at night to lofi beats right now?", timestamp: ts(45) },
    { id: "lofi-3", channelId: "ch-lofi-chill", authorId: "user-raven", content: "Every single night 😂", timestamp: ts(43) },
    { id: "lofi-4", channelId: "ch-lofi-chill", authorId: "user-drift", content: "There's something magical about late-night coding sessions. The focus is unreal", timestamp: ts(40) },
  ],

  "dm-nova": [
    { id: "dm-nova-1", channelId: "dm-nova", authorId: "user-nova", content: "Hey! Did you see the new React 19 docs? There's some wild stuff in there", timestamp: ts(25) },
    { id: "dm-nova-2", channelId: "dm-nova", authorId: "user-me", content: "Just skimming through now. The new `use()` hook is interesting", timestamp: ts(22) },
    { id: "dm-nova-3", channelId: "dm-nova", authorId: "user-nova", content: "Right? And the actions API for forms is going to change how we handle mutations", timestamp: ts(20) },
    { id: "dm-nova-4", channelId: "dm-nova", authorId: "user-me", content: "Agreed. No more manual loading/error states for every form 🙌", timestamp: ts(18) },
    { id: "dm-nova-5", channelId: "dm-nova", authorId: "user-nova", content: "Exactly. Anyway — want to pair on that Zustand refactor later?", timestamp: ts(5) },
  ],

  "dm-storm": [
    { id: "dm-storm-1", channelId: "dm-storm", authorId: "user-storm", content: "Hey! Do you want to collaborate on that open source CLI project?", timestamp: ts(15) },
    { id: "dm-storm-2", channelId: "dm-storm", authorId: "user-me", content: "Absolutely! I've been looking for a project to contribute to. What's the stack?", timestamp: ts(12) },
    { id: "dm-storm-3", channelId: "dm-storm", authorId: "user-storm", content: "Node.js + TypeScript + Commander.js. Pretty straightforward. I'll send the repo link", timestamp: ts(10) },
  ],
};

export const simulatedMessages: Record<string, Array<{ authorId: string; content: string }>> = {
  "ch-general": [
    { authorId: "user-nova", content: "Anyone seen the new React compiler beta updates?" },
    { authorId: "user-storm", content: "Just read about it — the auto-memoization is really impressive" },
    { authorId: "user-pixel", content: "The ecosystem is evolving so fast, I love it 🔥" },
    { authorId: "user-ghost", content: "Are you all using TypeScript strict mode? I find it catches so many bugs early" },
    { authorId: "user-zeph", content: "Strict mode is mandatory for me now. Can't imagine going back" },
    { authorId: "user-drift", content: "Has anyone tried bun as a runtime? Curious about real-world performance" },
  ],
  "ch-next-general": [
    { authorId: "user-nova", content: "Server Actions are so clean for form handling in Next.js now" },
    { authorId: "user-storm", content: "The Partial Prerendering RFC looks super promising too" },
    { authorId: "user-pixel", content: "Vercel's been shipping a lot lately — good time to be a Next.js dev" },
  ],
  "ch-oss-general": [
    { authorId: "user-storm", content: "First time contributor tip: look for `good first issue` labels!" },
    { authorId: "user-zeph", content: "Documentation improvements are always welcome too and great to start with" },
    { authorId: "user-nova", content: "Writing tests is another underrated way to get familiar with a codebase" },
  ],
  "dm-nova": [
    { authorId: "user-nova", content: "Yeah let's do the pairing session! What time works for you?" },
    { authorId: "user-nova", content: "I was thinking we start with the store layer and work outward" },
  ],
};
