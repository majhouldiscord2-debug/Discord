import { useMemo, useEffect, useState } from "react";
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
        background: `linear-gradient(135deg, ${color}22 0%, #080f1c 60%)`,
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
      style={{ background: `linear-gradient(135deg, ${color}15 0%, #080f1c 100%)`, border: `1px solid ${color}25` }}
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
    <div className="rounded-[14px] overflow-hidden" style={{ background: "#080f1c", border: "1px solid rgba(255,255,255,0.055)" }}>
      {children}
    </div>
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
    <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden" style={{ backgroundColor: "#080d18" }}>
      <div className="h-12 shrink-0 flex items-center px-5 gap-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "linear-gradient(180deg, #0c1530 0%, #090e1e 100%)" }}>
        <BarChart2 className="w-[18px] h-[18px] text-[#5865f2]" />
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
          <div className="rounded-[16px] overflow-hidden" style={{ background: "linear-gradient(135deg, #1a1060 0%, #0d1a40 50%, #080f1c 100%)", border: "1px solid rgba(88,101,242,0.25)", boxShadow: "0 8px 40px rgba(88,101,242,0.12)" }}>
            <div className="h-[70px] w-full relative" style={{ background: "linear-gradient(135deg, #5865f2 0%, #3b4acf 50%, #1a236e 100%)" }}>
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            </div>
            <div className="px-5 pb-4 -mt-7 flex items-end gap-4">
              <div className="relative shrink-0">
                {stats.userAvatar ? (
                  <img src={stats.userAvatar} alt={stats.displayName} className="w-[56px] h-[56px] rounded-full ring-4" style={{ ringColor: "#080f1c" }} />
                ) : (
                  <div className="w-[56px] h-[56px] rounded-full bg-[#5865f2] flex items-center justify-center text-white font-bold text-xl ring-4 ring-[#080f1c]">
                    {stats.displayName[0]?.toUpperCase()}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#23a55a] ring-2 ring-[#080f1c]" />
              </div>
              <div className="pb-1 min-w-0">
                <div className="font-bold text-[#f2f3f5] text-[17px] leading-tight truncate">{stats.displayName}</div>
                <div className="text-[#6d6f76] text-[12px] font-medium">@{user.username}{stats.tag}</div>
              </div>
              {stats.isBot && (
                <div className="ml-auto mb-1 shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[11px] font-bold" style={{ background: "#5865f222", color: "#5865f2", border: "1px solid #5865f240" }}>
                  <Bot className="w-3.5 h-3.5" /> BOT
                </div>
              )}
            </div>
          </div>
        )}

        <Section title="Messages">
          <div className="flex gap-3">
            <BigStat icon={<TrendingUp className="w-5 h-5" />} label="Total Messages Sent" value={msgStats ? fmt(totalMsg) : "—"} sub={msgStats ? `${msgStats.channelsSampled} DM chats · ${msgStats.guildsSampled} servers` : "Full scan in progress"} color="#5865f2" loading={msgLoading} />
            <BigStat icon={<MessageCircle className="w-5 h-5" />} label="In Direct Messages" value={msgStats ? fmt(msgStats.dmMessages) : "—"} sub={msgStats ? `across ${msgStats.channelsSampled} DM chats` : undefined} color="#06b6d4" loading={msgLoading} />
            <BigStat icon={<SendHorizonal className="w-5 h-5" />} label="In Servers" value={msgStats ? fmt(msgStats.serverMessages) : "—"} sub={msgStats ? `across ${msgStats.guildsSampled} servers` : undefined} color="#23a55a" loading={msgLoading} />
          </div>
          {msgStats && (
            <div className="mt-3 rounded-[12px] p-3.5" style={{ background: "#080f1c", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="text-[11px] text-[#4e5058] mb-2.5 font-medium">Message Share</div>
              <BarRow label="Direct Messages" value={msgStats.dmMessages} max={totalMsg || 1} color="#06b6d4" />
              <BarRow label="Server Messages" value={msgStats.serverMessages} max={totalMsg || 1} color="#23a55a" />
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
            <MiniStat icon={<Server className="w-4 h-4" />} label="Servers" value={guilds.length} color="#5865f2" sub={stats.ownedServers.length > 0 ? `${stats.ownedServers.length} owned` : undefined} />
            <MiniStat icon={<Users className="w-4 h-4" />} label="Friends" value={stats.friends.length} color="#23a55a" />
            <MiniStat icon={<MessageCircle className="w-4 h-4" />} label="DM Chats" value={stats.dmChannels.length} color="#06b6d4" />
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
            style={{ background: "linear-gradient(135deg, #5865f215 0%, #080f1c 100%)", border: "1px solid rgba(88,101,242,0.18)" }}
          >
            <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: "#5865f222" }}>
              <Server className="w-5 h-5 text-[#5865f2]" />
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
