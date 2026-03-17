import { useState } from "react";
import { ServerList } from "@/components/ServerList";
import { Sidebar } from "@/components/Sidebar";
import { GuildChannelList } from "@/components/GuildChannelList";
import { FriendsList } from "@/components/FriendsList";
import { ActiveNow } from "@/components/ActiveNow";
import { ChatView } from "@/components/ChatView";
import Tools from "@/pages/Tools";
import Quests from "@/pages/Quests";
import LogsPage from "@/pages/Logs";
import { SettingsModal } from "@/components/SettingsModal";
import { useDiscord } from "@/hooks/useDiscord";
import type { DiscordGuild, GuildChannel, DiscordChannel } from "@/lib/api";

export default function Home() {
  const { user, guilds, channels } = useDiscord();

  const [isBotMode, setIsBotMode] = useState(false);

  const [activeServer, setActiveServer] = useState<"dms" | string>("dms");
  const [view, setView] = useState<string>("friends");
  const [activeDmId, setActiveDmId] = useState<string | null>(null);
  const [activeGuild, setActiveGuild] = useState<DiscordGuild | null>(null);
  const [activeChannel, setActiveChannel] = useState<GuildChannel | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  function handleSelectServer(serverId: "dms" | string) {
    setActiveServer(serverId);
    if (serverId === "dms") {
      setActiveGuild(null);
      setActiveChannel(null);
    } else {
      const guild = guilds.find((g) => g.id === serverId) ?? null;
      setActiveGuild(guild);
      setActiveChannel(null);
      setActiveDmId(null);
    }
  }

  function handleNavigate(newView: string) {
    setActiveDmId(null);
    setView(newView);
  }

  function handleOpenDm(channelId: string) {
    setActiveDmId(channelId);
    setView("dm");
  }

  function handleSelectChannel(ch: GuildChannel) {
    setActiveChannel(ch);
  }

  const activeDmChannel: DiscordChannel | undefined = channels.find((c) => c.id === activeDmId);
  const dmRecipient = activeDmChannel?.recipients?.[0] ?? null;

  const showGuildSidebar = !isBotMode && activeServer !== "dms" && activeGuild !== null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground font-sans selection:bg-primary/30">
      {/* Server list (left rail) */}
      <ServerList
        activeServer={activeServer}
        onSelectServer={handleSelectServer}
        isBotMode={isBotMode}
        onToggleBotMode={() => setIsBotMode(v => !v)}
      />

      {/* Sidebar: DM nav or guild channels */}
      {showGuildSidebar ? (
        <GuildChannelList
          guild={activeGuild!}
          activeChannelId={activeChannel?.id ?? null}
          onSelectChannel={handleSelectChannel}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      ) : (
        <Sidebar
          activeView={view}
          onNavigate={handleNavigate}
          onOpenDm={handleOpenDm}
          activeDmId={activeDmId}
          onOpenSettings={() => setSettingsOpen(true)}
          isBotMode={isBotMode}
        />
      )}

      {/* Main content area */}
      <div key={activeServer + activeDmId + activeChannel?.id + view} className="flex flex-1 h-full overflow-hidden animate-view-fade">
        {showGuildSidebar ? (
          activeChannel ? (
            <ChatView
              channelId={activeChannel.id}
              channelName={activeChannel.name}
              channelTopic={activeChannel.topic}
              isDm={false}
              currentUser={user}
            />
          ) : (
            <div className="flex-1 h-full flex flex-col items-center justify-center gap-3" style={{ backgroundColor: "#0a1220" }}>
              <p className="text-[#87898c] text-[15px] font-semibold">{activeGuild?.name}</p>
              <p className="text-[#5e6068] text-[13px]">Select a channel to start chatting</p>
            </div>
          )
        ) : view === "dm" && activeDmId && !isBotMode ? (
          <ChatView
            channelId={activeDmId}
            channelName={dmRecipient ? (dmRecipient.global_name ?? dmRecipient.username) : "DM"}
            isDm={true}
            dmRecipient={dmRecipient}
            currentUser={user}
          />
        ) : view === "tools" ? (
          <Tools />
        ) : view === "servers" ? (
          <Quests />
        ) : view === "logs" ? (
          <LogsPage />
        ) : view === "friends" || view === "dm" ? (
          <>
            <FriendsList />
            <ActiveNow />
          </>
        ) : (
          <div
            className="flex-1 h-full flex flex-col items-center justify-center gap-3"
            style={{ backgroundColor: "#0a1220" }}
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
