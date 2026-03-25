import { useState, useId, useEffect } from "react";
import { getToolSettings, saveToolSettings } from "@/lib/api";
import { Search, Heart, ChevronDown, Shuffle, Info, ChevronLeft, Zap, Star, Plus, Trash2, ToggleLeft, ToggleRight, Clock, MessageSquare, Server, AtSign } from "lucide-react";
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

function MentionitorAvatar({ size = 72 }: { size?: number }) {
  const uid = useId().replace(/:/g, "m");
  const bgId = `${uid}bg`;
  const glowId = `${uid}glow`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={bgId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#004695" />
          <stop offset="100%" stopColor="#001a3a" />
        </radialGradient>
        <filter id={glowId}>
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
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
      <circle cx="78" cy="22" r="1" fill="#B5FFFE" fillOpacity="0.5" />
      <circle cx="22" cy="22" r="1" fill="#B5FFFE" fillOpacity="0.5" />
      <circle cx="78" cy="78" r="1" fill="#B5FFFE" fillOpacity="0.5" />
      <circle cx="22" cy="78" r="1" fill="#B5FFFE" fillOpacity="0.5" />
      <circle cx="50" cy="50" r="26" fill="#002855" fillOpacity="0.8" />
      <circle cx="50" cy="50" r="26" stroke="#1CF8FF" strokeWidth="1.5" strokeOpacity="0.8" filter={`url(#${glowId})`} />
      <text x="50" y="57" textAnchor="middle" fontSize="28" fontFamily="Arial, sans-serif" fontWeight="bold" fill="#1CF8FF" filter={`url(#${glowId})`}>@</text>
      <circle cx="30" cy="20" r="1.2" fill="#1CF8FF" fillOpacity="0.5" />
      <circle cx="70" cy="20" r="1.2" fill="#1CF8FF" fillOpacity="0.5" />
      <circle cx="20" cy="35" r="0.8" fill="#B5FFFE" fillOpacity="0.4" />
      <circle cx="80" cy="35" r="0.8" fill="#B5FFFE" fillOpacity="0.4" />
      <circle cx="20" cy="65" r="0.8" fill="#B5FFFE" fillOpacity="0.4" />
      <circle cx="80" cy="65" r="0.8" fill="#B5FFFE" fillOpacity="0.4" />
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
        <div
          className="w-20 h-20 rounded-full border-4 flex items-center justify-center overflow-hidden"
          style={{ borderColor: item.glowColor, backgroundColor: item.darkBg ?? "#0a0000", boxShadow: `0 0 20px ${item.glowColor}50` }}
        >
          {item.icon === "mentionitor" ? <MentionitorAvatar size={56} /> : <WumpusFace size="md" />}
        </div>
        <div className="w-16 h-2 bg-white/15 rounded-full" />
        <div className="w-12 h-1.5 bg-white/10 rounded-full" />
      </div>
    </div>
  );
}

function SettingRow({ icon, label, description, children }: { icon: React.ReactNode; label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(204,0,0,0.08)", color: "#cc0000" }}>
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-[#111]">{label}</div>
          {description && <div className="text-[11px] text-[#888] mt-0.5 truncate">{description}</div>}
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function ToggleSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="transition-all duration-200"
      style={{ color: on ? "#cc0000" : "rgba(0,0,0,0.2)" }}
    >
      {on ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
    </button>
  );
}

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
      setAutoJoin(s.autoJoin);
      setSmartMention(s.smartMention);
      setDmMode(s.dmMode);
      setDelay(String(s.delay));
      setServers(s.servers as string[]);
      setMessages(s.messages as string[]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [item.id]);

  async function handleSave() {
    setSaving(true);
    try {
      await saveToolSettings({ toolId: item.id, autoJoin, smartMention, dmMode, delay: parseInt(delay, 10) || 3, servers, messages });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
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
          <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors group-hover:bg-white/10">
            <ChevronLeft className="w-5 h-5" />
          </div>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#cc0000", boxShadow: "0 0 8px #cc0000, 0 0 16px rgba(204,0,0,0.5)" }} />
          <span className="text-[15px] font-bold text-white">{item.name} — Settings</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto discord-scrollbar px-5 py-4">
        <div className="mb-1">
          <p className="text-[10px] font-black tracking-widest uppercase mb-2 mt-1" style={{ color: "#cc0000" }}>Behaviour</p>
          <div className="rounded-2xl px-3 overflow-hidden" style={{ backgroundColor: "#fff", border: "1.5px solid rgba(204,0,0,0.15)", boxShadow: "0 4px 24px rgba(0,0,0,0.18)" }}>
            <SettingRow icon={<AtSign className="w-4 h-4" />} label="Smart Mentions" description="Target active members only">
              <ToggleSwitch on={smartMention} onToggle={() => setSmartMention(v => !v)} />
            </SettingRow>
            <SettingRow icon={<Server className="w-4 h-4" />} label="Auto-Join Servers" description="Join servers before mentioning">
              <ToggleSwitch on={autoJoin} onToggle={() => setAutoJoin(v => !v)} />
            </SettingRow>
            <SettingRow icon={<MessageSquare className="w-4 h-4" />} label="DM Mode" description="Send via direct messages">
              <ToggleSwitch on={dmMode} onToggle={() => setDmMode(v => !v)} />
            </SettingRow>
            <div className="flex items-center justify-between gap-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(204,0,0,0.08)", color: "#cc0000" }}>
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-[#111]">Delay (seconds)</div>
                  <div className="text-[11px] text-[#888] mt-0.5">Pause between each action</div>
                </div>
              </div>
              <input type="number" min="1" max="60" value={delay} onChange={e => setDelay(e.target.value)}
                className="w-16 text-center text-[13px] font-bold rounded-xl py-1.5 outline-none text-[#111]"
                style={{ backgroundColor: "rgba(204,0,0,0.06)", border: "1.5px solid rgba(204,0,0,0.2)" }} />
            </div>
          </div>
        </div>

        <div className="mt-5 mb-1">
          <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: "#cc0000" }}>Target Servers</p>
          <div className="rounded-2xl px-3 pb-2 overflow-hidden" style={{ backgroundColor: "#fff", border: "1.5px solid rgba(204,0,0,0.15)", boxShadow: "0 4px 24px rgba(0,0,0,0.18)" }}>
            {servers.map((s, i) => (
              <div key={i} className="flex items-center justify-between py-2.5" style={{ borderBottom: i < servers.length - 1 ? "1px solid rgba(0,0,0,0.06)" : undefined }}>
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
              <input type="text" placeholder="Add server name…" value={newServer} onChange={e => setNewServer(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && newServer.trim()) { setServers([...servers, newServer.trim()]); setNewServer(""); } }}
                className="flex-1 text-[12px] rounded-xl px-3 py-1.5 outline-none text-[#222] placeholder:text-[#aaa]"
                style={{ backgroundColor: "rgba(204,0,0,0.05)", border: "1px solid rgba(204,0,0,0.18)" }} />
              <button onClick={() => { if (newServer.trim()) { setServers([...servers, newServer.trim()]); setNewServer(""); } }}
                className="w-7 h-7 rounded-xl flex items-center justify-center text-white transition-colors hover:brightness-110"
                style={{ background: "linear-gradient(135deg, #cc0000, #ff2222)", boxShadow: "0 0 10px rgba(204,0,0,0.45)" }}>
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 mb-1">
          <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: "#cc0000" }}>Message Templates</p>
          <div className="rounded-2xl px-3 pb-2 overflow-hidden" style={{ backgroundColor: "#fff", border: "1.5px solid rgba(204,0,0,0.15)", boxShadow: "0 4px 24px rgba(0,0,0,0.18)" }}>
            {messages.map((m, i) => (
              <div key={i} className="flex items-start gap-2 py-2.5" style={{ borderBottom: i < messages.length - 1 ? "1px solid rgba(0,0,0,0.06)" : undefined }}>
                <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#cc0000]" />
                <span className="flex-1 text-[12px] text-[#333] leading-relaxed">{m}</span>
                <button onClick={() => setMessages(messages.filter((_, j) => j !== i))} className="text-[#ccc] hover:text-[#ed4245] transition-colors shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <div className="flex items-center gap-2 pt-2">
              <input type="text" placeholder="Add message template…" value={newMessage} onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && newMessage.trim()) { setMessages([...messages, newMessage.trim()]); setNewMessage(""); } }}
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
      </div>

      <div className="shrink-0 px-5 py-4" style={{ borderTop: "1px solid rgba(204,0,0,0.15)", backgroundColor: "#050505" }}>
        <button
          onClick={handleSave} disabled={saving}
          className="w-full py-2.5 rounded-xl text-[14px] font-bold text-white transition-all hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-70"
          style={{
            background: saved
              ? "linear-gradient(135deg, #23a55a, #1a8b48)"
              : "linear-gradient(135deg, #cc0000, #ff2222)",
            boxShadow: saved ? "0 0 16px rgba(35,165,90,0.45)" : "0 0 16px rgba(204,0,0,0.5), 0 0 32px rgba(204,0,0,0.25)",
          }}
        >
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

function ItemDetailModal({ item, onClose }: { item: AutomationItem; onClose: () => void }) {
  const [enabled, setEnabled] = useState(false);
  const [editing, setEditing] = useState(false);

  return (
    <div className="absolute inset-0 z-40 flex flex-col animate-modal-slide-in" style={{ backgroundColor: "#000" }}>
      {editing && <EditPanel item={item} onBack={() => setEditing(false)} glowColor={item.glowColor} />}

      <div className="shrink-0 flex items-center px-4 pt-4 pb-2" style={{ borderBottom: "1px solid rgba(204,0,0,0.12)" }}>
        <button onClick={onClose} className="flex items-center gap-1.5 text-[#999] hover:text-white transition-colors group">
          <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors group-hover:bg-white/10">
            <ChevronLeft className="w-5 h-5" />
          </div>
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
              {item.icon === "mentionitor" ? (
                <MentionitorAvatar size={144} />
              ) : (
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

        {/* Bottom white card info panel */}
        <div className="shrink-0 px-6 py-5 rounded-t-3xl"
          style={{ backgroundColor: "#fff", borderTop: "2px solid rgba(204,0,0,0.2)", boxShadow: "0 -8px 40px rgba(0,0,0,0.35)" }}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-[22px] font-black text-[#0a0000] mb-0.5" style={{ letterSpacing: "-0.02em" }}>{item.name}</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]" />)}
                </div>
                <span className="text-[12px] text-[#888]">4.8 · 2.3k reviews</span>
              </div>
            </div>
            <button
              onClick={() => setEnabled(v => !v)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold transition-all"
              style={{
                backgroundColor: enabled ? "rgba(35,165,90,0.1)" : "rgba(204,0,0,0.08)",
                color: enabled ? "#1a8b48" : "#cc0000",
                border: `1.5px solid ${enabled ? "rgba(35,165,90,0.35)" : "rgba(204,0,0,0.3)"}`,
                boxShadow: enabled ? "none" : "0 0 10px rgba(204,0,0,0.15)",
              }}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: enabled ? "#23a55a" : "#cc0000", boxShadow: enabled ? "none" : "0 0 6px rgba(204,0,0,0.7)" }} />
              {enabled ? "On" : "Off"}
            </button>
          </div>

          <p className="text-[#555] text-[13px] leading-relaxed mb-4 whitespace-pre-line">
            {item.description ?? "A sleek animated avatar style inspired by futuristic AI companions. Comes with a glowing ring effect that reacts to your voice activity."}
          </p>

          <button
            onClick={() => setEditing(true)}
            className="w-full py-2.5 rounded-xl text-[14px] font-bold text-white transition-all hover:brightness-110 flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #cc0000, #ff2222)", boxShadow: "0 0 18px rgba(204,0,0,0.45), 0 0 36px rgba(204,0,0,0.2)" }}
          >
            <Zap className="w-4 h-4" />
            Configure
          </button>
        </div>
      </div>
    </div>
  );
}

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
        transition: "transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s ease, border-color 0.2s ease",
        transform: hovered ? "translateY(-4px) scale(1.02)" : "translateY(0) scale(1)",
        boxShadow: hovered
          ? `0 12px 36px rgba(0,0,0,0.22), 0 0 20px rgba(204,0,0,0.2)`
          : "0 3px 12px rgba(0,0,0,0.14)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpen}
    >
      <div className={cn("relative h-[188px] overflow-hidden", `bg-gradient-to-br ${item.gradient}`)}>
        <div className="absolute inset-0 transition-opacity duration-300"
          style={{ background: `radial-gradient(ellipse at 50% 50%, ${item.glowColor}22 0%, transparent 70%)`, opacity: hovered ? 1 : 0 }} />
        <WumpusIcon item={item} />
      </div>
      <div className="px-3 py-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-bold text-[#0a0000]">{item.name}</span>
          {hovered && (
            <div className="w-1.5 h-1.5 rounded-full bg-[#cc0000]" style={{ boxShadow: "0 0 6px #cc0000" }} />
          )}
        </div>
      </div>
    </div>
  );
}

const sortOptions = ["For You", "Price: Low to High", "Price: High to Low", "Newest"];
const tabs = ["Featured", "Browse"];

export default function Tools() {
  const [activeTab, setActiveTab] = useState("Featured");
  const [sortBy, setSortBy] = useState("For You");
  const [showSort, setShowSort] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [wishlist, setWishlist] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AutomationItem | null>(null);

  return (
    <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden relative" style={{ backgroundColor: "#000" }}>
      {selectedItem && (
        <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
      <div className="shrink-0 flex items-center px-5 gap-6 h-14" style={{ borderBottom: "1px solid rgba(204,0,0,0.15)", backgroundColor: "#000" }}>
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #cc0000, #8b0000)", boxShadow: "0 0 10px rgba(204,0,0,0.5)" }}>
            <WumpusFace size="xs" />
          </div>
        </div>

        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 text-[14px] font-semibold transition-colors rounded-sm",
                activeTab === tab
                  ? "text-white border-b-2 border-[#cc0000] rounded-none"
                  : "text-[rgba(255,255,255,0.4)] hover:text-white"
              )}
            >
              {tab}
              {tab === "Browse" && <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl w-52"
          style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(204,0,0,0.2)" }}
        >
          <Search className="w-4 h-4 shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
          <input
            type="text"
            placeholder="Search Tools"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="bg-transparent text-[13px] outline-none flex-1 w-full"
            style={{ color: "#fff" }}
          />
        </div>

        <button
          onClick={() => setWishlist(!wishlist)}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
          style={{ color: wishlist ? "#ed4245" : "rgba(255,255,255,0.35)" }}
        >
          <Heart className={cn("w-5 h-5", wishlist && "fill-[#ed4245]")} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto discord-scrollbar px-6 py-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h2 className="text-[20px] font-black text-white" style={{ letterSpacing: "-0.02em" }}>Automation Tools</h2>
            <button style={{ color: "rgba(255,255,255,0.25)" }} className="hover:text-white transition-colors">
              <Info className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.38)" }}>Sort by</span>
              <div className="relative">
                <button
                  onClick={() => setShowSort(!showSort)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[13px] font-semibold text-white hover:brightness-110 transition-all"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(204,0,0,0.22)" }}
                >
                  {sortBy}
                  <ChevronDown className="w-4 h-4" style={{ color: "rgba(255,255,255,0.4)" }} />
                </button>
                {showSort && (
                  <div className="absolute right-0 top-full mt-1 w-48 rounded-xl overflow-hidden shadow-2xl z-20"
                    style={{ backgroundColor: "#111", border: "1px solid rgba(204,0,0,0.25)" }}>
                    {sortOptions.map((opt) => (
                      <button key={opt} onClick={() => { setSortBy(opt); setShowSort(false); }}
                        className={cn("w-full text-left px-3 py-2 text-[13px] transition-colors",
                          sortBy === opt ? "text-[#cc0000] bg-[rgba(204,0,0,0.1)]" : "text-[rgba(255,255,255,0.7)] hover:bg-white/5")}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-[13px] font-bold text-white transition-all hover:brightness-110"
              style={{ background: "linear-gradient(135deg, #cc0000, #ff2222)", boxShadow: "0 0 12px rgba(204,0,0,0.4)" }}
            >
              <Shuffle className="w-4 h-4" />
              Shuffle!
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pb-6">
          {automationItems
            .filter((item) => searchValue === "" || item.name.toLowerCase().includes(searchValue.toLowerCase()))
            .map((item, i) => (
              <AutomationCard key={item.id} item={item} index={i} onOpen={() => setSelectedItem(item)} />
            ))}
        </div>

        {automationItems.filter((item) =>
          searchValue === "" || item.name.toLowerCase().includes(searchValue.toLowerCase())
        ).length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="w-12 h-12 mb-4 opacity-30" style={{ color: "rgba(204,0,0,0.8)" }} />
            <p className="text-white font-bold text-lg mb-1">No results found</p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.38)" }}>Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
}
