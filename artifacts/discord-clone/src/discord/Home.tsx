import { useState } from "react";
import { ServerList } from "@/components/ServerList";
import { Sidebar } from "@/components/Sidebar";
import { GuildChannelList } from "@/components/GuildChannelList";
import { FriendsList } from "@/components/FriendsList";
import { ActiveNow } from "@/components/ActiveNow";
import { ChatView } from "@/components/ChatView";
import { InboxPanel } from "@/components/InboxPanel";
import { SettingsModal } from "@/components/SettingsModal";
import { useDiscord } from "@/hooks/useDiscord";
import ShopPage from "@/discord/Shop";
import QuestsPage from "@/discord/Quests";
import type { DiscordGuild, GuildChannel, DiscordChannel } from "@/lib/api";

interface DiscordHomeProps {
  onSwitchMode: () => void;
}

export default function DiscordHome({ onSwitchMode }: DiscordHomeProps) {
  const { user, guilds, channels } = useDiscord();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [view, setView] = useState<string>("friends");
  const [activeDmId, setActiveDmId] = useState<string | null>(null);
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
  const showGuildSidebar = activeServer !== "dms" && activeGuild !== null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground font-sans selection:bg-primary/30">
      <ServerList
        activeServer={activeServer}
        onSelectServer={handleSelectServer}
        isBotMode={false}
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
          onOpenDm={handleOpenDm}
          activeDmId={activeDmId}
          onOpenSettings={() => setSettingsOpen(true)}
          isBotMode={false}
        />
      )}

      <div
        key={`discord-${activeServer}-${activeDmId}-${activeChannel?.id}-${view}`}
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
              onInboxToggle={() => setInboxOpen((v) => !v)}
            />
          ) : (
            <div className="flex-1 h-full flex flex-col items-center justify-center gap-3" style={{ backgroundColor: "#0a1220" }}>
              <p className="text-[#87898c] text-[15px] font-semibold">{activeGuild?.name}</p>
              <p className="text-[#5e6068] text-[13px]">Select a channel to start chatting</p>
            </div>
          )
        ) : view === "dm" && activeDmId ? (
          <ChatView
            channelId={activeDmId}
            channelName={dmRecipient ? (dmRecipient.global_name ?? dmRecipient.username) : "DM"}
            isDm={true}
            dmRecipient={dmRecipient}
            currentUser={user}
            onInboxToggle={() => setInboxOpen((v) => !v)}
          />
        ) : view === "shop" ? (
          <ShopPage />
        ) : view === "quests" ? (
          <QuestsPage />
        ) : view === "friends" || view === "dm" ? (
          <>
            <FriendsList onInboxToggle={() => setInboxOpen((v) => !v)} />
            {!inboxOpen && <ActiveNow />}
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

        {inboxOpen && (
          <InboxPanel
            onClose={() => setInboxOpen(false)}
            onOpenDm={(id) => {
              setInboxOpen(false);
              handleOpenDm(id);
            }}
          />
        )}
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
