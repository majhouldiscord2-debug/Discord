import { useState } from "react";
import {
  Shield, MessageSquare, UserCheck, Bell, BarChart2, Gift,
  Star, Ticket, Music, Zap, Trophy, BookOpen, Hash, Clock,
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
    id: 1,
    name: "Auto Moderator",
    description: "Automatically detects and removes spam, hate speech, and rule-breaking content. Configurable filters with custom word lists, link detection, and invite blocking.",
    category: "Moderation",
    level: "Advanced",
    icon: <Shield className="w-5 h-5" />,
    accentColor: "#22c55e",
    enabled: true,
    tags: ["Spam", "Filter", "Auto-delete"],
    stats: [{ label: "Messages filtered", value: "2.1K" }, { label: "False positives", value: "0.3%" }],
  },
  {
    id: 2,
    name: "Welcome Messages",
    description: "Greets new members with a personalized welcome message in a designated channel or DM. Supports embed formatting, custom images, and member count display.",
    category: "Onboarding",
    level: "Basic",
    icon: <MessageSquare className="w-5 h-5" />,
    accentColor: "#5865f2",
    enabled: true,
    tags: ["Greet", "Embed", "DM"],
    stats: [{ label: "Members greeted", value: "847" }, { label: "DM open rate", value: "61%" }],
  },
  {
    id: 3,
    name: "Reaction Roles",
    description: "Let members self-assign roles by reacting to designated messages. Supports single-choice or multi-role setups with optional cooldown between changes.",
    category: "Roles",
    level: "Basic",
    icon: <UserCheck className="w-5 h-5" />,
    accentColor: "#06b6d4",
    enabled: true,
    tags: ["Roles", "Reactions", "Self-assign"],
    stats: [{ label: "Roles assigned", value: "3.4K" }, { label: "Active menus", value: "5" }],
  },
  {
    id: 4,
    name: "Announcement Scheduler",
    description: "Schedule messages and announcements to be sent automatically at a specific time. Supports recurring messages, embeds, and role pings.",
    category: "Messaging",
    level: "Advanced",
    icon: <Bell className="w-5 h-5" />,
    accentColor: "#f59e0b",
    enabled: false,
    tags: ["Schedule", "Ping", "Recurring"],
    stats: [{ label: "Messages sent", value: "128" }, { label: "Scheduled", value: "12" }],
  },
  {
    id: 5,
    name: "Server Analytics",
    description: "Track member growth, message activity, popular channels, and engagement metrics over time. View trends with daily, weekly, and monthly breakdowns.",
    category: "Insights",
    level: "Expert",
    icon: <BarChart2 className="w-5 h-5" />,
    accentColor: "#8b5cf6",
    enabled: true,
    tags: ["Stats", "Growth", "Activity"],
    stats: [{ label: "Data points", value: "18K" }, { label: "Active since", value: "90d" }],
  },
  {
    id: 6,
    name: "Giveaway Manager",
    description: "Run fair giveaways with automatic winner selection, role requirements, and re-roll support. Members enter by reacting and winners are announced automatically.",
    category: "Engagement",
    level: "Basic",
    icon: <Gift className="w-5 h-5" />,
    accentColor: "#ec4899",
    enabled: false,
    tags: ["Giveaway", "Random", "Reactions"],
    stats: [{ label: "Giveaways run", value: "14" }, { label: "Unique winners", value: "14" }],
  },
  {
    id: 7,
    name: "Leveling & XP",
    description: "Reward active members with XP for sending messages. Display leaderboards, assign level-up roles automatically, and customize XP multipliers per channel.",
    category: "Engagement",
    level: "Advanced",
    icon: <Trophy className="w-5 h-5" />,
    accentColor: "#f97316",
    enabled: true,
    tags: ["XP", "Levels", "Leaderboard"],
    stats: [{ label: "Active users", value: "312" }, { label: "Top level", value: "47" }],
  },
  {
    id: 8,
    name: "Ticket System",
    description: "Create a private support ticket channel for each user request. Includes staff assignment, transcripts, category routing, and auto-close on inactivity.",
    category: "Support",
    level: "Advanced",
    icon: <Ticket className="w-5 h-5" />,
    accentColor: "#14b8a6",
    enabled: false,
    tags: ["Support", "Tickets", "Staff"],
    stats: [{ label: "Tickets opened", value: "203" }, { label: "Avg. resolution", value: "4h" }],
  },
  {
    id: 9,
    name: "Starboard",
    description: "Highlight the best messages in a dedicated channel when they reach a configurable number of ⭐ reactions. Encourages quality content from your community.",
    category: "Engagement",
    level: "Basic",
    icon: <Star className="w-5 h-5" />,
    accentColor: "#eab308",
    enabled: true,
    tags: ["Stars", "Highlight", "Content"],
    stats: [{ label: "Posts starred", value: "89" }, { label: "Reaction threshold", value: "5" }],
  },
  {
    id: 10,
    name: "Music Player",
    description: "Stream high-quality audio from YouTube, Spotify, and SoundCloud directly in voice channels. Supports queues, playlists, voting skip, and equalizer settings.",
    category: "Entertainment",
    level: "Expert",
    icon: <Music className="w-5 h-5" />,
    accentColor: "#10b981",
    enabled: false,
    tags: ["Music", "Voice", "Queue"],
    stats: [{ label: "Songs played", value: "1.8K" }, { label: "Queue max", value: "200" }],
  },
  {
    id: 11,
    name: "Poll Creator",
    description: "Create interactive polls with multiple choice options, time limits, and live result display. Supports anonymous voting and results export.",
    category: "Engagement",
    level: "Basic",
    icon: <Hash className="w-5 h-5" />,
    accentColor: "#6366f1",
    enabled: false,
    tags: ["Poll", "Vote", "Results"],
    stats: [{ label: "Polls created", value: "34" }, { label: "Total votes", value: "2.2K" }],
  },
  {
    id: 12,
    name: "Auto Role",
    description: "Automatically assign roles to new members on join, after a set time delay, or based on verification completion. Supports tiered role progressions.",
    category: "Roles",
    level: "Basic",
    icon: <Zap className="w-5 h-5" />,
    accentColor: "#f43f5e",
    enabled: true,
    tags: ["Roles", "Auto-assign", "New members"],
    stats: [{ label: "Roles assigned", value: "847" }, { label: "Delay", value: "10m" }],
  },
  {
    id: 13,
    name: "Server Rules",
    description: "Post and manage your server rules with a built-in rule builder. Members can acknowledge the rules through a button to receive a verified member role.",
    category: "Onboarding",
    level: "Basic",
    icon: <BookOpen className="w-5 h-5" />,
    accentColor: "#38bdf8",
    enabled: true,
    tags: ["Rules", "Verification", "Onboarding"],
    stats: [{ label: "Verified members", value: "612" }, { label: "Acceptance rate", value: "94%" }],
  },
  {
    id: 14,
    name: "Slowmode Manager",
    description: "Dynamically adjust channel slowmode based on message volume. Automatically increases slowmode during message spikes to prevent flooding and reduce noise.",
    category: "Moderation",
    level: "Advanced",
    icon: <Clock className="w-5 h-5" />,
    accentColor: "#a78bfa",
    enabled: false,
    tags: ["Slowmode", "Flood", "Dynamic"],
    stats: [{ label: "Activations", value: "47" }, { label: "Avg slowmode", value: "8s" }],
  },
];

const CATEGORIES = ["All", "Moderation", "Onboarding", "Roles", "Messaging", "Insights", "Engagement", "Support", "Entertainment"];
const LEVELS = ["All", "Basic", "Advanced", "Expert"];

const LEVEL_COLORS: Record<string, string> = {
  Basic: "#22c55e",
  Advanced: "#f59e0b",
  Expert: "#ef4444",
};

function SkillCard({ skill, onToggle }: { skill: Skill; onToggle: (id: number) => void }) {
  return (
    <div
      className="rounded-xl flex flex-col gap-3 p-4 transition-all duration-200 cursor-default"
      style={{
        background: `linear-gradient(160deg, ${skill.accentColor}12 0%, #0a0f1e 60%)`,
        border: `1px solid ${skill.accentColor}30`,
        boxShadow: `0 2px 16px rgba(0,0,0,0.3)`,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(-2px)";
        el.style.boxShadow = `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${skill.accentColor}50`;
        el.style.borderColor = `${skill.accentColor}55`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "";
        el.style.boxShadow = "0 2px 16px rgba(0,0,0,0.3)";
        el.style.borderColor = `${skill.accentColor}30`;
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg p-2 shrink-0" style={{ background: `${skill.accentColor}20`, color: skill.accentColor }}>
            {skill.icon}
          </div>
          <div>
            <p className="text-[13px] font-bold text-[#f2f3f5] leading-tight">{skill.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                style={{ background: `${LEVEL_COLORS[skill.level]}18`, color: LEVEL_COLORS[skill.level] }}
              >
                {skill.level}
              </span>
              <span className="text-[10px] text-[#4e5058]">{skill.category}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onToggle(skill.id)}
          className="shrink-0 rounded-full transition-all duration-300 relative"
          style={{
            width: 36, height: 20,
            background: skill.enabled ? skill.accentColor : "rgba(255,255,255,0.1)",
            boxShadow: skill.enabled ? `0 0 10px ${skill.accentColor}60` : "none",
          }}
        >
          <div
            className="absolute top-0.5 rounded-full bg-white transition-all duration-300"
            style={{ width: 16, height: 16, left: skill.enabled ? "calc(100% - 18px)" : 2, boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
          />
        </button>
      </div>

      <p className="text-[11px] text-[#949ba4] leading-relaxed line-clamp-2">{skill.description}</p>

      {skill.stats && (
        <div className="flex gap-3">
          {skill.stats.map((s) => (
            <div key={s.label} className="flex flex-col">
              <span className="text-[12px] font-bold" style={{ color: skill.accentColor }}>{s.value}</span>
              <span className="text-[9px] text-[#4e5058] uppercase tracking-wide">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-1">
        {skill.tags.map((tag) => (
          <span
            key={tag}
            className="px-1.5 py-0.5 rounded text-[9px] font-medium"
            style={{ background: `${skill.accentColor}15`, color: skill.accentColor, border: `1px solid ${skill.accentColor}25` }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SkillsPage() {
  const [skills, setSkills] = useState(SKILLS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeLevel, setActiveLevel] = useState("All");

  function toggleSkill(id: number) {
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  }

  const filtered = skills.filter((s) => {
    if (activeCategory !== "All" && s.category !== activeCategory) return false;
    if (activeLevel !== "All" && s.level !== activeLevel) return false;
    return true;
  });

  const enabledCount = skills.filter((s) => s.enabled).length;

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden" style={{ backgroundColor: "#0a0f1e" }}>
      <div className="px-6 pt-5 pb-4 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-[18px] font-bold text-[#f2f3f5]">Bot Skills</h1>
            <p className="text-[12px] text-[#4e5058] mt-0.5">Manage and configure your bot's capabilities</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="w-2 h-2 rounded-full bg-[#22c55e]" style={{ boxShadow: "0 0 6px #22c55e" }} />
            <span className="text-[12px] font-semibold text-[#f2f3f5]">{enabledCount} active</span>
            <span className="text-[12px] text-[#4e5058]">/ {skills.length} skills</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all"
              style={{
                background: activeCategory === cat ? "#5865f2" : "rgba(255,255,255,0.05)",
                color: activeCategory === cat ? "#fff" : "#949ba4",
                border: `1px solid ${activeCategory === cat ? "#5865f2" : "rgba(255,255,255,0.07)"}`,
              }}
            >
              {cat}
            </button>
          ))}
          <div className="w-px h-4 mx-1" style={{ background: "rgba(255,255,255,0.08)" }} />
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setActiveLevel(lvl)}
              className="px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all"
              style={{
                background: activeLevel === lvl ? (lvl === "All" ? "#5865f2" : LEVEL_COLORS[lvl] + "cc") : "rgba(255,255,255,0.05)",
                color: activeLevel === lvl ? "#fff" : "#949ba4",
                border: `1px solid ${activeLevel === lvl ? (lvl === "All" ? "#5865f2" : LEVEL_COLORS[lvl]) : "rgba(255,255,255,0.07)"}`,
              }}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto discord-scrollbar p-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2">
            <Star className="w-8 h-8 text-[#4e5058]" />
            <p className="text-[#4e5058] text-[13px]">No skills match this filter</p>
          </div>
        ) : (
          <div className="grid gap-3 pb-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {filtered.map((skill) => (
              <SkillCard key={skill.id} skill={skill} onToggle={toggleSkill} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
