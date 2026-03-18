import { useState } from "react";
import { ServerList } from "@/components/ServerList";
import { Sidebar } from "@/components/Sidebar";
import { GuildChannelList } from "@/components/GuildChannelList";
import { FriendsList } from "@/components/FriendsList";
import { ActiveNow } from "@/components/ActiveNow";
import { ChatView } from "@/components/ChatView";
import { InboxPanel } from "@/components/InboxPanel";
import Tools from "@/pages/Tools";
import Quests from "@/pages/Quests";
import ShopPage from "@/pages/Shop";
import QuestsPage from "@/pages/QuestsPage";
import LogsPage from "@/pages/Logs";
import StatsPage from "@/pages/Stats";
import { SettingsModal } from "@/components/SettingsModal";
import { useDiscord } from "@/hooks/useDiscord";
import type { DiscordGuild, GuildChannel, DiscordChannel } from "@/lib/api";

// Profile 1 = Discord app (discord icon)
// Profile 2 = Dev dashboard (bot icon)
// Stored in memory only — not shown on the dashboard

export default function Home() {
  const { user, guilds, channels } = useDiscord();

  const [isBotMode, setIsBotMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);

  // ── Profile 1 state ─────────────────────────────────────────
  const [p1View, setP1View] = useState<string>("friends");
  const [p1ActiveDmId, setP1ActiveDmId] = useState<string | null>(null);
  const [p1ActiveServer, setP1ActiveServer] = useState<"dms" | string>("dms");
  const [p1ActiveGuild, setP1ActiveGuild] = useState<DiscordGuild | null>(null);
  const [p1ActiveChannel, setP1ActiveChannel] = useState<GuildChannel | null>(null);

  // ── Profile 2 state ─────────────────────────────────────────
  const [p2View, setP2View] = useState<string>("friends");
  const [p2ActiveDmId, setP2ActiveDmId] = useState<string | null>(null);
  const [p2ActiveServer, setP2ActiveServer] = useState<"dms" | string>("dms");
  const [p2ActiveGuild, setP2ActiveGuild] = useState<DiscordGuild | null>(null);
  const [p2ActiveChannel, setP2ActiveChannel] = useState<GuildChannel | null>(null);

  // ── Active profile aliases ───────────────────────────────────
  const view         = isBotMode ? p2View         : p1View;
  const activeDmId   = isBotMode ? p2ActiveDmId   : p1ActiveDmId;
  const activeServer = isBotMode ? p2ActiveServer  : p1ActiveServer;
  const activeGuild  = isBotMode ? p2ActiveGuild   : p1ActiveGuild;
  const activeChannel= isBotMode ? p2ActiveChannel : p1ActiveChannel;

  const setView          = isBotMode ? setP2View          : setP1View;
  const setActiveDmId    = isBotMode ? setP2ActiveDmId    : setP1ActiveDmId;
  const setActiveServer  = isBotMode ? setP2ActiveServer  : setP1ActiveServer;
  const setActiveGuild   = isBotMode ? setP2ActiveGuild   : setP1ActiveGuild;
  const setActiveChannel = isBotMode ? setP2ActiveChannel : setP1ActiveChannel;

  // ── Handlers ────────────────────────────────────────────────
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
      <div
        key={`${isBotMode ? "p2" : "p1"}-${activeServer}-${activeDmId}-${activeChannel?.id}-${view}`}
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
        ) : view === "dm" && activeDmId && !isBotMode ? (
          <ChatView
            channelId={activeDmId}
            channelName={dmRecipient ? (dmRecipient.global_name ?? dmRecipient.username) : "DM"}
            isDm={true}
            dmRecipient={dmRecipient}
            currentUser={user}
            onInboxToggle={() => setInboxOpen((v) => !v)}
          />
        ) : view === "tools" ? (
          <Tools />
        ) : view === "servers" ? (
          <Quests />
        ) : view === "shop" ? (
          <ShopPage />
        ) : view === "quests" ? (
          <QuestsPage />
        ) : view === "logs" ? (
          <LogsPage />
        ) : view === "friends" && isBotMode ? (
          <StatsPage />
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

        {!isBotMode && inboxOpen && (
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
