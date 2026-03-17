import { useState } from "react";
import { ServerList } from "@/components/ServerList";
import { Sidebar } from "@/components/Sidebar";
import { FriendsList } from "@/components/FriendsList";
import { ActiveNow } from "@/components/ActiveNow";
import Shop from "@/pages/Shop";
import Quests from "@/pages/Quests";

export default function Home() {
  const [view, setView] = useState<string>("friends");

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground font-sans selection:bg-primary/30">
      <ServerList />
      <Sidebar activeView={view} onNavigate={setView} />

      {view === "shop" ? (
        <Shop />
      ) : view === "quests" ? (
        <Quests />
      ) : (
        <>
          <FriendsList />
          <ActiveNow />
        </>
      )}
    </div>
  );
}
