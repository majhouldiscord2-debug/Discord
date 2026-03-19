import { useState } from "react";
import { Zap, MessageSquare, Users, Shield, Bot, Cpu, Radio, GitBranch, RefreshCw, Globe, Lock, Activity, ChevronRight, Star } from "lucide-react";

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
    name: "Auto Responder",
    description: "Automatically replies to messages matching custom trigger words or patterns. Supports regex, wildcards, and rich embeds.",
    category: "Messaging",
    level: "Basic",
    icon: <MessageSquare className="w-5 h-5" />,
    accentColor: "#5865f2",
    enabled: true,
    tags: ["DM", "Channel", "Regex"],
    stats: [{ label: "Triggers", value: "12" }, { label: "Fired today", value: "847" }],
  },
  {
    id: 2,
    name: "Mass DM",
    description: "Send personalized direct messages to a list of users. Supports variable interpolation, delays, and rate-limit bypassing.",
    category: "Messaging",
    level: "Advanced",
    icon: <Radio className="w-5 h-5" />,
    accentColor: "#f43f5e",
    enabled: false,
    tags: ["DM", "Bulk", "Rate-limit"],
    stats: [{ label: "Sent", value: "4.2K" }, { label: "Open rate", value: "68%" }],
  },
  {
    id: 3,
    name: "Guild Joiner",
    description: "Automatically joins Discord servers using invite codes. Supports invite rotation, cooldown management, and join verification bypass.",
    category: "Servers",
    level: "Advanced",
    icon: <Users className="w-5 h-5" />,
    accentColor: "#06b6d4",
    enabled: true,
    tags: ["Invite", "Auto-join", "Rotation"],
    stats: [{ label: "Joined", value: "312" }, { label: "Invites queued", value: "58" }],
  },
  {
    id: 4,
    name: "Anti-Raid Shield",
    description: "Detects and neutralizes raid patterns in real time. Automatically bans, kicks, or mutes mass-join waves before they cause damage.",
    category: "Security",
    level: "Expert",
    icon: <Shield className="w-5 h-5" />,
    accentColor: "#22c55e",
    enabled: true,
    tags: ["Protection", "Auto-ban", "Detection"],
    stats: [{ label: "Raids blocked", value: "7" }, { label: "Accounts flagged", value: "1.1K" }],
  },
  {
    id: 5,
    name: "Token Checker",
    description: "Validates Discord tokens in bulk and returns account info including creation date, Nitro status, phone verification, and guilds.",
    category: "Tools",
    level: "Expert",
    icon: <Lock className="w-5 h-5" />,
    accentColor: "#f59e0b",
    enabled: false,
    tags: ["Token", "Validation", "Nitro"],
    stats: [{ label: "Checked", value: "9.8K" }, { label: "Valid", value: "3.4K" }],
  },
  {
    id: 6,
    name: "Webhook Spammer",
    description: "Delivers high-volume messages through Discord webhooks with custom embed support, avatar cycling, and username rotation.",
    category: "Messaging",
    level: "Advanced",
    icon: <Zap className="w-5 h-5" />,
    accentColor: "#a855f7",
    enabled: false,
    tags: ["Webhook", "Embed", "Rotation"],
    stats: [{ label: "Messages sent", value: "22K" }, { label: "Webhooks active", value: "14" }],
  },
  {
    id: 7,
    name: "Status Rotator",
    description: "Cycles through custom statuses and activity types on a timer. Supports custom emoji, Spotify spoofing, and game activity display.",
    category: "Stealth",
    level: "Basic",
    icon: <RefreshCw className="w-5 h-5" />,
    accentColor: "#10b981",
    enabled: true,
    tags: ["Status", "Activity", "Stealth"],
    stats: [{ label: "Statuses", value: "8" }, { label: "Cycle interval", value: "30s" }],
  },
  {
    id: 8,
    name: "Scraper",
    description: "Extracts member lists, message history, and metadata from any accessible server. Exports to JSON or CSV with filtering options.",
    category: "Tools",
    level: "Expert",
    icon: <GitBranch className="w-5 h-5" />,
    accentColor: "#fb923c",
    enabled: false,
    tags: ["Members", "Export", "History"],
    stats: [{ label: "Records scraped", value: "180K" }, { label: "Last run", value: "2h ago" }],
  },
  {
    id: 9,
    name: "AI Chat Agent",
    description: "Runs a local AI persona inside any channel or DM. Generates context-aware replies, bypasses spam filters, and mimics human typing patterns.",
    category: "AI",
    level: "Expert",
    icon: <Cpu className="w-5 h-5" />,
    accentColor: "#6366f1",
    enabled: false,
    tags: ["AI", "ChatBot", "Human-like"],
    stats: [{ label: "Messages handled", value: "5.6K" }, { label: "Avg response", value: "1.2s" }],
  },
  {
    id: 10,
    name: "Proxy Router",
    description: "Routes all bot traffic through a rotating residential proxy pool. Prevents IP bans and rate-limit aggregation across accounts.",
    category: "Stealth",
    level: "Expert",
    icon: <Globe className="w-5 h-5" />,
    accentColor: "#38bdf8",
    enabled: true,
    tags: ["Proxy", "Stealth", "Residential"],
    stats: [{ label: "IPs in pool", value: "240" }, { label: "Rotations/hr", value: "48" }],
  },
  {
    id: 11,
    name: "Activity Faker",
    description: "Simulates realistic user activity including typing indicators, read receipts, and online presence to avoid detection algorithms.",
    category: "Stealth",
    level: "Advanced",
    icon: <Activity className="w-5 h-5" />,
    accentColor: "#e879f9",
    enabled: true,
    tags: ["Stealth", "Typing", "Presence"],
    stats: [{ label: "Sessions faked", value: "1.2K" }, { label: "Detection rate", value: "0%" }],
  },
  {
    id: 12,
    name: "Self Bot",
    description: "Full self-bot framework with command prefix, plugin loader, and hotkey bindings. Runs invisibly alongside your Discord client.",
    category: "AI",
    level: "Expert",
    icon: <Bot className="w-5 h-5" />,
    accentColor: "#f97316",
    enabled: false,
    tags: ["Self-bot", "Commands", "Plugins"],
    stats: [{ label: "Commands loaded", value: "34" }, { label: "Plugins", value: "9" }],
  },
  {
    id: 13,
    name: "hCaptcha Solver",
    description: "Automatically solves hCaptcha challenges in real time using AI vision models. Bypasses Discord's verification gates with a high solve rate and low detection footprint.",
    category: "Security",
    level: "Expert",
    icon: <Shield className="w-5 h-5" />,
    accentColor: "#eab308",
    enabled: false,
    tags: ["Captcha", "Bypass", "AI Vision"],
    stats: [{ label: "Solve rate", value: "97.4%" }, { label: "Avg time", value: "1.8s" }],
  },
];

const CATEGORIES = ["All", "Messaging", "Servers", "Security", "Tools", "Stealth", "AI"];
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
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg p-2 shrink-0" style={{ background: `${skill.accentColor}20`, color: skill.accentColor }}>
            {skill.icon}
          </div>
          <div>
            <p className="text-[13px] font-bold text-[#f2f3f5] leading-tight">{skill.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                style={{ background: `${LEVEL_COLORS[skill.level]}18`, color: LEVEL_COLORS[skill.level] }}>
                {skill.level}
              </span>
              <span className="text-[10px] text-[#4e5058]">{skill.category}</span>
            </div>
          </div>
        </div>

        {/* Toggle */}
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
            style={{
              width: 16, height: 16,
              left: skill.enabled ? "calc(100% - 18px)" : 2,
              boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
            }}
          />
        </button>
      </div>

      {/* Description */}
      <p className="text-[11px] text-[#949ba4] leading-relaxed line-clamp-2">{skill.description}</p>

      {/* Stats */}
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

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {skill.tags.map((tag) => (
          <span key={tag} className="px-1.5 py-0.5 rounded text-[9px] font-medium"
            style={{ background: `${skill.accentColor}15`, color: skill.accentColor, border: `1px solid ${skill.accentColor}25` }}>
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
    setSkills((prev) => prev.map((s) => s.id === id ? { ...s, enabled: !s.enabled } : s));
  }

  const filtered = skills.filter((s) => {
    if (activeCategory !== "All" && s.category !== activeCategory) return false;
    if (activeLevel !== "All" && s.level !== activeLevel) return false;
    return true;
  });

  const enabledCount = skills.filter((s) => s.enabled).length;

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden" style={{ backgroundColor: "#0a0f1e" }}>
      {/* Header */}
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

        {/* Category filter */}
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

      {/* Grid */}
      <div className="flex-1 overflow-y-auto discord-scrollbar p-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2">
            <Star className="w-8 h-8 text-[#4e5058]" />
            <p className="text-[#4e5058] text-[13px]">No skills match this filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {filtered.map((skill) => (
              <SkillCard key={skill.id} skill={skill} onToggle={toggleSkill} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
