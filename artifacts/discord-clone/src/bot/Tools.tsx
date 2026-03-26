import { useState, useId, useEffect } from "react";
import { getToolSettings, saveToolSettings, type ServerMentioConfig } from "@/lib/api";
import {
  ChevronDown, ChevronLeft, Zap, Star, Plus, Trash2, ToggleLeft, ToggleRight,
  Clock, MessageSquare, Server, AtSign, Shield, Radio, Users, Hash,
  ChevronUp, Wifi,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AutomationItem {
  id: number;
  name: string;
  gradient: string;
  glowColor: string;
  ring?: string;
  description?: string;
  icon?: string;
  darkBg?: string;
}

const automationItems: AutomationItem[] = [
  {
    id: 1,
    name: "Mentio",
    gradient: "from-[#001a3a] via-[#004695] to-[#002855]",
    glowColor: "#1CF8FF",
    ring: "border-cyan-400",
    description: "Grow your Discord server FAST with active joins and smart @ mentions\nPerfect adversting services — start boosting your members instantly!",
    icon: "mentionitor",
    darkBg: "#001a3a",
  },
  { id: 2,  name: "Inboxer",    gradient: "from-[#2a0030] via-[#6a0060] to-[#180020]", glowColor: "#e879f9", ring: "border-fuchsia-400", darkBg: "#2a0030" },
  { id: 3,  name: "Questor",   gradient: "from-[#002a00] via-[#0a5a0a] to-[#001800]", glowColor: "#22c55e", ring: "border-green-500", darkBg: "#002a00" },
  { id: 4,  name: "Replify",    gradient: "from-[#1a1000] via-[#3d2a00] to-[#0d0800]", glowColor: "#f59e0b", ring: "border-amber-400", darkBg: "#1a1000" },
  { id: 5,  name: "GuildJoiner", gradient: "from-[#1a0000] via-[#2a0000] to-[#080000]", glowColor: "#e05050", ring: "border-red-700", darkBg: "#1a0000" },
  { id: 6,  name: "Bumper",     gradient: "from-[#2e0a0a] via-[#4e0a1a] to-[#1a0d0d]", glowColor: "#f43f5e", ring: "border-rose-500" },
  { id: 7,  name: "Messager",   gradient: "from-[#001e2e] via-[#003a52] to-[#000f1a]", glowColor: "#0ea5e9", ring: "border-sky-500" },
  { id: 8,  name: "Automation", gradient: "from-[#1a0a2e] via-[#2d0a4e] to-[#0d0d1a]", glowColor: "#7c3aed", ring: "border-purple-600" },
  { id: 9,  name: "Automation", gradient: "from-[#1a0a2e] via-[#2d0a4e] to-[#0d0d1a]", glowColor: "#7c3aed", ring: "border-purple-600" },
];

// ─── Linked servers for Mentio (IDs 10–14 from bot/Server.tsx) ────────────────
const MENTIO_SERVERS: Omit<ServerMentioConfig, "enabled" | "mentionCount" | "cooldownMin" | "channelHook" | "activityOnly">[] = [
  {
    serverId: 10,
    guildId: "1320917906346868876",
    name: "Blox Fruits Trading Server",
    inviteCode: "legacytrading",
    logoUrl: "https://cdn.discordapp.com/icons/1320917906346868876/a_204d5b403207b4a8fe13b5ba628c86f8.gif?size=64",
    accentColor: "#f97316",
  },
  {
    serverId: 11,
    guildId: "1320854419532812431",
    name: "Blox Fruits Trading Server",
    inviteCode: "blox-fruit",
    logoUrl: "https://cdn.discordapp.com/icons/1320854419532812431/a_4113fa484c36bab0bd7df1224d9365c4.gif?size=64",
    accentColor: "#eab308",
  },
  {
    serverId: 12,
    guildId: "1165018533349044315",
    name: "BF Trading | Stock Notifier",
    inviteCode: "bfts",
    logoUrl: "https://cdn.discordapp.com/icons/1320917906346868876/a_204d5b403207b4a8fe13b5ba628c86f8.gif?size=64",
    accentColor: "#d97706",
  },
  {
    serverId: 13,
    guildId: "1218556281539788840",
    name: "Blox Fruits Trading Server",
    inviteCode: "bloxfruitstrading",
    logoUrl: "https://cdn.discordapp.com/icons/1218556281539788840/6850a0401154036ae4d319e0396fbf8e.png?size=64",
    accentColor: "#22c55e",
  },
  {
    serverId: 14,
    guildId: "888721743601094678",
    name: "ScammerAlert!",
    inviteCode: "scammeralert",
    logoUrl: "https://cdn.discordapp.com/icons/888721743601094678/a_96b48c1c030b62740af6ca673eeea8d7.gif?size=64",
    accentColor: "#ef4444",
  },
];

function defaultServerConfigs(): ServerMentioConfig[] {
  return MENTIO_SERVERS.map((s) => ({
    ...s,
    enabled: true,
    mentionCount: 3,
    cooldownMin: 5,
    channelHook: "",
    activityOnly: true,
  }));
}

// ─── SVG icons ────────────────────────────────────────────────────────────────

function MentionitorAvatar({ size = 72 }: { size?: number }) {
  const uid = useId().replace(/:/g, "m");
  const bgId = `${uid}bg`; const glowId = `${uid}glow`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={bgId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#004695" /><stop offset="100%" stopColor="#001a3a" />
        </radialGradient>
        <filter id={glowId}>
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx="50" cy="50" r="48" fill={`url(#${bgId})`} />
      <circle cx="50" cy="50" r="44" stroke="#1CF8FF" strokeWidth="0.4" strokeOpacity="0.3" />
      <line x1="50" y1="6" x2="50" y2="14" stroke="#1CF8FF" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="94" y1="50" x2="86" y2="50" stroke="#1CF8FF" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="6" y1="50" x2="14" y2="50" stroke="#1CF8FF" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="50" y1="94" x2="50" y2="86" stroke="#1CF8FF" strokeWidth="1" strokeOpacity="0.4" />
      <circle cx="50" cy="6" r="1.5" fill="#1CF8FF" fillOpacity="0.6" />
      <circle cx="94" cy="50" r="1.5" fill="#1CF8FF" fillOpacity="0.6" />
      <circle cx="6" cy="50" r="1.5" fill="#1CF8FF" fillOpacity="0.6" />
      <circle cx="50" cy="94" r="1.5" fill="#1CF8FF" fillOpacity="0.6" />
      <line x1="78" y1="22" x2="72" y2="28" stroke="#1CF8FF" strokeWidth="0.8" strokeOpacity="0.3" />
      <line x1="22" y1="22" x2="28" y2="28" stroke="#1CF8FF" strokeWidth="0.8" strokeOpacity="0.3" />
      <line x1="78" y1="78" x2="72" y2="72" stroke="#1CF8FF" strokeWidth="0.8" strokeOpacity="0.3" />
      <line x1="22" y1="78" x2="28" y2="72" stroke="#1CF8FF" strokeWidth="0.8" strokeOpacity="0.3" />
      <circle cx="78" cy="22" r="1" fill="#B5FFFE" fillOpacity="0.5" /><circle cx="22" cy="22" r="1" fill="#B5FFFE" fillOpacity="0.5" />
      <circle cx="78" cy="78" r="1" fill="#B5FFFE" fillOpacity="0.5" /><circle cx="22" cy="78" r="1" fill="#B5FFFE" fillOpacity="0.5" />
      <circle cx="50" cy="50" r="26" fill="#002855" fillOpacity="0.8" />
      <circle cx="50" cy="50" r="26" stroke="#1CF8FF" strokeWidth="1.5" strokeOpacity="0.8" filter={`url(#${glowId})`} />
      <text x="50" y="57" textAnchor="middle" fontSize="28" fontFamily="Arial, sans-serif" fontWeight="bold" fill="#1CF8FF" filter={`url(#${glowId})`}>@</text>
      <circle cx="30" cy="20" r="1.2" fill="#1CF8FF" fillOpacity="0.5" /><circle cx="70" cy="20" r="1.2" fill="#1CF8FF" fillOpacity="0.5" />
      <circle cx="20" cy="35" r="0.8" fill="#B5FFFE" fillOpacity="0.4" /><circle cx="80" cy="35" r="0.8" fill="#B5FFFE" fillOpacity="0.4" />
      <circle cx="20" cy="65" r="0.8" fill="#B5FFFE" fillOpacity="0.4" /><circle cx="80" cy="65" r="0.8" fill="#B5FFFE" fillOpacity="0.4" />
    </svg>
  );
}

function WumpusFace({ size = "md" }: { size?: "xs" | "sm" | "md" }) {
  const s = size === "xs" ? 18 : size === "sm" ? 24 : 36;
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
      <ellipse cx="20" cy="22" rx="16" ry="14" fill="#4a4b51" />
      <ellipse cx="20" cy="20" rx="12" ry="11" fill="#36373d" />
      <ellipse cx="14" cy="16" rx="4" ry="5" fill="#cc0000" opacity="0.8" />
      <ellipse cx="26" cy="16" rx="4" ry="5" fill="#cc0000" opacity="0.8" />
      <ellipse cx="14" cy="16" rx="2" ry="2.5" fill="white" />
      <ellipse cx="26" cy="16" rx="2" ry="2.5" fill="white" />
      <path d="M16 26 Q20 29 24 26" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
    </svg>
  );
}

function WumpusIcon({ item }: { item: AutomationItem }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 45%, ${item.glowColor}25 0%, transparent 65%)` }} />
      <div className="relative flex flex-col items-center gap-1">
        <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center overflow-hidden"
          style={{ borderColor: item.glowColor, backgroundColor: item.darkBg ?? "#0a0000", boxShadow: `0 0 20px ${item.glowColor}50` }}>
          {item.icon === "mentionitor" ? <MentionitorAvatar size={56} /> : <WumpusFace size="md" />}
        </div>
        <div className="w-16 h-2 bg-white/15 rounded-full" /><div className="w-12 h-1.5 bg-white/10 rounded-full" />
      </div>
    </div>
  );
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function ToggleSwitch({ on, onToggle, color = "#cc0000" }: { on: boolean; onToggle: () => void; color?: string }) {
  return (
    <button onClick={onToggle} className="transition-all duration-200" style={{ color: on ? color : "rgba(0,0,0,0.2)" }}>
      {on ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
    </button>
  );
}

function SectionLabel({ label }: { label: string }) {
  return <p className="text-[10px] font-black tracking-widest uppercase mb-2 mt-5" style={{ color: "#cc0000" }}>{label}</p>;
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl px-3 overflow-hidden" style={{ backgroundColor: "#fff", border: "1.5px solid rgba(204,0,0,0.15)", boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}>
      {children}
    </div>
  );
}

function SettingRow({ icon, label, description, children, last }: { icon: React.ReactNode; label: string; description?: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3" style={last ? undefined : { borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(204,0,0,0.07)", color: "#cc0000" }}>
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-[#111]">{label}</div>
          {description && <div className="text-[11px] text-[#888] mt-0.5">{description}</div>}
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

// ─── Per-server accordion row ─────────────────────────────────────────────────

function ServerConfigRow({
  config,
  onChange,
  last,
}: {
  config: ServerMentioConfig;
  onChange: (updated: ServerMentioConfig) => void;
  last?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const ac = config.accentColor;

  function set<K extends keyof ServerMentioConfig>(key: K, val: ServerMentioConfig[K]) {
    onChange({ ...config, [key]: val });
  }

  return (
    <div style={last ? undefined : { borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
      {/* Header row */}
      <div className="flex items-center gap-3 py-3">
        <img src={config.logoUrl} alt="" className="w-9 h-9 rounded-full object-cover shrink-0 border-2"
          style={{ borderColor: ac + "60" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-bold text-[#111] truncate">{config.name}</div>
          <div className="text-[10px] font-mono text-[#999]">discord.gg/{config.inviteCode}</div>
        </div>
        <div className="flex items-center gap-2">
          {/* Enabled badge */}
          <div className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: config.enabled ? ac + "18" : "rgba(0,0,0,0.06)",
              color: config.enabled ? ac : "#aaa",
              border: `1px solid ${config.enabled ? ac + "40" : "transparent"}`,
            }}>
            {config.enabled ? "ON" : "OFF"}
          </div>
          <ToggleSwitch on={config.enabled} onToggle={() => set("enabled", !config.enabled)} color={ac} />
          <button onClick={() => setExpanded((v) => !v)} className="w-6 h-6 flex items-center justify-center text-[#aaa] hover:text-[#555] transition-colors">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded settings */}
      {expanded && (
        <div className="pb-4 pl-12 pr-2 flex flex-col gap-3">

          {/* Mention count */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AtSign className="w-3.5 h-3.5 shrink-0" style={{ color: ac }} />
              <div>
                <div className="text-[12px] font-semibold text-[#222]">Mentions per run</div>
                <div className="text-[10px] text-[#999]">@ pings to send each cycle</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => set("mentionCount", Math.max(1, config.mentionCount - 1))}
                className="w-6 h-6 rounded-lg text-[#666] hover:text-white hover:bg-[#cc0000] flex items-center justify-center transition-colors text-[14px] font-bold">−</button>
              <span className="w-7 text-center text-[13px] font-bold text-[#111]">{config.mentionCount}</span>
              <button onClick={() => set("mentionCount", Math.min(20, config.mentionCount + 1))}
                className="w-6 h-6 rounded-lg text-[#666] hover:text-white hover:bg-[#cc0000] flex items-center justify-center transition-colors text-[14px] font-bold">+</button>
            </div>
          </div>

          {/* Cooldown */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: ac }} />
              <div>
                <div className="text-[12px] font-semibold text-[#222]">Cooldown</div>
                <div className="text-[10px] text-[#999]">Minutes between runs</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number" min="1" max="1440" value={config.cooldownMin}
                onChange={(e) => set("cooldownMin", Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center text-[12px] font-bold rounded-xl py-1 outline-none text-[#111]"
                style={{ backgroundColor: "rgba(204,0,0,0.05)", border: "1.5px solid rgba(204,0,0,0.18)" }}
              />
              <span className="text-[10px] text-[#aaa]">min</span>
            </div>
          </div>

          {/* Channel hook */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 shrink-0">
              <Hash className="w-3.5 h-3.5 shrink-0" style={{ color: ac }} />
              <div>
                <div className="text-[12px] font-semibold text-[#222]">Channel hook</div>
                <div className="text-[10px] text-[#999]">Specific channel ID / name</div>
              </div>
            </div>
            <input
              type="text" placeholder="general" value={config.channelHook}
              onChange={(e) => set("channelHook", e.target.value)}
              className="w-28 text-[11px] rounded-xl px-2 py-1 outline-none text-[#222] placeholder:text-[#ccc] font-mono"
              style={{ backgroundColor: "rgba(204,0,0,0.04)", border: "1.5px solid rgba(204,0,0,0.15)" }}
            />
          </div>

          {/* Activity only */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 shrink-0" style={{ color: ac }} />
              <div>
                <div className="text-[12px] font-semibold text-[#222]">Active members only</div>
                <div className="text-[10px] text-[#999]">Skip offline / idle users</div>
              </div>
            </div>
            <ToggleSwitch on={config.activityOnly} onToggle={() => set("activityOnly", !config.activityOnly)} color={ac} />
          </div>

        </div>
      )}
    </div>
  );
}

// ─── Mentio-specific full edit panel ─────────────────────────────────────────

function MentioEditPanel({ item, onBack }: { item: AutomationItem; onBack: () => void }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [smartMention, setSmartMention] = useState(true);
  const [dmMode, setDmMode] = useState(false);
  const [autoJoin, setAutoJoin] = useState(true);
  const [safeMode, setSafeMode] = useState(false);
  const [quickWave, setQuickWave] = useState(false);
  const [delay, setDelay] = useState("3");
  const [serverConfigs, setServerConfigs] = useState<ServerMentioConfig[]>(defaultServerConfigs);
  const [messages, setMessages] = useState<string[]>(["Hey! Check this out 👋", "Join us! 🚀"]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    getToolSettings(item.id).then((s) => {
      setSmartMention(s.smartMention);
      setDmMode(s.dmMode);
      setAutoJoin(s.autoJoin);
      setSafeMode(s.safeMode ?? false);
      setQuickWave(s.quickWave ?? false);
      setDelay(String(s.delay));
      if (Array.isArray(s.messages) && s.messages.length) setMessages(s.messages);
      if (Array.isArray(s.serverConfigs) && s.serverConfigs.length) {
        // Merge saved configs onto current MENTIO_SERVERS list (preserves new servers added later)
        const saved = s.serverConfigs as ServerMentioConfig[];
        setServerConfigs(
          MENTIO_SERVERS.map((base) => saved.find((c) => c.serverId === base.serverId) ?? { ...base, enabled: true, mentionCount: 3, cooldownMin: 5, channelHook: "", activityOnly: true })
        );
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [item.id]);

  function updateServerConfig(index: number, updated: ServerMentioConfig) {
    setServerConfigs((prev) => prev.map((c, i) => (i === index ? updated : c)));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await saveToolSettings({
        toolId: item.id,
        autoJoin,
        smartMention,
        dmMode,
        delay: parseInt(delay, 10) || 3,
        safeMode,
        quickWave,
        servers: serverConfigs.filter((c) => c.enabled).map((c) => c.name),
        messages,
        serverConfigs,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } finally {
      setSaving(false);
    }
  }

  const enabledCount = serverConfigs.filter((c) => c.enabled).length;

  if (loading) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "#000" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#1CF8FF transparent transparent transparent" }} />
          <span className="text-[13px] text-[#999]">Loading settings…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col animate-modal-slide-in" style={{ backgroundColor: "#000" }}>
      {/* Header */}
      <div className="shrink-0 flex items-center gap-3 px-4 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(204,0,0,0.15)" }}>
        <button onClick={onBack} className="flex items-center gap-1.5 text-[#999] hover:text-white transition-colors group">
          <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors group-hover:bg-white/10">
            <ChevronLeft className="w-5 h-5" />
          </div>
        </button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: "#1CF8FF", boxShadow: "0 0 8px #1CF8FF" }} />
          <span className="text-[15px] font-bold text-white truncate">Mentio — Settings</span>
        </div>
        {/* Quick summary badge */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold"
          style={{ backgroundColor: "rgba(28,248,255,0.1)", color: "#1CF8FF", border: "1px solid rgba(28,248,255,0.25)" }}>
          <Wifi className="w-3 h-3" />
          {enabledCount}/{serverConfigs.length} servers
        </div>
      </div>

      <div className="flex-1 overflow-y-auto discord-scrollbar px-5 pb-4 pt-1">

        {/* ── Global toggles ── */}
        <SectionLabel label="Global Settings" />
        <Card>
          <SettingRow icon={<Shield className="w-4 h-4" />} label="SAFE Mode"
            description="Slower rate, no mass-pings — stays under radar">
            <ToggleSwitch on={safeMode} onToggle={() => setSafeMode((v) => !v)} />
          </SettingRow>
          <SettingRow icon={<Zap className="w-4 h-4" />} label="Quick Wave"
            description="Pre-set burst: 5 mentions, 2 min CD, all servers">
            <ToggleSwitch on={quickWave} onToggle={() => setQuickWave((v) => !v)} />
          </SettingRow>
          <SettingRow icon={<AtSign className="w-4 h-4" />} label="Smart Mentions"
            description="Target recently active members only">
            <ToggleSwitch on={smartMention} onToggle={() => setSmartMention((v) => !v)} />
          </SettingRow>
          <SettingRow icon={<Server className="w-4 h-4" />} label="Auto-Join Servers"
            description="Join servers before mentioning">
            <ToggleSwitch on={autoJoin} onToggle={() => setAutoJoin((v) => !v)} />
          </SettingRow>
          <SettingRow icon={<MessageSquare className="w-4 h-4" />} label="DM Mode"
            description="Send mentions via direct messages">
            <ToggleSwitch on={dmMode} onToggle={() => setDmMode((v) => !v)} />
          </SettingRow>
          <SettingRow icon={<Clock className="w-4 h-4" />} label="Global Delay" description="Seconds between each action" last>
            <input type="number" min="1" max="120" value={delay} onChange={(e) => setDelay(e.target.value)}
              className="w-16 text-center text-[13px] font-bold rounded-xl py-1.5 outline-none text-[#111]"
              style={{ backgroundColor: "rgba(204,0,0,0.06)", border: "1.5px solid rgba(204,0,0,0.2)" }} />
          </SettingRow>
        </Card>

        {/* ── Per-server config ── */}
        <SectionLabel label={`Linked Servers (${enabledCount} active)`} />
        <Card>
          {serverConfigs.map((cfg, i) => (
            <ServerConfigRow
              key={cfg.serverId}
              config={cfg}
              onChange={(updated) => updateServerConfig(i, updated)}
              last={i === serverConfigs.length - 1}
            />
          ))}
        </Card>

        {/* ── Message templates ── */}
        <SectionLabel label="Message Templates" />
        <div className="rounded-2xl px-3 pb-2" style={{ backgroundColor: "#fff", border: "1.5px solid rgba(204,0,0,0.15)", boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}>
          {messages.map((m, i) => (
            <div key={i} className="flex items-start gap-2 py-2.5" style={i < messages.length - 1 ? { borderBottom: "1px solid rgba(0,0,0,0.06)" } : undefined}>
              <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#cc0000]" />
              <span className="flex-1 text-[12px] text-[#333] leading-relaxed">{m}</span>
              <button onClick={() => setMessages(messages.filter((_, j) => j !== i))} className="text-[#ccc] hover:text-[#ed4245] transition-colors shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <div className="flex items-center gap-2 pt-2">
            <input type="text" placeholder="Add message template…" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && newMessage.trim()) { setMessages([...messages, newMessage.trim()]); setNewMessage(""); } }}
              className="flex-1 text-[12px] rounded-xl px-3 py-1.5 outline-none text-[#222] placeholder:text-[#aaa]"
              style={{ backgroundColor: "rgba(204,0,0,0.05)", border: "1px solid rgba(204,0,0,0.18)" }} />
            <button onClick={() => { if (newMessage.trim()) { setMessages([...messages, newMessage.trim()]); setNewMessage(""); } }}
              className="w-7 h-7 rounded-xl flex items-center justify-center text-white transition-colors hover:brightness-110"
              style={{ background: "linear-gradient(135deg, #cc0000, #ff2222)", boxShadow: "0 0 10px rgba(204,0,0,0.45)" }}>
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Save footer */}
      <div className="shrink-0 px-5 py-4" style={{ borderTop: "1px solid rgba(204,0,0,0.15)", backgroundColor: "#050505" }}>
        <button onClick={handleSave} disabled={saving}
          className="w-full py-2.5 rounded-xl text-[14px] font-bold text-white transition-all hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-70"
          style={{
            background: saved ? "linear-gradient(135deg, #23a55a, #1a8b48)" : "linear-gradient(135deg, #cc0000, #ff2222)",
            boxShadow: saved ? "0 0 16px rgba(35,165,90,0.45)" : "0 0 16px rgba(204,0,0,0.5)",
          }}>
          {saving ? (
            <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Saving…</>
          ) : saved ? (
            <><Star className="w-4 h-4 fill-white" />Saved!</>
          ) : (
            <><Zap className="w-4 h-4" />Save Changes</>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Generic edit panel (for all other tools) ─────────────────────────────────

function EditPanel({ item, onBack, glowColor }: { item: AutomationItem; onBack: () => void; glowColor: string }) {
  const [loading, setLoading] = useState(true);
  const [autoJoin, setAutoJoin] = useState(true);
  const [smartMention, setSmartMention] = useState(true);
  const [dmMode, setDmMode] = useState(false);
  const [delay, setDelay] = useState("3");
  const [servers, setServers] = useState<string[]>(["Chill Zone", "Gaming HQ"]);
  const [newServer, setNewServer] = useState("");
  const [messages, setMessages] = useState<string[]>(["Hey! Check this out 👋", "Join us for some fun!"]);
  const [newMessage, setNewMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getToolSettings(item.id).then((s) => {
      setAutoJoin(s.autoJoin); setSmartMention(s.smartMention); setDmMode(s.dmMode);
      setDelay(String(s.delay));
      if (Array.isArray(s.servers) && s.servers.length) setServers(s.servers as string[]);
      if (Array.isArray(s.messages) && s.messages.length) setMessages(s.messages as string[]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [item.id]);

  async function handleSave() {
    setSaving(true);
    try {
      await saveToolSettings({ toolId: item.id, autoJoin, smartMention, dmMode, delay: parseInt(delay, 10) || 3, safeMode: false, quickWave: false, servers, messages, serverConfigs: null });
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } finally { setSaving(false); }
  }

  if (loading) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "#000" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${glowColor} transparent transparent transparent` }} />
          <span className="text-[13px] text-[#999]">Loading settings…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col animate-modal-slide-in" style={{ backgroundColor: "#000" }}>
      <div className="shrink-0 flex items-center gap-3 px-4 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(204,0,0,0.15)" }}>
        <button onClick={onBack} className="flex items-center gap-1.5 text-[#999] hover:text-white transition-colors group">
          <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors group-hover:bg-white/10"><ChevronLeft className="w-5 h-5" /></div>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#cc0000", boxShadow: "0 0 8px #cc0000" }} />
          <span className="text-[15px] font-bold text-white">{item.name} — Settings</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto discord-scrollbar px-5 py-4">
        <p className="text-[10px] font-black tracking-widest uppercase mb-2 mt-1" style={{ color: "#cc0000" }}>Behaviour</p>
        <Card>
          <SettingRow icon={<AtSign className="w-4 h-4" />} label="Smart Mentions" description="Target active members only">
            <ToggleSwitch on={smartMention} onToggle={() => setSmartMention((v) => !v)} />
          </SettingRow>
          <SettingRow icon={<Server className="w-4 h-4" />} label="Auto-Join Servers" description="Join servers before mentioning">
            <ToggleSwitch on={autoJoin} onToggle={() => setAutoJoin((v) => !v)} />
          </SettingRow>
          <SettingRow icon={<MessageSquare className="w-4 h-4" />} label="DM Mode" description="Send via direct messages">
            <ToggleSwitch on={dmMode} onToggle={() => setDmMode((v) => !v)} />
          </SettingRow>
          <SettingRow icon={<Clock className="w-4 h-4" />} label="Delay (seconds)" description="Pause between each action" last>
            <input type="number" min="1" max="60" value={delay} onChange={(e) => setDelay(e.target.value)}
              className="w-16 text-center text-[13px] font-bold rounded-xl py-1.5 outline-none text-[#111]"
              style={{ backgroundColor: "rgba(204,0,0,0.06)", border: "1.5px solid rgba(204,0,0,0.2)" }} />
          </SettingRow>
        </Card>
        <SectionLabel label="Target Servers" />
        <div className="rounded-2xl px-3 pb-2" style={{ backgroundColor: "#fff", border: "1.5px solid rgba(204,0,0,0.15)", boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}>
          {servers.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-2.5" style={i < servers.length - 1 ? { borderBottom: "1px solid rgba(0,0,0,0.06)" } : undefined}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#cc0000", boxShadow: "0 0 6px rgba(204,0,0,0.6)" }} />
                <span className="text-[13px] text-[#222]">{s}</span>
              </div>
              <button onClick={() => setServers(servers.filter((_, j) => j !== i))} className="text-[#ccc] hover:text-[#ed4245] transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <div className="flex items-center gap-2 pt-2">
            <input type="text" placeholder="Add server name…" value={newServer} onChange={(e) => setNewServer(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && newServer.trim()) { setServers([...servers, newServer.trim()]); setNewServer(""); } }}
              className="flex-1 text-[12px] rounded-xl px-3 py-1.5 outline-none text-[#222] placeholder:text-[#aaa]"
              style={{ backgroundColor: "rgba(204,0,0,0.05)", border: "1px solid rgba(204,0,0,0.18)" }} />
            <button onClick={() => { if (newServer.trim()) { setServers([...servers, newServer.trim()]); setNewServer(""); } }}
              className="w-7 h-7 rounded-xl flex items-center justify-center text-white transition-colors hover:brightness-110"
              style={{ background: "linear-gradient(135deg, #cc0000, #ff2222)", boxShadow: "0 0 10px rgba(204,0,0,0.45)" }}>
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        <SectionLabel label="Message Templates" />
        <div className="rounded-2xl px-3 pb-2" style={{ backgroundColor: "#fff", border: "1.5px solid rgba(204,0,0,0.15)", boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}>
          {messages.map((m, i) => (
            <div key={i} className="flex items-start gap-2 py-2.5" style={i < messages.length - 1 ? { borderBottom: "1px solid rgba(0,0,0,0.06)" } : undefined}>
              <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#cc0000]" />
              <span className="flex-1 text-[12px] text-[#333] leading-relaxed">{m}</span>
              <button onClick={() => setMessages(messages.filter((_, j) => j !== i))} className="text-[#ccc] hover:text-[#ed4245] transition-colors shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <div className="flex items-center gap-2 pt-2">
            <input type="text" placeholder="Add message template…" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && newMessage.trim()) { setMessages([...messages, newMessage.trim()]); setNewMessage(""); } }}
              className="flex-1 text-[12px] rounded-xl px-3 py-1.5 outline-none text-[#222] placeholder:text-[#aaa]"
              style={{ backgroundColor: "rgba(204,0,0,0.05)", border: "1px solid rgba(204,0,0,0.18)" }} />
            <button onClick={() => { if (newMessage.trim()) { setMessages([...messages, newMessage.trim()]); setNewMessage(""); } }}
              className="w-7 h-7 rounded-xl flex items-center justify-center text-white transition-colors hover:brightness-110"
              style={{ background: "linear-gradient(135deg, #cc0000, #ff2222)", boxShadow: "0 0 10px rgba(204,0,0,0.45)" }}>
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="shrink-0 px-5 py-4" style={{ borderTop: "1px solid rgba(204,0,0,0.15)", backgroundColor: "#050505" }}>
        <button onClick={handleSave} disabled={saving}
          className="w-full py-2.5 rounded-xl text-[14px] font-bold text-white transition-all hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-70"
          style={{
            background: saved ? "linear-gradient(135deg, #23a55a, #1a8b48)" : "linear-gradient(135deg, #cc0000, #ff2222)",
            boxShadow: saved ? "0 0 16px rgba(35,165,90,0.45)" : "0 0 16px rgba(204,0,0,0.5)",
          }}>
          {saving ? (<><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Saving…</>)
            : saved ? (<><Star className="w-4 h-4 fill-white" />Saved!</>)
            : (<><Zap className="w-4 h-4" />Save Changes</>)}
        </button>
      </div>
    </div>
  );
}

// ─── Item detail modal ────────────────────────────────────────────────────────

function ItemDetailModal({ item, onClose }: { item: AutomationItem; onClose: () => void }) {
  const [enabled, setEnabled] = useState(false);
  const [editing, setEditing] = useState(false);

  return (
    <div className="absolute inset-0 z-40 flex flex-col animate-modal-slide-in" style={{ backgroundColor: "#000" }}>
      {editing && (
        item.id === 1
          ? <MentioEditPanel item={item} onBack={() => setEditing(false)} />
          : <EditPanel item={item} onBack={() => setEditing(false)} glowColor={item.glowColor} />
      )}

      <div className="shrink-0 flex items-center px-4 pt-4 pb-2" style={{ borderBottom: "1px solid rgba(204,0,0,0.12)" }}>
        <button onClick={onClose} className="flex items-center gap-1.5 text-[#999] hover:text-white transition-colors group">
          <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors group-hover:bg-white/10"><ChevronLeft className="w-5 h-5" /></div>
          <span className="text-[14px] font-medium">Back</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 relative flex items-center justify-center"
          style={{ background: `radial-gradient(ellipse at 50% 50%, ${item.glowColor}25 0%, ${item.darkBg ?? "#1a0000"} 45%, #000 100%)` }}>
          <div className="absolute rounded-full" style={{ width: 340, height: 340, border: `1px solid ${item.glowColor}22`, boxShadow: `0 0 60px ${item.glowColor}30` }} />
          <div className="absolute rounded-full" style={{ width: 240, height: 240, border: `1px solid ${item.glowColor}30` }} />
          <div className="relative flex flex-col items-center gap-3">
            <div className="w-36 h-36 rounded-full border-[5px] flex items-center justify-center overflow-hidden"
              style={{ borderColor: item.glowColor, backgroundColor: item.darkBg ?? "#0a0000", boxShadow: `0 0 40px ${item.glowColor}55, inset 0 0 20px ${item.glowColor}15` }}>
              {item.icon === "mentionitor" ? <MentionitorAvatar size={144} /> : (
                <svg width="72" height="72" viewBox="0 0 40 40" fill="none">
                  <ellipse cx="20" cy="22" rx="16" ry="14" fill="#4a4b51" />
                  <ellipse cx="20" cy="20" rx="12" ry="11" fill="#36373d" />
                  <ellipse cx="14" cy="16" rx="4" ry="5" fill="#cc0000" opacity="0.8" />
                  <ellipse cx="26" cy="16" rx="4" ry="5" fill="#cc0000" opacity="0.8" />
                  <ellipse cx="14" cy="16" rx="2" ry="2.5" fill="white" />
                  <ellipse cx="26" cy="16" rx="2" ry="2.5" fill="white" />
                  <path d="M16 26 Q20 29 24 26" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
                </svg>
              )}
            </div>
            <div className="w-24 h-2.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.12)" }} />
            <div className="w-16 h-2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.07)" }} />
          </div>
        </div>

        <div className="shrink-0 px-6 py-5 rounded-t-3xl"
          style={{ backgroundColor: "#fff", borderTop: "2px solid rgba(204,0,0,0.2)", boxShadow: "0 -8px 40px rgba(0,0,0,0.35)" }}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-[22px] font-black text-[#0a0000] mb-0.5" style={{ letterSpacing: "-0.02em" }}>{item.name}</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]" />)}</div>
                <span className="text-[12px] text-[#888]">4.8 · 2.3k reviews</span>
              </div>
            </div>
            <button onClick={() => setEnabled((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold transition-all"
              style={{
                backgroundColor: enabled ? "rgba(35,165,90,0.1)" : "rgba(204,0,0,0.08)",
                color: enabled ? "#1a8b48" : "#cc0000",
                border: `1.5px solid ${enabled ? "rgba(35,165,90,0.35)" : "rgba(204,0,0,0.3)"}`,
              }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: enabled ? "#23a55a" : "#cc0000", boxShadow: enabled ? "none" : "0 0 6px rgba(204,0,0,0.7)" }} />
              {enabled ? "On" : "Off"}
            </button>
          </div>
          <p className="text-[#555] text-[13px] leading-relaxed mb-4 whitespace-pre-line">
            {item.description ?? "A sleek automation tool with advanced controls."}
          </p>
          <button onClick={() => setEditing(true)}
            className="w-full py-2.5 rounded-xl text-[14px] font-bold text-white transition-all hover:brightness-110 flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #cc0000, #ff2222)", boxShadow: "0 0 18px rgba(204,0,0,0.45), 0 0 36px rgba(204,0,0,0.2)" }}>
            <Zap className="w-4 h-4" />Configure
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Automation card ──────────────────────────────────────────────────────────

function AutomationCard({ item, onOpen, index = 0 }: { item: AutomationItem; onOpen?: () => void; index?: number }) {
  const [hovered, setHovered] = useState(false);
  const delay = Math.min(index * 40, 320);

  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer animate-fade-slide-up"
      style={{
        backgroundColor: "#fff",
        animationDelay: `${delay}ms`,
        border: hovered ? "1.5px solid rgba(204,0,0,0.5)" : "1.5px solid rgba(204,0,0,0.15)",
        boxShadow: hovered ? "0 8px 32px rgba(204,0,0,0.18), 0 0 0 1px rgba(204,0,0,0.06)" : "0 2px 12px rgba(0,0,0,0.08)",
        transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
        transform: hovered ? "translateY(-2px)" : undefined,
        aspectRatio: "1",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpen}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90", item.gradient)} />
      <div className="relative w-full h-full"><WumpusIcon item={item} /></div>
      <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
        <span className="text-[11px] font-bold text-white/90 drop-shadow">{item.name}</span>
      </div>
    </div>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function ToolsPage() {
  const [selected, setSelected] = useState<AutomationItem | null>(null);

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ backgroundColor: "#060000" }}>
      {selected && <ItemDetailModal item={selected} onClose={() => setSelected(null)} />}

      <div className="h-full overflow-y-auto discord-scrollbar px-4 pt-4 pb-6">
        <div className="mb-4">
          <h1 className="text-[18px] font-black text-white mb-0.5">Automation Tools</h1>
          <p className="text-[12px] text-[#666]">Tap a tool to view and configure it</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {automationItems.map((item, i) => (
            <AutomationCard key={item.id} item={item} index={i} onOpen={() => setSelected(item)} />
          ))}
        </div>
      </div>
    </div>
  );
}
