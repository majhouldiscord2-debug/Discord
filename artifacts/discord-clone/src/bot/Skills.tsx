import { useState } from "react";
import {
  Shield, MessageSquare, UserCheck, Bell, BarChart2, Gift,
  Star, Ticket, Music, Zap, Trophy, BookOpen, Hash, Clock,
  ShieldCheck, EyeOff,
} from "lucide-react";

interface Skill {
  id: number;
  name: string;
  description: string;
  category: string;
  level: "Basic" | "Advanced" | "Expert";
  icon: React.ReactNode;
  accentColor: string;
  enabled: boolean;
  tags: string[];
  stats?: { label: string; value: string }[];
}

const SKILLS: Skill[] = [
  {
    id: 1, name: "Auto Moderator",
    description: "Automatically detects and removes spam, hate speech, and rule-breaking content. Configurable filters with custom word lists, link detection, and invite blocking.",
    category: "Moderation", level: "Advanced", icon: <Shield className="w-5 h-5" />, accentColor: "#cc0000", enabled: true,
    tags: ["Spam", "Filter", "Auto-delete"],
    stats: [{ label: "Messages filtered", value: "2.1K" }, { label: "False positives", value: "0.3%" }],
  },
  {
    id: 2, name: "Welcome Messages",
    description: "Greets new members with a personalized welcome message in a designated channel or DM. Supports embed formatting, custom images, and member count display.",
    category: "Onboarding", level: "Basic", icon: <MessageSquare className="w-5 h-5" />, accentColor: "#cc0000", enabled: true,
    tags: ["Greet", "Embed", "DM"],
    stats: [{ label: "Members greeted", value: "847" }, { label: "DM open rate", value: "61%" }],
  },
  {
    id: 3, name: "Reaction Roles",
    description: "Let members self-assign roles by reacting to designated messages. Supports single-choice or multi-role setups with optional cooldown between changes.",
    category: "Roles", level: "Basic", icon: <UserCheck className="w-5 h-5" />, accentColor: "#cc0000", enabled: true,
    tags: ["Roles", "Reactions", "Self-assign"],
    stats: [{ label: "Roles assigned", value: "3.4K" }, { label: "Active menus", value: "5" }],
  },
  {
    id: 4, name: "Announcement Scheduler",
    description: "Schedule messages and announcements to be sent automatically at a specific time. Supports recurring messages, embeds, and role pings.",
    category: "Messaging", level: "Advanced", icon: <Bell className="w-5 h-5" />, accentColor: "#cc0000", enabled: false,
    tags: ["Schedule", "Ping", "Recurring"],
    stats: [{ label: "Messages sent", value: "128" }, { label: "Scheduled", value: "12" }],
  },
  {
    id: 5, name: "Server Analytics",
    description: "Track member growth, message activity, popular channels, and engagement metrics over time. View trends with daily, weekly, and monthly breakdowns.",
    category: "Insights", level: "Expert", icon: <BarChart2 className="w-5 h-5" />, accentColor: "#cc0000", enabled: true,
    tags: ["Stats", "Growth", "Activity"],
    stats: [{ label: "Data points", value: "18K" }, { label: "Active since", value: "90d" }],
  },
  {
    id: 6, name: "Giveaway Manager",
    description: "Run fair giveaways with automatic winner selection, role requirements, and re-roll support. Members enter by reacting and winners are announced automatically.",
    category: "Engagement", level: "Basic", icon: <Gift className="w-5 h-5" />, accentColor: "#cc0000", enabled: false,
    tags: ["Giveaway", "Random", "Reactions"],
    stats: [{ label: "Giveaways run", value: "14" }, { label: "Unique winners", value: "14" }],
  },
  {
    id: 7, name: "Leveling & XP",
    description: "Reward active members with XP for sending messages. Display leaderboards, assign level-up roles automatically, and customize XP multipliers per channel.",
    category: "Engagement", level: "Advanced", icon: <Trophy className="w-5 h-5" />, accentColor: "#cc0000", enabled: true,
    tags: ["XP", "Levels", "Leaderboard"],
    stats: [{ label: "Active users", value: "312" }, { label: "Top level", value: "47" }],
  },
  {
    id: 8, name: "Ticket System",
    description: "Create a private support ticket channel for each user request. Includes staff assignment, transcripts, category routing, and auto-close on inactivity.",
    category: "Support", level: "Advanced", icon: <Ticket className="w-5 h-5" />, accentColor: "#cc0000", enabled: false,
    tags: ["Support", "Tickets", "Staff"],
    stats: [{ label: "Tickets opened", value: "203" }, { label: "Avg. resolution", value: "4h" }],
  },
  {
    id: 9, name: "Starboard",
    description: "Highlight the best messages in a dedicated channel when they reach a configurable number of ⭐ reactions. Encourages quality content from your community.",
    category: "Engagement", level: "Basic", icon: <Star className="w-5 h-5" />, accentColor: "#cc0000", enabled: true,
    tags: ["Stars", "Highlight", "Content"],
    stats: [{ label: "Posts starred", value: "89" }, { label: "Reaction threshold", value: "5" }],
  },
  {
    id: 10, name: "Music Player",
    description: "Stream high-quality audio from YouTube, Spotify, and SoundCloud directly in voice channels. Supports queues, playlists, voting skip, and equalizer settings.",
    category: "Entertainment", level: "Expert", icon: <Music className="w-5 h-5" />, accentColor: "#cc0000", enabled: false,
    tags: ["Music", "Voice", "Queue"],
    stats: [{ label: "Songs played", value: "1.8K" }, { label: "Queue max", value: "200" }],
  },
  {
    id: 11, name: "Poll Creator",
    description: "Create interactive polls with multiple choice options, time limits, and live result display. Supports anonymous voting and results export.",
    category: "Engagement", level: "Basic", icon: <Hash className="w-5 h-5" />, accentColor: "#cc0000", enabled: false,
    tags: ["Poll", "Vote", "Results"],
    stats: [{ label: "Polls created", value: "34" }, { label: "Total votes", value: "2.2K" }],
  },
  {
    id: 12, name: "Auto Role",
    description: "Automatically assign roles to new members on join, after a set time delay, or based on verification completion. Supports tiered role progressions.",
    category: "Roles", level: "Basic", icon: <Zap className="w-5 h-5" />, accentColor: "#cc0000", enabled: true,
    tags: ["Roles", "Auto-assign", "New members"],
    stats: [{ label: "Roles assigned", value: "847" }, { label: "Delay", value: "10m" }],
  },
  {
    id: 13, name: "Server Rules",
    description: "Post and manage your server rules with a built-in rule builder. Members can acknowledge the rules through a button to receive a verified member role.",
    category: "Onboarding", level: "Basic", icon: <BookOpen className="w-5 h-5" />, accentColor: "#cc0000", enabled: true,
    tags: ["Rules", "Verification", "Onboarding"],
    stats: [{ label: "Verified members", value: "612" }, { label: "Acceptance rate", value: "94%" }],
  },
  {
    id: 14, name: "Slowmode Manager",
    description: "Dynamically adjust channel slowmode based on message volume. Automatically increases slowmode during message spikes to prevent flooding and reduce noise.",
    category: "Moderation", level: "Advanced", icon: <Clock className="w-5 h-5" />, accentColor: "#cc0000", enabled: false,
    tags: ["Slowmode", "Flood", "Dynamic"],
    stats: [{ label: "Activations", value: "47" }, { label: "Avg slowmode", value: "8s" }],
  },
  {
    id: 15, name: "Anti-Flag Protection",
    description: "Shields your account from Discord's automated detection systems. Applies randomized typing intervals, human-like message pacing, and dynamic cooldowns between actions. Backs off automatically when rate-limit signals are detected, rotates request timing patterns so no two actions follow the same cadence, and prevents rapid sequential API calls that trigger anomaly scoring.",
    category: "Protection", level: "Expert", icon: <ShieldCheck className="w-5 h-5" />, accentColor: "#cc0000", enabled: true,
    tags: ["Anti-flag", "Rate-limit", "Pacing", "Cooldown", "Stealth"],
    stats: [
      { label: "Actions protected", value: "100%" },
      { label: "Flag incidents", value: "0" },
      { label: "Avg jitter", value: "±1.2s" },
    ],
  },
  {
    id: 16, name: "Anti-Selfbot Masking",
    description: "Prevents Discord's self-bot detection from identifying automated behaviour. Sends the full Discord desktop client fingerprint on every request — including X-Super-Properties, X-Context-Properties, real browser User-Agent, X-Discord-Locale, and X-Debug-Options — making each request indistinguishable from the official Windows client. Adds session-aware headers, mimics invite-preview flows before joins, and applies randomised multi-step delays that replicate real human interaction patterns.",
    category: "Protection", level: "Expert", icon: <EyeOff className="w-5 h-5" />, accentColor: "#cc0000", enabled: true,
    tags: ["Anti-selfbot", "Fingerprint", "Headers", "Stealth", "Session"],
    stats: [
      { label: "Header layers", value: "11" },
      { label: "Detection score", value: "0%" },
      { label: "Client spoof", value: "v1.0.9180" },
    ],
  },
];

const CATEGORIES = ["All", "Protection", "Moderation", "Onboarding", "Roles", "Messaging", "Insights", "Engagement", "Support", "Entertainment"];
const LEVELS = ["All", "Basic", "Advanced", "Expert"];

const LEVEL_BADGES: Record<string, { bg: string; color: string; border: string }> = {
  Basic:    { bg: "rgba(204,0,0,0.08)",  color: "#cc0000", border: "rgba(204,0,0,0.22)" },
  Advanced: { bg: "rgba(204,0,0,0.12)",  color: "#dd1111", border: "rgba(221,17,17,0.28)" },
  Expert:   { bg: "rgba(255,0,0,0.18)",  color: "#ff2222", border: "rgba(255,34,34,0.35)" },
};

function SkillCard({ skill, onToggle }: { skill: Skill; onToggle: (id: number) => void }) {
  const badge = LEVEL_BADGES[skill.level];
  const isProtection = skill.category === "Protection";

  return (
    <div
      className="rounded-2xl flex flex-col gap-3 p-5 transition-all duration-200 cursor-default relative overflow-hidden"
      style={isProtection ? {
        background: "linear-gradient(135deg, #0a0000 0%, #1a0404 60%, #0d0000 100%)",
        border: "1.5px solid rgba(204,0,0,0.45)",
        boxShadow: "0 2px 24px rgba(0,0,0,0.55), 0 0 18px rgba(204,0,0,0.18)",
      } : {
        background: "#ffffff",
        border: "1.5px solid rgba(204,0,0,0.18)",
        boxShadow: "0 2px 20px rgba(0,0,0,0.18)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(-3px)";
        el.style.boxShadow = isProtection
          ? "0 12px 40px rgba(0,0,0,0.7), 0 0 32px rgba(204,0,0,0.38)"
          : "0 8px 32px rgba(0,0,0,0.22), 0 0 18px rgba(204,0,0,0.22)";
        el.style.borderColor = isProtection ? "rgba(204,0,0,0.75)" : "rgba(204,0,0,0.55)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "";
        el.style.boxShadow = isProtection
          ? "0 2px 24px rgba(0,0,0,0.55), 0 0 18px rgba(204,0,0,0.18)"
          : "0 2px 20px rgba(0,0,0,0.18)";
        el.style.borderColor = isProtection ? "rgba(204,0,0,0.45)" : "rgba(204,0,0,0.18)";
      }}
    >
      {isProtection && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 80% 20%, rgba(204,0,0,0.12) 0%, transparent 65%)",
          }}
        />
      )}

      {isProtection && (
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full z-10"
          style={{ background: "rgba(204,0,0,0.18)", border: "1px solid rgba(204,0,0,0.4)" }}>
          <div className="w-1.5 h-1.5 rounded-full bg-[#cc0000]"
            style={{ boxShadow: "0 0 6px #cc0000", animation: "pulse 2s infinite" }} />
          <span className="text-[8.5px] font-bold text-[#ff4444] uppercase tracking-widest">Active</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="rounded-xl p-2.5 shrink-0" style={isProtection
            ? { background: "rgba(204,0,0,0.18)", color: "#ff4444", boxShadow: "0 0 14px rgba(204,0,0,0.3)" }
            : { background: "rgba(204,0,0,0.08)", color: "#cc0000" }}>
            {skill.icon}
          </div>
          <div>
            <p className={`text-[13.5px] font-bold leading-tight ${isProtection ? "text-white" : "text-[#0a0000]"}`}>
              {skill.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}
              >
                {skill.level}
              </span>
              <span className="text-[10px]" style={{ color: isProtection ? "rgba(255,120,120,0.7)" : "#888" }}>
                {skill.category}
              </span>
            </div>
          </div>
        </div>

        {!isProtection && (
          <button
            onClick={() => onToggle(skill.id)}
            className="shrink-0 rounded-full transition-all duration-300 relative"
            style={{
              width: 38, height: 21,
              background: skill.enabled
                ? "linear-gradient(90deg, #cc0000, #ff2222)"
                : "rgba(0,0,0,0.12)",
              boxShadow: skill.enabled ? "0 0 14px rgba(204,0,0,0.55), 0 0 4px rgba(204,0,0,0.4)" : "none",
            }}
          >
            <div
              className="absolute top-[2.5px] rounded-full bg-white transition-all duration-300"
              style={{
                width: 16, height: 16,
                left: skill.enabled ? "calc(100% - 18px)" : 3,
                boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
              }}
            />
          </button>
        )}
      </div>

      <p className={`text-[11.5px] leading-relaxed line-clamp-3 ${isProtection ? "text-[rgba(255,200,200,0.75)]" : "text-[#555]"}`}>
        {skill.description}
      </p>

      {skill.stats && (
        <div
          className="flex gap-4 pt-1 pb-0.5"
          style={{ borderTop: `1px solid ${isProtection ? "rgba(204,0,0,0.25)" : "rgba(204,0,0,0.1)"}` }}
        >
          {skill.stats.map((s) => (
            <div key={s.label} className="flex flex-col">
              <span className="text-[13px] font-bold" style={{ color: isProtection ? "#ff6666" : "#cc0000" }}>
                {s.value}
              </span>
              <span className="text-[9px] uppercase tracking-wide" style={{ color: isProtection ? "rgba(255,150,150,0.55)" : "#999" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-1">
        {skill.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-full text-[9.5px] font-semibold"
            style={isProtection ? {
              background: "rgba(204,0,0,0.14)",
              color: "#ff6666",
              border: "1px solid rgba(204,0,0,0.35)",
            } : {
              background: "rgba(204,0,0,0.07)",
              color: "#cc0000",
              border: "1px solid rgba(204,0,0,0.18)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

const SKILLS_STORAGE_KEY = "tg_bot_skills_enabled";

function loadSavedStates(): Record<number, boolean> {
  try {
    const raw = localStorage.getItem(SKILLS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function applyStoredStates(base: Skill[]): Skill[] {
  const saved = loadSavedStates();
  return base.map((s) => (s.id in saved ? { ...s, enabled: saved[s.id] } : s));
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>(() => applyStoredStates(SKILLS));
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeLevel, setActiveLevel] = useState("All");

  function toggleSkill(id: number) {
    setSkills((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s));
      const states: Record<number, boolean> = {};
      next.forEach((s) => { states[s.id] = s.enabled; });
      try { localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(states)); } catch {}
      return next;
    });
  }

  const filtered = skills.filter((s) => {
    if (activeCategory !== "All" && s.category !== activeCategory) return false;
    if (activeLevel !== "All" && s.level !== activeLevel) return false;
    return true;
  });

  const enabledCount = skills.filter((s) => s.enabled).length;

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden" style={{ backgroundColor: "#000000" }}>

      <style>{`
        .skill-filter-btn {
          transition: all 0.18s ease;
        }
        .skill-filter-btn:hover {
          background: rgba(204,0,0,0.12) !important;
          color: #ff4444 !important;
          border-color: rgba(204,0,0,0.35) !important;
        }
      `}</style>

      {/* Header */}
      <div className="px-6 pt-5 pb-4 shrink-0" style={{ borderBottom: "1px solid rgba(204,0,0,0.14)" }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-[20px] font-black text-white tracking-tight" style={{ letterSpacing: "-0.02em" }}>
              Bot Skills
            </h1>
            <p className="text-[11.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.38)" }}>
              Manage and configure your bot's capabilities
            </p>
          </div>

          <div
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl"
            style={{
              background: "rgba(204,0,0,0.07)",
              border: "1px solid rgba(204,0,0,0.25)",
              boxShadow: "0 0 14px rgba(204,0,0,0.12)",
            }}
          >
            <div className="w-2 h-2 rounded-full bg-[#cc0000]" style={{ boxShadow: "0 0 8px #cc0000, 0 0 16px rgba(204,0,0,0.5)" }} />
            <span className="text-[12.5px] font-bold text-white">{enabledCount} active</span>
            <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.35)" }}>/ {skills.length} skills</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="skill-filter-btn px-3 py-1 rounded-lg text-[11px] font-bold tracking-wide transition-all"
              style={{
                background: activeCategory === cat
                  ? "linear-gradient(135deg, #cc0000, #ff2222)"
                  : "rgba(255,255,255,0.05)",
                color: activeCategory === cat ? "#fff" : "rgba(255,255,255,0.45)",
                border: `1px solid ${activeCategory === cat ? "#cc0000" : "rgba(255,255,255,0.08)"}`,
                boxShadow: activeCategory === cat ? "0 0 12px rgba(204,0,0,0.45)" : "none",
              }}
            >
              {cat}
            </button>
          ))}
          <div className="w-px h-4 mx-1" style={{ background: "rgba(204,0,0,0.25)" }} />
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setActiveLevel(lvl)}
              className="skill-filter-btn px-3 py-1 rounded-lg text-[11px] font-bold tracking-wide transition-all"
              style={{
                background: activeLevel === lvl
                  ? "linear-gradient(135deg, #cc0000, #ff2222)"
                  : "rgba(255,255,255,0.05)",
                color: activeLevel === lvl ? "#fff" : "rgba(255,255,255,0.45)",
                border: `1px solid ${activeLevel === lvl ? "#cc0000" : "rgba(255,255,255,0.08)"}`,
                boxShadow: activeLevel === lvl ? "0 0 12px rgba(204,0,0,0.45)" : "none",
              }}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Cards grid */}
      <div className="flex-1 overflow-y-auto discord-scrollbar p-5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2">
            <Star className="w-8 h-8" style={{ color: "rgba(204,0,0,0.35)" }} />
            <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.3)" }}>No skills match this filter</p>
          </div>
        ) : (
          <div className="grid gap-4 pb-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {filtered.map((skill) => (
              <SkillCard key={skill.id} skill={skill} onToggle={toggleSkill} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
