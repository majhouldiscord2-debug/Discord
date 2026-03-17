import { BarChart2, MessageSquare, Users, Server, TrendingUp, Activity } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ label, value, sub, icon, color }: StatCardProps) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{ backgroundColor: "#080e1a", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-[#949ba4]">{label}</span>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: color + "22", color }}
        >
          {icon}
        </div>
      </div>
      <div>
        <p className="text-[28px] font-bold text-[#f2f3f5] leading-none">{value}</p>
        {sub && <p className="text-[12px] text-[#949ba4] mt-1">{sub}</p>}
      </div>
    </div>
  );
}

interface BarProps {
  label: string;
  value: number;
  max: number;
  color: string;
}

function Bar({ label, value, max, color }: BarProps) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-[12px] text-[#949ba4] w-20 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[12px] font-semibold text-[#dbdee1] w-10 text-right shrink-0">{value}</span>
    </div>
  );
}

export default function Stats() {
  return (
    <div
      className="flex-1 h-full flex flex-col min-w-0 overflow-hidden"
      style={{ backgroundColor: "#050a12" }}
    >
      {/* Header */}
      <div
        className="shrink-0 h-12 flex items-center px-5 gap-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", backgroundColor: "#050a12" }}
      >
        <BarChart2 className="w-5 h-5 text-[#1d6ef5]" />
        <span className="text-[16px] font-bold text-[#f2f3f5]">Stats</span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto discord-scrollbar px-6 py-5">
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard label="Total Messages Sent" value="14,832" sub="+342 this week" icon={<MessageSquare className="w-4 h-4" />} color="#1d6ef5" />
          <StatCard label="Servers Joined"       value="97"     sub="across all bots"  icon={<Server className="w-4 h-4" />}       color="#23a55a" />
          <StatCard label="Active Users"         value="2,104"  sub="last 24 hours"    icon={<Users className="w-4 h-4" />}         color="#f59e0b" />
          <StatCard label="Mentions Sent"        value="6,417"  sub="last 30 days"     icon={<Activity className="w-4 h-4" />}      color="#e879f9" />
          <StatCard label="Success Rate"         value="98.3%"  sub="message delivery" icon={<TrendingUp className="w-4 h-4" />}    color="#22c55e" />
          <StatCard label="Orbs Earned"          value="2,130"  sub="total balance"    icon={<BarChart2 className="w-4 h-4" />}     color="#a78bfa" />
        </div>

        {/* Activity by server */}
        <div
          className="rounded-xl p-5 mb-6"
          style={{ backgroundColor: "#080e1a", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <p className="text-[10px] font-bold tracking-widest uppercase text-[#1d6ef5] mb-4">Activity by Server</p>
          <div className="flex flex-col gap-3">
            <Bar label="Gaming Hub"   value={412} max={500} color="#1d6ef5" />
            <Bar label="Dev Talk"     value={298} max={500} color="#23a55a" />
            <Bar label="Crypto World" value={376} max={500} color="#f59e0b" />
            <Bar label="Anime Zone"   value={201} max={500} color="#e879f9" />
            <Bar label="Sports Live"  value={165} max={500} color="#06b6d4" />
          </div>
        </div>

        {/* Recent activity log */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "#080e1a", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <p className="text-[10px] font-bold tracking-widest uppercase text-[#1d6ef5] mb-4">Recent Activity</p>
          <div className="flex flex-col gap-2">
            {[
              { time: "2m ago",  event: "Message sent to #general in Gaming Hub",   color: "#1d6ef5" },
              { time: "5m ago",  event: "Auto-joined server: Crypto World",          color: "#23a55a" },
              { time: "12m ago", event: "Smart mention triggered in Dev Talk",       color: "#f59e0b" },
              { time: "18m ago", event: "DM sent to user @playerX",                 color: "#e879f9" },
              { time: "34m ago", event: "Quest completed: War Thunder Video Quest",  color: "#a78bfa" },
              { time: "1h ago",  event: "Message sent to #announcements",            color: "#06b6d4" },
            ].map((entry, i) => (
              <div
                key={i}
                className="flex items-start gap-3 py-2"
                style={{ borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.04)" : undefined }}
              >
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: entry.color }} />
                <span className="flex-1 text-[13px] text-[#dbdee1]">{entry.event}</span>
                <span className="text-[11px] text-[#4e5058] shrink-0">{entry.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
