import React, { useState } from "react";
import { ServerList, Sidebar, FriendsList, ActiveNow } from "@/components/discord-ui";

export default function Home() {
  const [activeServer, setActiveServer] = useState<number | "dms">("dms");
  const [activeView, setActiveView] = useState("friends");

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground font-sans selection:bg-primary/30">
      <ServerList activeServer={activeServer} onServerSelect={setActiveServer} />
      
      {activeServer === "dms" ? (
        <>
          <Sidebar activeView={activeView} onNavigate={setActiveView} />
          {activeView === "friends" ? (
            <>
              <FriendsList />
              <ActiveNow />
            </>
          ) : activeView === "dm" ? (
            <div className="flex-1 flex flex-col bg-[#313338]">
              <div className="h-12 border-b border-black/25 flex items-center px-4 font-semibold text-white">
                Chat View
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-[#949ba4]">
                <div className="text-xl font-semibold mb-2 text-[#f2f3f5]">Direct Message</div>
                <p>This is where your conversation would happen.</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#313338] text-[#949ba4]">
              <div className="text-xl font-semibold mb-2 text-[#f2f3f5]">
                {activeView.charAt(0).toUpperCase() + activeView.slice(1)} View
              </div>
              <p>This view is currently under construction.</p>
            </div>
          )}
        </>
      ) : (
        <div className="flex-1 flex bg-[#313338]">
          <div className="w-[240px] bg-[#2b2d31] flex flex-col p-4">
            <div className="h-12 border-b border-black/25 flex items-center font-bold text-white mb-4">
              Server {activeServer}
            </div>
            <div className="text-[#949ba4] text-sm italic">Channels would go here...</div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-[#949ba4]">
            <div className="text-xl font-semibold mb-2 text-[#f2f3f5]">Server Content</div>
            <p>Welcome to Server {activeServer}!</p>
          </div>
        </div>
      )}
    </div>
  );
}
