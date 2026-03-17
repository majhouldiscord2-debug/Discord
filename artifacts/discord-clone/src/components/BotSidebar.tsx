import { useState } from "react";
import { BarChart2, MessageSquare, ScrollText, Wrench, Server, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export type BotView = "stats" | "requests" | "logs" | "tools" | "servers" | "activity";

interface NavItem {
  id: BotView;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: "stats",    label: "Stats",            icon: <BarChart2 className="w-5 h-5" /> },
  { id: "requests", label: "Messages Requests", icon: <MessageSquare className="w-5 h-5" /> },
  { id: "logs",     label: "Logs",              icon: <ScrollText className="w-5 h-5" /> },
  { id: "tools",    label: "Tools",             icon: <Wrench className="w-5 h-5" /> },
  { id: "servers",  label: "Servers",           icon: <Server className="w-5 h-5" /> },
  { id: "activity", label: "LOGS",              icon: <FileText className="w-5 h-5" /> },
];

function BotIconSvg() {
  return (
    <svg viewBox="0 0 100 100" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="50" y1="8" x2="50" y2="22" stroke="white" strokeWidth="5" strokeLinecap="round" />
      <circle cx="50" cy="6" r="5" fill="white" />
      <rect x="7" y="40" width="10" height="20" rx="5" fill="white" />
      <rect x="83" y="40" width="10" height="20" rx="5" fill="white" />
      <rect x="18" y="24" width="64" height="54" rx="18" fill="white" />
      <rect x="26" y="32" width="48" height="38" rx="10" fill="#1d6ef5" />
      <rect x="34" y="43" width="12" height="16" rx="4" fill="white" />
      <rect x="54" y="43" width="12" height="16" rx="4" fill="white" />
    </svg>
  );
}

interface BotSidebarProps {
  activeView: BotView;
  onNavigate: (view: BotView) => void;
  onToggleBotMode: () => void;
}

export function BotSidebar({ activeView, onNavigate, onToggleBotMode }: BotSidebarProps) {
  const [hovered, setHovered] = useState<BotView | "toggle" | null>(null);

  return (
    <div
      className="w-[220px] h-full flex flex-col shrink-0"
      style={{
        background: "linear-gradient(180deg, #060b14 0%, #050a12 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Header / toggle back button */}
      <div
        className="shrink-0 flex items-center gap-3 px-4 py-4 cursor-pointer group"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        onClick={onToggleBotMode}
        onMouseEnter={() => setHovered("toggle")}
        onMouseLeave={() => setHovered(null)}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
          style={{
            background: hovered === "toggle"
              ? "linear-gradient(135deg, #1d6ef5 0%, #1a5fd4 100%)"
              : "linear-gradient(135deg, #1d6ef5cc 0%, #1a5fd4cc 100%)",
            boxShadow: hovered === "toggle" ? "0 0 16px #1d6ef555" : undefined,
          }}
        >
          <BotIconSvg />
        </div>
        <div>
          <p className="text-[13px] font-bold text-[#f2f3f5] leading-tight">Bot Mode</p>
          <p className="text-[11px] text-[#949ba4]">Click to switch back</p>
        </div>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto discord-scrollbar py-3 px-2">
        <p className="text-[10px] font-bold tracking-widest uppercase text-[#4e5058] px-2 mb-2">Navigation</p>
        <div className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150",
                  isActive
                    ? "bg-[#1d6ef5]/20 text-white"
                    : "text-[#949ba4] hover:text-[#dbdee1] hover:bg-white/5"
                )}
              >
                <span
                  className="shrink-0 transition-colors"
                  style={{ color: isActive ? "#1d6ef5" : undefined }}
                >
                  {item.icon}
                </span>
                <span className="text-[14px] font-medium">{item.label}</span>
                {isActive && (
                  <div
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: "#1d6ef5" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status bar at bottom */}
      <div
        className="shrink-0 px-4 py-3 flex items-center gap-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="w-2 h-2 rounded-full bg-[#23a55a]" />
        <span className="text-[12px] text-[#949ba4]">Bot online</span>
      </div>
    </div>
  );
}
