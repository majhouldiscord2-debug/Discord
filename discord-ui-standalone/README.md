# Discord UI Clone — Standalone

A pixel-accurate Discord interface clone built with React, Vite, TypeScript, and Tailwind CSS.
100% static — no backend, no database, no authentication needed.

## What's included

- Server list (left strip) with animated hover effects and tooltips
- Friends list with Online / All / Pending / Blocked / Add Friend tabs
- Direct Messages sidebar with 8 contacts and status indicators
- Active Now panel
- Full Discord dark theme colors
- Online / idle / DND / offline status badges on avatars
- Notification badges on servers
- Mute / deafen / settings buttons in the user bar

## Quick Start

Make sure you have **Node.js 18+** and **npm** (or **pnpm**) installed.

```bash
# 1. Enter the folder
cd discord-ui-standalone

# 2. Install dependencies
npm install
# or: pnpm install

# 3. Start the dev server
npm run dev
# or: pnpm dev

# 4. Open in your browser
# http://localhost:5173
```

## Build for production

```bash
npm run build
# Output goes to: dist/
```

To preview the production build locally:

```bash
npm run preview
```

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 19 | UI framework |
| Vite 7 | Build tool & dev server |
| TypeScript | Type safety |
| Tailwind CSS v4 | Utility-first styling |
| Lucide React | Icons |
| Wouter | Client-side routing |
| Framer Motion | Animations |
| TanStack Query | (scaffolded, ready for API use) |

## Project Structure

```
discord-ui-standalone/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── App.tsx               # Root app with router
    ├── main.tsx              # Entry point
    ├── index.css             # Global styles & Discord theme vars
    ├── lib/
    │   ├── mock-data.ts      # All fictional users, friends, servers
    │   └── utils.ts          # Utility: cn() class merger
    ├── components/
    │   ├── Avatar.tsx        # Avatar with status dot
    │   ├── ServerList.tsx    # Left server strip
    │   ├── Sidebar.tsx       # DM sidebar + nav
    │   ├── FriendsList.tsx   # Main friends panel
    │   ├── ActiveNow.tsx     # Right "Active Now" panel
    │   └── ui/               # Shadcn/ui base components
    ├── hooks/
    │   ├── use-mobile.tsx
    │   └── use-toast.ts
    └── pages/
        └── Home.tsx          # Main page layout
```

## Customizing

- **Change users / friends / servers:** Edit `src/lib/mock-data.ts`
- **Change colors:** Edit the CSS variables at the top of `src/index.css`
- **Add pages:** Create a new file in `src/pages/` and add a route in `src/App.tsx`
