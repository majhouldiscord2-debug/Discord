import { useMemo } from "react";
import { useDiscord } from "@/hooks/useDiscord";
import {
  BarChart2, Server, Hash, Users, MessageCircle, UserX,
  Clock, Shield, Bot, UserCheck, Inbox, Globe, Layers,
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
  if (y > 0) return `${y} year${y > 1 ? "s" : ""} ago`;
  if (m > 0) return `${m} month${m > 1 ? "s" : ""} ago`;
  return `${d} day${d > 1 ? "s" : ""} ago`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  glow: string;
}

function StatCard({ icon, label, value, sub, color, glow }: StatCardProps) {
  return (
    <div
      className="relative rounded-[12px] p-4 flex flex-col gap-2 overflow-hidden transition-all duration-200 hover:scale-[1.02]"
      style={{
        background: `linear-gradient(135deg, ${glow}18 0%, #0a1220 100%)`,
        border: `1px solid ${glow}30`,
        boxShadow: `0 4px 20px ${glow}10`,
      }}
    >
      <div
        className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
        style={{ background: `${glow}20`, color }}
      >
        {icon}
      </div>
      <div>
        <div className="text-[26px] font-bold tracking-tight" style={{ color }}>
          {value}
        </div>
        <div className="text-[12px] font-semibold text-[#f2f3f5] mt-0.5">{label}</div>
        {sub && <div className="text-[11px] text-[#6d6f76] mt-0.5 leading-snug">{sub}</div>}
      </div>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

function InfoRow({ label, value, icon }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-b-0">
      <div className="flex items-center gap-2 text-[#7d8188]">
        {icon && <span className="w-4 h-4 shrink-0">{icon}</span>}
        <span className="text-[13px] font-medium">{label}</span>
      </div>
      <span className="text-[13px] font-semibold text-[#dbdee1] text-right max-w-[55%] truncate">{value}</span>
    </div>
  );
}

export default function Stats() {
  const { user, guilds, channels, relationships, tokenType } = useDiscord();

  const stats = useMemo(() => {
    const friends = relationships.filter((r) => r.type === 1);
    const pending = relationships.filter((r) => r.type === 3 || r.type === 4);
    const incomingReqs = relationships.filter((r) => r.type === 3);
    const outgoingReqs = relationships.filter((r) => r.type === 4);
    const blocked = relationships.filter((r) => r.type === 2);

    const dmChannels = channels.filter((c) => c.type === 1);
    const groupDms = channels.filter((c) => c.type === 3);
    const ownedServers = guilds.filter((g) => g.owner);

    const accountCreated = user ? snowflakeToDate(user.id) : null;
    const isBot = tokenType === "bot" || user?.bot;

    return {
      friends,
      pending,
      incomingReqs,
      outgoingReqs,
      blocked,
      dmChannels,
      groupDms,
      ownedServers,
      accountCreated,
      isBot,
    };
  }, [user, guilds, channels, relationships, tokenType]);

  return (
    <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden" style={{ backgroundColor: "#0a1220" }}>
      {/* Header */}
      <div
        className="h-12 shrink-0 flex items-center px-5 gap-2"
        style={{
          borderBottom: "1px solid rgba(0,0,0,0.4)",
          background: "linear-gradient(180deg, #0c1530 0%, #0a1220 100%)",
        }}
      >
        <BarChart2 className="w-5 h-5 text-[#5865f2]" />
        <span className="text-[#f2f3f5] font-semibold text-[15px] tracking-[-0.01em]">Stats</span>
        <span className="ml-auto text-[11px] text-[#4e5058] font-medium uppercase tracking-wider">
          {stats.isBot ? "Bot Account" : "User Account"}
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto discord-scrollbar px-5 py-5 space-y-6">

        {/* Account Info */}
        <section>
          <h2 className="text-[11px] font-bold text-[#6d6f76] uppercase tracking-widest mb-3">Account</h2>
          <div
            className="rounded-[12px] overflow-hidden"
            style={{ background: "#080f1c", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            {user && (
              <>
                <InfoRow
                  label="Username"
                  value={`@${user.username}`}
                  icon={<UserCheck className="w-4 h-4" />}
                />
                {user.global_name && (
                  <InfoRow
                    label="Display Name"
                    value={user.global_name}
                    icon={<Users className="w-4 h-4" />}
                  />
                )}
                <InfoRow
                  label="User ID"
                  value={user.id}
                  icon={<Hash className="w-4 h-4" />}
                />
                <InfoRow
                  label="Account Type"
                  value={stats.isBot ? "Bot" : "User"}
                  icon={stats.isBot ? <Bot className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                />
                {stats.accountCreated && (
                  <>
                    <InfoRow
                      label="Created On"
                      value={formatDate(stats.accountCreated)}
                      icon={<Clock className="w-4 h-4" />}
                    />
                    <InfoRow
                      label="Account Age"
                      value={timeAgo(stats.accountCreated)}
                      icon={<Globe className="w-4 h-4" />}
                    />
                  </>
                )}
              </>
            )}
          </div>
        </section>

        {/* Overview Stats Grid */}
        <section>
          <h2 className="text-[11px] font-bold text-[#6d6f76] uppercase tracking-widest mb-3">Overview</h2>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            <StatCard
              icon={<Server className="w-4 h-4" />}
              label="Servers"
              value={guilds.length}
              sub={stats.ownedServers.length > 0 ? `${stats.ownedServers.length} owned` : "Member in all"}
              color="#5865f2"
              glow="#5865f2"
            />
            <StatCard
              icon={<Users className="w-4 h-4" />}
              label="Friends"
              value={stats.friends.length}
              sub={stats.pending.length > 0 ? `${stats.pending.length} pending` : "No pending requests"}
              color="#23a55a"
              glow="#23a55a"
            />
            <StatCard
              icon={<MessageCircle className="w-4 h-4" />}
              label="Direct Messages"
              value={stats.dmChannels.length}
              sub={stats.groupDms.length > 0 ? `+ ${stats.groupDms.length} group DM${stats.groupDms.length !== 1 ? "s" : ""}` : "No group DMs"}
              color="#06b6d4"
              glow="#06b6d4"
            />
            <StatCard
              icon={<Layers className="w-4 h-4" />}
              label="Total Channels"
              value={channels.length}
              sub="DMs & groups combined"
              color="#f59e0b"
              glow="#f59e0b"
            />
            <StatCard
              icon={<Inbox className="w-4 h-4" />}
              label="Incoming Requests"
              value={stats.incomingReqs.length}
              sub={stats.outgoingReqs.length > 0 ? `${stats.outgoingReqs.length} outgoing` : "No outgoing"}
              color="#e879f9"
              glow="#e879f9"
            />
            <StatCard
              icon={<UserX className="w-4 h-4" />}
              label="Blocked"
              value={stats.blocked.length}
              sub="Users you've blocked"
              color="#f43f5e"
              glow="#f43f5e"
            />
          </div>
        </section>

        {/* Relationships Breakdown */}
        <section>
          <h2 className="text-[11px] font-bold text-[#6d6f76] uppercase tracking-widest mb-3">Relationships Breakdown</h2>
          <div
            className="rounded-[12px] overflow-hidden"
            style={{ background: "#080f1c", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <InfoRow label="Total Relationships" value={String(relationships.length)} icon={<Users className="w-4 h-4" />} />
            <InfoRow label="Friends" value={String(stats.friends.length)} icon={<UserCheck className="w-4 h-4" />} />
            <InfoRow label="Incoming Requests" value={String(stats.incomingReqs.length)} icon={<Inbox className="w-4 h-4" />} />
            <InfoRow label="Outgoing Requests" value={String(stats.outgoingReqs.length)} icon={<Inbox className="w-4 h-4" />} />
            <InfoRow label="Blocked Users" value={String(stats.blocked.length)} icon={<UserX className="w-4 h-4" />} />
          </div>
        </section>

        {/* Servers Breakdown */}
        <section>
          <h2 className="text-[11px] font-bold text-[#6d6f76] uppercase tracking-widest mb-3">Servers Breakdown</h2>
          <div
            className="rounded-[12px] overflow-hidden"
            style={{ background: "#080f1c", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <InfoRow label="Total Servers" value={String(guilds.length)} icon={<Server className="w-4 h-4" />} />
            <InfoRow label="Owned Servers" value={String(stats.ownedServers.length)} icon={<Shield className="w-4 h-4" />} />
            <InfoRow label="Member Of" value={String(guilds.length - stats.ownedServers.length)} icon={<Globe className="w-4 h-4" />} />
          </div>
        </section>

        {/* Channels Breakdown */}
        <section>
          <h2 className="text-[11px] font-bold text-[#6d6f76] uppercase tracking-widest mb-3">Channels Breakdown</h2>
          <div
            className="rounded-[12px] overflow-hidden"
            style={{ background: "#080f1c", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <InfoRow label="Total Channels" value={String(channels.length)} icon={<Layers className="w-4 h-4" />} />
            <InfoRow label="Direct Messages" value={String(stats.dmChannels.length)} icon={<MessageCircle className="w-4 h-4" />} />
            <InfoRow label="Group DMs" value={String(stats.groupDms.length)} icon={<Users className="w-4 h-4" />} />
          </div>
        </section>

      </div>
    </div>
  );
}
