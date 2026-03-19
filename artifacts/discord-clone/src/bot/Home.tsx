import { useState } from "react";
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

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground font-sans selection:bg-primary/30">
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
          <div className="flex-1 h-full flex flex-col items-center justify-center gap-3" style={{ backgroundColor: "#0a1220" }}>
            <p className="text-[#87898c] text-[15px] font-semibold">Coming soon…</p>
            <p className="text-[#5e6068] text-[13px]">This section isn't available yet.</p>
          </div>
        )}
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
