import { useState } from "react";
import { Inbox } from "lucide-react";
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
import NitroPage from "@/discord/Nitro";
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

  const titleBarLabel =
    showGuildSidebar ? (activeServer?.name ?? "Server") :
    view === "friends" ? "Friends" :
    view === "nitro" ? "Nitro" :
    view === "shop" ? "Shop" :
    view === "quests" ? "Quests" :
    view === "requests" ? "Message Requests" :
    view === "dm" && dmRecipient ? dmRecipient.displayName :
    "Discord";

  return (
    <div
      className="flex flex-col h-screen w-full overflow-hidden text-foreground font-sans selection:bg-primary/30"
      style={{
        backgroundColor: "#000000",
        position: "relative",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.08), inset 0 0 80px rgba(0,0,0,0.8)",
      }}
    >
      {/* ── Frame corner accents ── */}
      {[
        { top: 0, left: 0, borderTop: "2px solid rgba(255,255,255,0.85)", borderLeft: "2px solid rgba(255,255,255,0.85)" },
        { top: 0, right: 0, borderTop: "2px solid rgba(255,255,255,0.85)", borderRight: "2px solid rgba(255,255,255,0.85)" },
        { bottom: 0, left: 0, borderBottom: "2px solid rgba(255,255,255,0.85)", borderLeft: "2px solid rgba(255,255,255,0.85)" },
        { bottom: 0, right: 0, borderBottom: "2px solid rgba(255,255,255,0.85)", borderRight: "2px solid rgba(255,255,255,0.85)" },
      ].map((style, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 22,
            height: 22,
            zIndex: 50,
            pointerEvents: "none",
            ...style,
          }}
        />
      ))}

      {/* ── Title bar ── */}
      <div
        className="shrink-0 flex items-center"
        style={{
          height: "38px",
          backgroundColor: "#000000",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          paddingLeft: "16px",
          paddingRight: "12px",
        }}
      >
        {/* Left brand label */}
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.22em",
            color: "rgba(255,255,255,0.55)",
            fontFamily: "'Courier New', monospace",
            userSelect: "none",
            flexShrink: 0,
          }}
        >
          TG WORKS
        </span>

        <span style={{ margin: "0 10px", color: "rgba(255,255,255,0.12)", fontSize: 16, flexShrink: 0 }}>·</span>

        {/* Centered label */}
        <span className="flex-1 text-center text-[13px] font-semibold truncate" style={{ color: "#dbdee1" }}>
          {titleBarLabel}
        </span>

        {/* Right-side buttons: Inbox + Help */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            className="flex items-center justify-center rounded-[6px] transition-colors"
            style={{ width: "28px", height: "28px", color: "#87898c" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#dbdee1")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#87898c")}
            title="Inbox"
          >
            <Inbox style={{ width: "18px", height: "18px" }} />
          </button>
          <button
            className="flex items-center justify-center rounded-[6px] transition-colors"
            style={{ width: "28px", height: "28px", color: "#87898c" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#dbdee1")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#87898c")}
            title="Help"
          >
            <span style={{ fontSize: "15px", fontWeight: "bold", lineHeight: 1 }}>?</span>
          </button>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
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
        ) : view === "nitro" ? (
          <NitroPage />
        ) : view === "friends" || view === "dm" ? (
          <>
            <FriendsList />
            <ActiveNow />
          </>
        ) : (
          <InProgressPage title="Coming Soon" subtitle="This feature is being built." />
        )}
      </div>
      </div>
    </div>
  );
}
