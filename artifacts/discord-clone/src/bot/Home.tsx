import { useState } from "react";
import { ServerList } from "@/components/ServerList";
import { Sidebar } from "@/components/Sidebar";
import { GuildChannelList } from "@/components/GuildChannelList";
import { ChatView } from "@/components/ChatView";
import { SettingsModal } from "@/components/SettingsModal";
import { useDiscord } from "@/hooks/useDiscord";
import ToolsPage from "@/bot/Tools";
import ServerPage from "@/bot/Server";
import LogsPage from "@/bot/Logs";
import StatsPage from "@/bot/Stats";
import type { DiscordGuild, GuildChannel } from "@/lib/api";

interface BotHomeProps {
  onSwitchMode: () => void;
}

export default function BotHome({ onSwitchMode }: BotHomeProps) {
  const { user, guilds } = useDiscord();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [view, setView] = useState<string>("friends");
  const [activeServer, setActiveServer] = useState<"dms" | string>("dms");
  const [activeGuild, setActiveGuild] = useState<DiscordGuild | null>(null);
  const [activeChannel, setActiveChannel] = useState<GuildChannel | null>(null);

  function handleSelectServer(serverId: "dms" | string) {
    setActiveServer(serverId);
    if (serverId === "dms") {
      setActiveGuild(null);
      setActiveChannel(null);
    } else {
      const guild = guilds.find((g) => g.id === serverId) ?? null;
      setActiveGuild(guild);
      setActiveChannel(null);
    }
  }

  function handleNavigate(newView: string) {
    setView(newView);
  }

  function handleSelectChannel(ch: GuildChannel) {
    setActiveChannel(ch);
  }

  const showGuildSidebar = activeServer !== "dms" && activeGuild !== null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground font-sans selection:bg-primary/30">
      <ServerList
        activeServer={activeServer}
        onSelectServer={handleSelectServer}
        isBotMode={true}
        onToggleBotMode={onSwitchMode}
      />

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
          onOpenSettings={() => setSettingsOpen(true)}
          isBotMode={true}
        />
      )}

      <div
        key={`bot-${activeServer}-${activeChannel?.id}-${view}`}
        className="flex flex-1 h-full overflow-hidden animate-view-fade"
      >
        {showGuildSidebar ? (
          activeChannel ? (
            <ChatView
              channelId={activeChannel.id}
              channelName={activeChannel.name}
              channelTopic={activeChannel.topic}
              isDm={false}
              currentUser={user}
              onInboxToggle={() => {}}
            />
          ) : (
            <div className="flex-1 h-full flex flex-col items-center justify-center gap-3" style={{ backgroundColor: "#0a1220" }}>
              <p className="text-[#87898c] text-[15px] font-semibold">{activeGuild?.name}</p>
              <p className="text-[#5e6068] text-[13px]">Select a channel to start chatting</p>
            </div>
          )
        ) : view === "tools" ? (
          <ToolsPage />
        ) : view === "servers" ? (
          <ServerPage />
        ) : view === "logs" ? (
          <LogsPage />
        ) : view === "friends" ? (
          <StatsPage />
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
