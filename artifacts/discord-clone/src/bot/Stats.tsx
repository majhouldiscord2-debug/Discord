import { useMemo, useEffect, useState, useRef } from "react";
import { useDiscord } from "@/hooks/useDiscord";
import { getMessageStats, type MessageStats, avatarUrl } from "@/lib/api";
import {
  BarChart2, Server, Hash, Users, MessageCircle, UserX,
  Clock, Shield, Bot, UserCheck, Inbox, Globe, Layers,
  SendHorizonal, RefreshCw, TrendingUp,
} from "lucide-react";

function snowflakeToDate(id: string): Date {
  const ms = Number(BigInt(id) >> 22n) + 1420070400000;
  return new Date(ms);
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const d = Math.floor(diff / 86400000);
  const m = Math.floor(d / 30);
  const y = Math.floor(m / 12);
  if (y > 0) return `${y}y ${m % 12}mo`;
  if (m > 0) return `${m} month${m > 1 ? "s" : ""}`;
  return `${d} day${d !== 1 ? "s" : ""}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

interface BigStatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  color: string;
  loading?: boolean;
}

function BigStat({ icon, label, value, sub, color, loading }: BigStatProps) {
  return (
    <div
      className="flex-1 min-w-0 rounded-[14px] p-5 flex flex-col gap-3 relative overflow-hidden group transition-transform duration-200 hover:scale-[1.02]"
      style={{
        background: `linear-gradient(135deg, ${color}22 0%, #0a0000 60%)`,
        border: `1px solid ${color}35`,
        boxShadow: `0 0 30px ${color}12, inset 0 1px 0 ${color}15`,
      }}
    >
      <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: `${color}25`, color }}>
        {icon}
      </div>
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
          <span className="text-[13px] text-[#6d6f76]">Counting all messages…</span>
        </div>
      ) : (
        <div className="text-[32px] font-extrabold tracking-tighter leading-none" style={{ color }}>
          {value}
        </div>
      )}
      <div>
        <div className="text-[13px] font-semibold text-[#dbdee1]">{label}</div>
        {sub && <div className="text-[11px] text-[#5e6068] mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

function MiniStat({ icon, label, value, color, sub }: { icon: React.ReactNode; label: string; value: string | number; color: string; sub?: string }) {
  return (
    <div
      className="rounded-[12px] p-4 flex items-center gap-3 transition-all duration-150 hover:brightness-110"
      style={{ background: `linear-gradient(135deg, ${color}15 0%, #0a0000 100%)`, border: `1px solid ${color}25` }}
    >
      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ background: `${color}22`, color }}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[20px] font-bold tracking-tight leading-none" style={{ color }}>{value}</div>
        <div className="text-[12px] font-medium text-[#87898c] mt-0.5 truncate">{label}</div>
      </div>
      {sub && <div className="text-[11px] text-[#4e5058] shrink-0">{sub}</div>}
    </div>
  );
}

function BarRow({ label, value, max, color, suffix = "" }: { label: string; value: number; max: number; color: string; suffix?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex flex-col gap-1.5 py-2.5 border-b border-white/[0.04] last:border-b-0">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-[#87898c]">{label}</span>
        <span className="text-[13px] font-bold text-[#dbdee1]">{fmt(value)}{suffix}</span>
      </div>
      <div className="h-[5px] rounded-full bg-white/[0.06] overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon, mono }: { label: string; value: string; icon?: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-[11px] border-b border-white/[0.04] last:border-b-0 px-4">
      <div className="flex items-center gap-2.5 text-[#6d6f76]">
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="text-[13px] font-medium">{label}</span>
      </div>
      <span className={`text-[13px] font-semibold text-[#c4c9cf] text-right max-w-[55%] truncate ${mono ? "font-mono text-[12px]" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-[10px] font-bold text-[#4e5058] uppercase tracking-[0.12em] mb-2.5 px-1">{title}</h2>
      {children}
    </section>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[14px] overflow-hidden" style={{ background: "#0a0000", border: "1px solid rgba(255,255,255,0.055)" }}>
      {children}
    </div>
  );
}

interface ProfileCardProps {
  userAvatar: string | null;
  displayName: string;
  username: string;
  tag: string;
  isBot: boolean;
}

function ProfileCard({ userAvatar, displayName, username, tag, isBot }: ProfileCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    type Particle = { x: number; y: number; vx: number; vy: number; r: number; alpha: number; decay: number };
    const particles: Particle[] = [];
    const spawn = () => {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 4,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(0.3 + Math.random() * 0.7),
        r: 0.8 + Math.random() * 1.8,
        alpha: 0.6 + Math.random() * 0.4,
        decay: 0.004 + Math.random() * 0.006,
      });
    };

    let frame = 0;
    let raf: number;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (frame++ % 3 === 0) spawn();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.alpha -= p.decay;
        if (p.alpha <= 0 || p.y < -6) { particles.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,${60 + Math.floor(p.alpha * 40)},${60 + Math.floor(p.alpha * 20)},${p.alpha})`;
        ctx.fill();
      }
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <style>{`
        @keyframes pcCardIn {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pcBannerShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pcScan {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        @keyframes pcRing1 { to { transform: rotate(360deg); } }
        @keyframes pcRing2 { to { transform: rotate(-360deg); } }
        @keyframes pcAvatarGlow {
          0%,100% { box-shadow: 0 0 0 3px rgba(204,0,0,0.6), 0 0 18px rgba(204,0,0,0.35); }
          50%      { box-shadow: 0 0 0 3px rgba(255,60,60,0.9), 0 0 32px rgba(255,60,60,0.55); }
        }
        @keyframes pcOnlinePulse {
          0%,100% { box-shadow: 0 0 0 2px #080000, 0 0 0 4px rgba(35,165,90,0.3); }
          50%      { box-shadow: 0 0 0 2px #080000, 0 0 0 6px rgba(35,165,90,0.6); }
        }
        @keyframes pcNameIn {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes pcSubIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes pcCornerPulse {
          0%,100% { opacity: 0.4; }
          50%      { opacity: 0.9; }
        }
        @keyframes pcGlitch {
          0%,94%,100% { clip-path: none; transform: none; }
          95%  { clip-path: inset(30% 0 40% 0); transform: translateX(-4px); }
          96%  { clip-path: inset(60% 0 10% 0); transform: translateX(4px); }
          97%  { clip-path: inset(10% 0 70% 0); transform: translateX(-2px); }
          98%  { clip-path: none; transform: none; }
        }
        .pc-card  { animation: pcCardIn 0.55s cubic-bezier(0.16,1,0.3,1) both; }
        .pc-name  { animation: pcNameIn 0.45s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
        .pc-sub   { animation: pcSubIn  0.45s cubic-bezier(0.16,1,0.3,1) 0.38s both; }
        .pc-glitch { animation: pcGlitch 8s steps(1) infinite; }
      `}</style>

      <div
        className="pc-card rounded-[16px] overflow-hidden relative"
        style={{
          background: "linear-gradient(135deg, #1a0000 0%, #100000 50%, #0a0000 100%)",
          border: "1px solid rgba(204,0,0,0.3)",
          boxShadow: mounted
            ? "0 0 0 1px rgba(204,0,0,0.15), 0 8px 40px rgba(180,0,0,0.2), 0 0 80px rgba(180,0,0,0.06)"
            : "none",
          transition: "box-shadow 0.6s ease",
        }}
      >
        {/* Banner */}
        <div className="h-[80px] w-full relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #cc0000, #8b0000, #ff3333, #6b0000, #cc0000)",
              backgroundSize: "300% 300%",
              animation: "pcBannerShift 6s ease infinite",
            }}
          />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.7 }} />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)",
              pointerEvents: "none",
            }}
          />
          <div
            className="absolute left-0 right-0 h-[2px]"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,200,200,0.7), transparent)",
              animation: "pcScan 3.5s linear infinite",
              top: 0,
            }}
          />
          {[["top-1.5 left-1.5","border-t-2 border-l-2"],["top-1.5 right-1.5","border-t-2 border-r-2"],["bottom-1.5 left-1.5","border-b-2 border-l-2"],["bottom-1.5 right-1.5","border-b-2 border-r-2"]].map(([pos, brd], i) => (
            <div key={i} className={`absolute ${pos} w-3 h-3 ${brd} border-white/40 rounded-[1px]`} style={{ animation: `pcCornerPulse 2s ease-in-out ${i * 0.5}s infinite` }} />
          ))}
          <div className="absolute top-2 right-8 text-[9px] font-black tracking-[0.25em] text-white/20 select-none uppercase">TG WORKS</div>
        </div>

        {/* Avatar + info row */}
        <div className="px-5 pb-4 -mt-8 flex items-end gap-4">
          <div className="relative shrink-0" style={{ width: 64, height: 64 }}>
            <div
              className="absolute"
              style={{
                inset: -6, borderRadius: "50%",
                border: "1.5px solid transparent",
                borderTopColor: "rgba(204,0,0,0.7)", borderRightColor: "rgba(204,0,0,0.2)",
                borderBottomColor: "rgba(204,0,0,0.7)", borderLeftColor: "rgba(204,0,0,0.2)",
                animation: "pcRing1 2.8s linear infinite",
              }}
            />
            <div
              className="absolute"
              style={{
                inset: -2, borderRadius: "50%",
                border: "1px dashed rgba(255,80,80,0.35)",
                animation: "pcRing2 4s linear infinite",
              }}
            />
            {userAvatar ? (
              <img
                src={userAvatar} alt={displayName}
                className="w-16 h-16 rounded-full object-cover"
                style={{ animation: "pcAvatarGlow 2.5s ease-in-out infinite" }}
              />
            ) : (
              <div
                className="w-16 h-16 rounded-full bg-[#cc0000] flex items-center justify-center text-white font-bold text-2xl"
                style={{ animation: "pcAvatarGlow 2.5s ease-in-out infinite" }}
              >
                {displayName[0]?.toUpperCase()}
              </div>
            )}
            <div
              className="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-full bg-[#23a55a]"
              style={{ animation: "pcOnlinePulse 2s ease-in-out infinite", border: "3px solid #080000" }}
            />
          </div>

          <div className="pb-1 min-w-0 flex-1">
            <div className="pc-name font-black text-white text-[18px] leading-tight tracking-tight pc-glitch">
              {displayName}
            </div>
            <div className="pc-sub text-[#6d6f76] text-[12px] font-medium font-mono">
              @{username}{tag}
            </div>
          </div>

          {isBot && (
            <div
              className="ml-auto mb-1 shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[11px] font-bold"
              style={{
                background: "#cc000022", color: "#ff6060",
                border: "1px solid #cc000050",
                boxShadow: "0 0 10px rgba(204,0,0,0.3)",
                animation: "pcCornerPulse 1.5s ease-in-out infinite",
              }}
            >
              <Bot className="w-3.5 h-3.5" /> BOT
            </div>
          )}
        </div>

        {/* About Me */}
        <div
          className="mx-5 mb-4 rounded-[10px] overflow-hidden"
          style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(204,0,0,0.2)", backdropFilter: "blur(4px)" }}
        >
          <div
            className="flex items-center gap-2 px-3 py-2"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "linear-gradient(90deg, rgba(204,0,0,0.12) 0%, transparent 100%)" }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#cc0000]" style={{ boxShadow: "0 0 6px #cc0000", animation: "pcCornerPulse 1.2s ease-in-out infinite" }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#4e5058]">About Me</span>
            <div className="ml-auto flex items-center gap-3">
              <span className="text-[10px] font-black tracking-widest text-[#cc0000] uppercase" style={{ textShadow: "0 0 8px rgba(204,0,0,0.5)" }}>TG WORKS</span>
              <span className="w-px h-3 bg-white/10" />
              <span className="text-[10px] font-semibold text-[#6d6f76]">{isBot ? "Bot" : "Friends"}</span>
            </div>
          </div>
          <div className="px-3 py-2.5">
            <p className="text-[12px] leading-[1.6] text-[#87898c]">
              Automated bot powering <span className="text-[#cc0000] font-semibold" style={{ textShadow: "0 0 6px rgba(204,0,0,0.4)" }}>TG WORKS</span> — managing servers, tracking stats, and keeping everything running smoothly.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Stats() {
  const { user, guilds, channels, relationships, tokenType } = useDiscord();
  const [msgStats, setMsgStats] = useState<MessageStats | null>(null);
  const [msgLoading, setMsgLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchMsgStats() {
    setMsgLoading(true);
    const s = await getMessageStats();
    setMsgStats(s);
    setMsgLoading(false);
  }

  async function handleRefresh() {
    setRefreshing(true);
    setMsgStats(null);
    await fetchMsgStats();
    setRefreshing(false);
  }

  useEffect(() => { fetchMsgStats(); }, []);

  const stats = useMemo(() => {
    const friends = relationships.filter((r) => r.type === 1);
    const incomingReqs = relationships.filter((r) => r.type === 3);
    const outgoingReqs = relationships.filter((r) => r.type === 4);
    const blocked = relationships.filter((r) => r.type === 2);
    const pending = [...incomingReqs, ...outgoingReqs];
    const dmChannels = channels.filter((c) => c.type === 1);
    const groupDms = channels.filter((c) => c.type === 3);
    const ownedServers = guilds.filter((g) => g.owner);
    const accountCreated = user ? snowflakeToDate(user.id) : null;
    const isBot = tokenType === "bot" || user?.bot;
    const userAvatar = user ? avatarUrl(user) : null;
    const displayName = user?.global_name ?? user?.username ?? "Unknown";
    const tag = user?.discriminator && user.discriminator !== "0" ? `#${user.discriminator}` : "";
    return { friends, incomingReqs, outgoingReqs, blocked, pending, dmChannels, groupDms, ownedServers, accountCreated, isBot, userAvatar, displayName, tag };
  }, [user, guilds, channels, relationships, tokenType]);

  const maxRel = Math.max(stats.friends.length, stats.incomingReqs.length, stats.outgoingReqs.length, stats.blocked.length, 1);
  const totalMsg = msgStats ? msgStats.totalMessages : 0;

  return (
    <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden" style={{ backgroundColor: "#080000" }}>
      <div className="h-12 shrink-0 flex items-center px-5 gap-2" style={{ borderBottom: "1px solid rgba(80,0,0,0.35)", background: "linear-gradient(180deg, #150000 0%, #0a0000 100%)" }}>
        <BarChart2 className="w-[18px] h-[18px] text-[#cc0000]" />
        <span className="text-[#f2f3f5] font-semibold text-[15px] tracking-[-0.01em]">Stats</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[11px] text-[#4e5058] font-medium uppercase tracking-wider">{stats.isBot ? "Bot" : "User"}</span>
          <button onClick={handleRefresh} disabled={msgLoading || refreshing} className="p-1.5 rounded-[6px] text-[#4e5058] hover:text-[#dbdee1] hover:bg-white/8 transition-all disabled:opacity-40">
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto discord-scrollbar px-4 py-4 space-y-5">
        {user && (
          <ProfileCard
            userAvatar={stats.userAvatar}
            displayName={stats.displayName}
            username={user.username}
            tag={stats.tag}
            isBot={stats.isBot}
          />
        )}

        <Section title="Messages">
          <div className="flex gap-3">
            <BigStat icon={<TrendingUp className="w-5 h-5" />} label="Total Messages Sent" value={msgStats ? fmt(totalMsg) : "—"} sub={msgStats ? `${msgStats.channelsSampled} DM chats · ${msgStats.guildsSampled} servers` : "Full scan in progress"} color="#cc0000" loading={msgLoading} />
            <BigStat icon={<MessageCircle className="w-5 h-5" />} label="In Direct Messages" value={msgStats ? fmt(msgStats.dmMessages) : "—"} sub={msgStats ? `across ${msgStats.channelsSampled} DM chats` : undefined} color="#e05050" loading={msgLoading} />
            <BigStat icon={<SendHorizonal className="w-5 h-5" />} label="In Servers" value={msgStats ? fmt(msgStats.serverMessages) : "—"} sub={msgStats ? `across ${msgStats.guildsSampled} servers` : undefined} color="#ff8080" loading={msgLoading} />
          </div>
          {msgStats && (
            <div className="mt-3 rounded-[12px] p-3.5" style={{ background: "#0a0000", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="text-[11px] text-[#4e5058] mb-2.5 font-medium">Message Share</div>
              <BarRow label="Direct Messages" value={msgStats.dmMessages} max={totalMsg || 1} color="#e05050" />
              <BarRow label="Server Messages" value={msgStats.serverMessages} max={totalMsg || 1} color="#ff8080" />
            </div>
          )}
        </Section>

        <Section title="Account">
          <Card>
            {user && (
              <>
                <InfoRow label="User ID" value={user.id} icon={<Hash className="w-3.5 h-3.5" />} mono />
                <InfoRow label="Account Type" value={stats.isBot ? "Bot" : "User"} icon={stats.isBot ? <Bot className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />} />
                {stats.accountCreated && (
                  <>
                    <InfoRow label="Created" value={formatDate(stats.accountCreated)} icon={<Clock className="w-3.5 h-3.5" />} />
                    <InfoRow label="Account Age" value={timeAgo(stats.accountCreated)} icon={<Globe className="w-3.5 h-3.5" />} />
                  </>
                )}
              </>
            )}
          </Card>
        </Section>

        <Section title="Overview">
          <div className="grid grid-cols-3 gap-2.5">
            <MiniStat icon={<Server className="w-4 h-4" />} label="Servers" value={guilds.length} color="#cc0000" sub={stats.ownedServers.length > 0 ? `${stats.ownedServers.length} owned` : undefined} />
            <MiniStat icon={<Users className="w-4 h-4" />} label="Friends" value={stats.friends.length} color="#23a55a" />
            <MiniStat icon={<MessageCircle className="w-4 h-4" />} label="DM Chats" value={stats.dmChannels.length} color="#e05050" />
            <MiniStat icon={<Layers className="w-4 h-4" />} label="Group DMs" value={stats.groupDms.length} color="#f59e0b" />
            <MiniStat icon={<Inbox className="w-4 h-4" />} label="Requests" value={stats.pending.length} color="#e879f9" />
            <MiniStat icon={<UserX className="w-4 h-4" />} label="Blocked" value={stats.blocked.length} color="#f43f5e" />
          </div>
        </Section>

        <Section title="Relationships">
          <Card>
            <div className="px-4 py-1">
              <BarRow label="Friends" value={stats.friends.length} max={maxRel} color="#23a55a" />
              <BarRow label="Incoming Requests" value={stats.incomingReqs.length} max={maxRel} color="#e879f9" />
              <BarRow label="Outgoing Requests" value={stats.outgoingReqs.length} max={maxRel} color="#f59e0b" />
              <BarRow label="Blocked Users" value={stats.blocked.length} max={maxRel} color="#f43f5e" />
            </div>
          </Card>
        </Section>

        <Section title="Servers">
          <div
            className="rounded-[14px] flex items-center gap-4 px-5 py-4"
            style={{ background: "linear-gradient(135deg, #cc000015 0%, #0a0000 100%)", border: "1px solid rgba(200,0,0,0.2)" }}
          >
            <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: "#cc000022" }}>
              <Server className="w-5 h-5 text-[#cc0000]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-[#dbdee1]">Server Stats</span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide" style={{ background: "#f59e0b22", color: "#f59e0b", border: "1px solid #f59e0b33" }}>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f59e0b] opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#f59e0b]" />
                  </span>
                  In Progress
                </span>
              </div>
              <p className="text-[11px] text-[#4e5058] mt-0.5">This section is being upgraded and will be available soon.</p>
            </div>
          </div>
        </Section>

        <Section title="Channels">
          <Card>
            <InfoRow label="Total Open Chats" value={String(channels.length)} icon={<Layers className="w-3.5 h-3.5" />} />
            <InfoRow label="Direct Messages" value={String(stats.dmChannels.length)} icon={<MessageCircle className="w-3.5 h-3.5" />} />
            <InfoRow label="Group DMs" value={String(stats.groupDms.length)} icon={<Users className="w-3.5 h-3.5" />} />
          </Card>
        </Section>

        {msgStats && (
          <p className="text-[11px] text-[#3e4147] text-center pb-2 leading-snug">
            Full scan complete — every message in {msgStats.channelsSampled} DM channels and all accessible channels across {msgStats.guildsSampled} servers.
          </p>
        )}
      </div>
    </div>
  );
}
