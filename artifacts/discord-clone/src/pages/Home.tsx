import { useState } from "react";
import { ServerList } from "@/components/ServerList";
import { Sidebar } from "@/components/Sidebar";
import { FriendsList } from "@/components/FriendsList";
import { ActiveNow } from "@/components/ActiveNow";
import Shop from "@/pages/Shop";

export default function Home() {
  const [view, setView] = useState<string>("friends");

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground font-sans selection:bg-primary/30">
      <ServerList />
      <Sidebar activeView={view} onNavigate={setView} />

      {view === "shop" ? (
        <Shop />
      ) : (
        <>
          <FriendsList />
          <ActiveNow />
        </>
      )}
    </div>
  );
}
