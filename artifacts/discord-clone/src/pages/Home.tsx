import { useState } from "react";
import { ServerList } from "@/components/ServerList";
import { Sidebar } from "@/components/Sidebar";
import { FriendsList } from "@/components/FriendsList";
import { ActiveNow } from "@/components/ActiveNow";
import Shop from "@/pages/Shop";
import Quests from "@/pages/Quests";
import LogsPage from "@/pages/Logs";
import { SettingsModal } from "@/components/SettingsModal";

export default function Home() {
  const [view, setView] = useState<string>("friends");
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground font-sans selection:bg-primary/30">
      <ServerList />
      <Sidebar
        activeView={view}
        onNavigate={setView}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <div key={view} className="flex flex-1 h-full overflow-hidden animate-view-fade">
        {view === "shop" ? (
          <Shop />
        ) : view === "quests" ? (
          <Quests />
        ) : view === "nitro" ? (
          <LogsPage />
        ) : view === "friends" || view === "dm" ? (
          <>
            <FriendsList />
            <ActiveNow />
          </>
        ) : (
          <div
            className="flex-1 h-full flex flex-col items-center justify-center gap-3"
            style={{ backgroundColor: "#313338" }}
          >
            <p className="text-[#87898c] text-[15px] font-semibold">Coming soon...</p>
            <p className="text-[#5e6068] text-[13px]">This section isn't available yet.</p>
          </div>
        )}
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
