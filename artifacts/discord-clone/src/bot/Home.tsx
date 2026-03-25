import { useState } from "react";
import { Inbox } from "lucide-react";
import { ServerList } from "@/components/ServerList";
import { Sidebar } from "@/components/Sidebar";
import { SettingsModal } from "@/components/SettingsModal";
import ToolsPage from "@/bot/Tools";
import ServerPage from "@/bot/Server";
import LogsPage from "@/bot/Logs";
import StatsPage from "@/bot/Stats";
import SkillsPage from "@/bot/Skills";

interface BotHomeProps {
  onSwitchMode: () => void;
}

export default function BotHome({ onSwitchMode }: BotHomeProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [view, setView] = useState<string>("friends");

  function handleNavigate(newView: string) {
    setView(newView);
  }

  const titleBarLabel =
    view === "friends" ? "Overview" :
    view === "tools" ? "Tools" :
    view === "servers" ? "Servers" :
    view === "logs" ? "Logs" :
    view === "skills" ? "Skills" :
    "Bot Manager";

  return (
    <div
      className="flex flex-col h-screen w-full overflow-hidden text-foreground font-sans selection:bg-primary/30"
      style={{ backgroundColor: "#000000" }}
    >
      {/* ── Title bar ── */}
      <div
        className="shrink-0 flex items-center"
        style={{
          height: "38px",
          backgroundColor: "#000000",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          paddingLeft: "16px",
          paddingRight: "12px",
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.22em",
            color: "rgba(255,255,255,0.55)",
            fontFamily: "'Courier New', monospace",
            userSelect: "none",
            flexShrink: 0,
          }}
        >
          TG WORKS
        </span>

        <span style={{ margin: "0 10px", color: "rgba(255,255,255,0.12)", fontSize: 16, flexShrink: 0 }}>·</span>

        <span className="flex-1 text-center text-[13px] font-semibold truncate" style={{ color: "#dbdee1" }}>
          {titleBarLabel}
        </span>

        <div className="flex items-center gap-1 shrink-0">
          <button
            className="flex items-center justify-center rounded-[6px] transition-colors"
            style={{ width: "28px", height: "28px", color: "#87898c" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#dbdee1")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#87898c")}
            title="Inbox"
          >
            <Inbox style={{ width: "18px", height: "18px" }} />
          </button>
          <button
            className="flex items-center justify-center rounded-[6px] transition-colors"
            style={{ width: "28px", height: "28px", color: "#87898c" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#dbdee1")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#87898c")}
            title="Help"
          >
            <span style={{ fontSize: "15px", fontWeight: "bold", lineHeight: 1 }}>?</span>
          </button>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <ServerList
          activeServer="dms"
          onSelectServer={() => {}}
          isBotMode={true}
          onToggleBotMode={onSwitchMode}
        />

        <Sidebar
          activeView={view}
          onNavigate={handleNavigate}
          onOpenSettings={() => setSettingsOpen(true)}
          isBotMode={true}
        />

        <div
          key={`bot-${view}`}
          className="flex flex-1 h-full overflow-hidden animate-view-fade"
        >
          {view === "tools" ? (
            <ToolsPage />
          ) : view === "servers" ? (
            <ServerPage />
          ) : view === "logs" ? (
            <LogsPage />
          ) : view === "skills" ? (
            <SkillsPage />
          ) : view === "friends" ? (
            <StatsPage />
          ) : (
            <div className="flex-1 h-full flex flex-col items-center justify-center gap-3" style={{ backgroundColor: "#0a0000" }}>
              <p className="text-[#87898c] text-[15px] font-semibold">Coming soon…</p>
              <p className="text-[#5e6068] text-[13px]">This section isn't available yet.</p>
            </div>
          )}
        </div>
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
