import { useState } from "react";
import { ServerList } from "@/components/ServerList";
import { Sidebar } from "@/components/Sidebar";
import { GuildChannelList } from "@/components/GuildChannelList";
import { FriendsList } from "@/components/FriendsList";
import { ActiveNow } from "@/components/ActiveNow";
import { ChatView } from "@/components/ChatView";
import { InProgressPage } from "@/components/InProgress";
import ShopPage from "@/discord/Shop";
import QuestsPage from "@/discord/Quests";
import MessageRequestsPage from "@/discord/MessageRequests";
import { useAppStore } from "@/store/useAppStore";
import type { Channel } from "@/types";

interface DiscordHomeProps {
  onSwitchMode: () => void;
}

export default function DiscordHome({ onSwitchMode }: DiscordHomeProps) {
  const servers = useAppStore((s) => s.servers);
  const setActiveServer = useAppStore((s) => s.setActiveServer);
  const setActiveChannel = useAppStore((s) => s.setActiveChannel);
  const setActiveDm = useAppStore((s) => s.setActiveDm);
  const activeServerId = useAppStore((s) => s.activeServerId);
  const activeChannelId = useAppStore((s) => s.activeChannelId);
  const activeDmId = useAppStore((s) => s.activeDmId);
  const getDmRecipient = useAppStore((s) => s.getDmRecipient);
  const getChannelsByServer = useAppStore((s) => s.getChannelsByServer);

  const [view, setView] = useState<string>("friends");
  const [activeServerPanel, setActiveServerPanel] = useState<"dms" | string>("dms");

  function handleSelectServer(serverId: "dms" | string) {
    setActiveServerPanel(serverId);
    if (serverId === "dms") {
      setActiveServer(null);
      setActiveChannel(null);
    } else {
      setActiveServer(serverId);
      setActiveChannel(null);
      setActiveDm(null);
      const channels = getChannelsByServer(serverId);
      const firstText = channels.find((c) => c.type === "text");
      if (firstText) setActiveChannel(firstText.id);
    }
  }

  function handleNavigate(newView: string) {
    setActiveDm(null);
    setView(newView);
  }

  function handleOpenDm(dmId: string) {
    setActiveDm(dmId);
    setView("dm");
    setActiveServerPanel("dms");
  }

  function handleSelectChannel(ch: Channel) {
    setActiveChannel(ch.id);
  }

  const activeServer = activeServerId ? servers.find((s) => s.id === activeServerId) ?? null : null;
  const activeChannel = activeServerId && activeChannelId
    ? getChannelsByServer(activeServerId).find((c) => c.id === activeChannelId) ?? null
    : null;
  const dmRecipient = activeDmId ? getDmRecipient(activeDmId) : null;
  const showGuildSidebar = activeServerPanel !== "dms" && activeServer !== null;

  return (
    <div className="flex h-screen w-full overflow-hidden text-foreground font-sans selection:bg-primary/30" style={{ backgroundColor: "#000000" }}>
      <ServerList
        activeServer={activeServerPanel}
        onSelectServer={handleSelectServer}
        isBotMode={false}
        onToggleBotMode={onSwitchMode}
      />

      {showGuildSidebar ? (
        <GuildChannelList
          server={activeServer!}
          activeChannelId={activeChannelId}
          onSelectChannel={handleSelectChannel}
        />
      ) : (
        <Sidebar
          activeView={view}
          onNavigate={handleNavigate}
          onOpenDm={handleOpenDm}
          activeDmId={activeDmId}
          isBotMode={false}
        />
      )}

      <div
        key={`discord-${activeServerPanel}-${activeDmId}-${activeChannelId}-${view}`}
        className="flex flex-1 h-full overflow-hidden animate-view-fade"
      >
        {showGuildSidebar ? (
          activeChannel ? (
            <ChatView
              channelId={activeChannel.id}
              channelName={activeChannel.name}
              channelTopic={activeChannel.topic}
              isDm={false}
            />
          ) : (
            <div className="flex-1 h-full flex flex-col items-center justify-center gap-3" style={{ backgroundColor: "#000000" }}>
              <p className="text-[#87898c] text-[15px] font-semibold">{activeServer?.name}</p>
              <p className="text-[#5e6068] text-[13px]">Select a channel to start chatting</p>
            </div>
          )
        ) : view === "dm" && activeDmId ? (
          <ChatView
            channelId={activeDmId}
            channelName={dmRecipient?.displayName ?? "DM"}
            isDm={true}
            dmRecipient={dmRecipient}
          />
        ) : view === "shop" ? (
          <ShopPage />
        ) : view === "quests" ? (
          <QuestsPage />
        ) : view === "requests" ? (
          <MessageRequestsPage />
        ) : view === "friends" || view === "dm" ? (
          <>
            <FriendsList />
            <ActiveNow />
          </>
        ) : (
          <InProgressPage title="Nitro Home" subtitle="Nitro Home and other features are currently being built. Coming soon!" />
        )}
      </div>
    </div>
  );
}
