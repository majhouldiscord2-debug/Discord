import { useState } from "react";
import { Users, MessageCircle, MoreVertical, Search, Video, UserPlus, Inbox, UserX } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Avatar } from "./Avatar";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

type Tab = "online" | "all" | "pending" | "blocked" | "add";

interface FriendsListProps {
  onInboxToggle?: () => void;
}

const FRIENDS_IDS = ["user-nova", "user-pixel", "user-drift", "user-ghost", "user-lunar", "user-raven", "user-storm", "user-zeph"];
const PENDING_IDS = ["user-cosmic"];

export function FriendsList({ onInboxToggle }: FriendsListProps) {
  const users = useAppStore((s) => s.users);
  const [activeTab, setActiveTab] = useState<Tab>("online");
  const [search, setSearch] = useState("");

  const allFriends: User[] = FRIENDS_IDS.map((id) => users[id]).filter(Boolean) as User[];
  const pendingFriends: User[] = PENDING_IDS.map((id) => users[id]).filter(Boolean) as User[];
  const onlineFriends = allFriends.filter((u) => u.status !== "offline");

  const source =
    activeTab === "online" ? onlineFriends :
    activeTab === "all" ? allFriends :
    activeTab === "pending" ? pendingFriends :
    activeTab === "blocked" ? [] : [];

  const displayed = source.filter((u) =>
    u.displayName.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const statusLabel = (u: User) => {
    if (u.statusText) return u.statusText;
    if (u.status === "online") return "Online";
    if (u.status === "idle") return "Idle";
    if (u.status === "dnd") return "Do Not Disturb";
    return "Offline";
  };

  /* ── Top navigation header ── */
  return (
    <div className="flex-1 h-full flex flex-col min-w-0" style={{ backgroundColor: "#313338" }}>

      {/* Top Header */}
      <div
        className="h-12 shrink-0 flex items-center px-4 gap-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", backgroundColor: "#2b2d31" }}
      >
        {/* Friends icon + label */}
        <div className="flex items-center gap-2 mr-3 shrink-0">
          <Users className="w-5 h-5 text-[#7d8188]" />
          <span className="text-[#f2f3f5] font-semibold text-[15px]">Friends</span>
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-white/10 mx-3 shrink-0" />

        {/* Tab buttons */}
        <div className="flex items-center gap-0 flex-1 overflow-x-auto no-scrollbar">
          {(["online", "all", "pending", "blocked"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={cn(
                "relative px-3 py-[14px] text-[14px] font-medium transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 rounded-[4px] mx-[1px]",
                activeTab === t
                  ? "text-[#f2f3f5] bg-[#3d3f45]"
                  : "text-[#87898c] hover:text-[#dbdee1] hover:bg-[#3d3f45]/60"
              )}
            >
              {t === "online" ? "Online" : t === "all" ? "All" : t === "pending" ? "Pending" : "Blocked"}
              {t === "pending" && pendingFriends.length > 0 && (
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full leading-none bg-[#ed4245] text-white">
                  {pendingFriends.length}
                </span>
              )}
            </button>
          ))}

          {/* Add Friend button */}
          <button
            onClick={() => setActiveTab("add")}
            className={cn(
              "ml-2 px-3 py-1.5 text-[13px] font-semibold rounded-[6px] transition-all duration-150 whitespace-nowrap",
              activeTab === "add"
                ? "bg-[#5865f2]/20 text-[#5865f2]"
                : "bg-[#248046]/80 text-white hover:bg-[#1a6b38] hover:shadow-[0_2px_12px_rgba(36,128,70,0.35)]"
            )}
          >
            Add Friend
          </button>
        </div>

        {/* Right action icons */}
        <div className="flex items-center gap-1 ml-3 shrink-0">
          <button className="text-[#87898c] hover:text-[#dbdee1] p-1.5 rounded-[6px] transition-colors hover:bg-white/8" title="New Group DM">
            <Video className="w-[18px] h-[18px]" />
          </button>
          <button
            className="text-[#87898c] hover:text-[#dbdee1] p-1.5 rounded-[6px] transition-colors hover:bg-white/8"
            title="Inbox"
            onClick={onInboxToggle}
          >
            <Inbox className="w-[18px] h-[18px]" />
          </button>
          <button className="text-[#87898c] hover:text-[#dbdee1] p-1.5 rounded-[6px] transition-colors hover:bg-white/8" title="Help">
            <span className="w-[18px] h-[18px] flex items-center justify-center text-[15px] font-bold leading-none">?</span>
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto discord-scrollbar" style={{ backgroundColor: "#313338" }}>
        {activeTab === "add" ? (
          /* ── Add Friend view ── */
          <div className="px-8 py-8">
            <AddFriendView />
          </div>
        ) : (
          <div className="px-4 pt-4 pb-2">
            {/* Search bar */}
            <div
              className="flex items-center rounded-[8px] px-3 py-2 gap-2 mb-4"
              style={{ backgroundColor: "#1e1f22" }}
            >
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-[#dbdee1] placeholder:text-[#5e6068] text-[14px] outline-none"
              />
              <Search className="w-4 h-4 text-[#5e6068] shrink-0" />
            </div>

            {/* Section header */}
            {displayed.length > 0 && (
              <p className="text-[11px] font-bold text-[#87898c] uppercase tracking-[0.06em] px-2 mb-2 select-none">
                {activeTab === "online" ? `Online — ${displayed.length}` :
                 activeTab === "all" ? `All Friends — ${displayed.length}` :
                 activeTab === "pending" ? `Pending — ${displayed.length}` :
                 `Blocked — ${displayed.length}`}
              </p>
            )}

            {/* Friends list */}
            {displayed.length === 0 ? (
              <EmptyState tab={activeTab} />
            ) : (
              <div className="flex flex-col gap-0">
                {displayed.map((user) => (
                  <FriendRow
                    key={user.id}
                    user={user}
                    statusLabel={statusLabel(user)}
                    tab={activeTab}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Individual friend row ── */
function FriendRow({ user, statusLabel, tab }: { user: User; statusLabel: string; tab: Tab }) {
  return (
    <div
      className="flex items-center px-2 py-[10px] rounded-[8px] gap-3 cursor-pointer group transition-colors duration-100 hover:bg-[#3d3f45]"
      style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
    >
      {/* Avatar with status dot */}
      <div className="relative shrink-0">
        <Avatar
          initials={user.initials ?? user.displayName.slice(0, 2)}
          color={user.avatarColor ?? "#5865f2"}
          status={user.status}
          size="md"
          statusBg="#313338"
        />
      </div>

      {/* Name + status */}
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-[15px] font-semibold text-[#f2f3f5] leading-tight truncate group-hover:text-white">
          {user.displayName}
        </span>
        <span className="text-[13px] text-[#87898c] leading-tight truncate">
          {tab === "pending" ? "Incoming Friend Request" : statusLabel}
        </span>
      </div>

      {/* Action buttons — visible on hover */}
      <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
        {tab === "pending" ? (
          <>
            <ActionCircleBtn title="Accept" color="#248046">
              <UserPlus className="w-[18px] h-[18px]" />
            </ActionCircleBtn>
            <ActionCircleBtn title="Ignore" color="#ed4245">
              <UserX className="w-[18px] h-[18px]" />
            </ActionCircleBtn>
          </>
        ) : (
          <>
            <ActionCircleBtn title="Message">
              <MessageCircle className="w-[18px] h-[18px]" />
            </ActionCircleBtn>
            <ActionCircleBtn title="More">
              <MoreVertical className="w-[18px] h-[18px]" />
            </ActionCircleBtn>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Circular action button ── */
function ActionCircleBtn({
  children,
  title,
  color,
}: {
  children: React.ReactNode;
  title: string;
  color?: string;
}) {
  return (
    <button
      title={title}
      className={cn(
        "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150",
        "bg-[#1e1f22] text-[#87898c] hover:text-white"
      )}
      style={color ? { color: color } : undefined}
    >
      {children}
    </button>
  );
}

/* ── Empty state per tab ── */
function EmptyState({ tab }: { tab: Tab }) {
  const messages: Record<Tab, { title: string; sub: string }> = {
    online: { title: "No one is online", sub: "When friends come online they'll appear here." },
    all: { title: "No friends yet", sub: "You can add friends with their Discord username." },
    pending: { title: "No pending requests", sub: "You have no incoming or outgoing friend requests." },
    blocked: { title: "No blocked users", sub: "You haven't blocked anyone." },
    add: { title: "", sub: "" },
  };
  const m = messages[tab];
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center gap-2">
      <Users className="w-16 h-16 text-[#4e5058] mb-2" />
      <p className="text-[15px] font-semibold text-[#87898c]">{m.title}</p>
      <p className="text-[13px] text-[#5e6068]">{m.sub}</p>
    </div>
  );
}

/* ── Add Friend view ── */
function AddFriendView() {
  const [value, setValue] = useState("");
  return (
    <div className="max-w-[640px]">
      <h2 className="text-[18px] font-bold text-[#f2f3f5] mb-1">Add Friend</h2>
      <p className="text-[#87898c] text-[14px] mb-5">You can add friends with their Discord username.</p>
      <div
        className="flex items-center rounded-[8px] px-4 py-3 gap-3 transition-all duration-150 focus-within:ring-1 focus-within:ring-[#5865f2]/40"
        style={{ backgroundColor: "#1e1f22" }}
      >
        <input
          type="text"
          placeholder="You can add friends with their Discord username."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 bg-transparent text-[#dbdee1] placeholder:text-[#5e6068] text-[15px] outline-none"
        />
        <button
          className={cn(
            "px-4 py-1.5 rounded-[5px] text-[13px] font-semibold transition-all duration-150 shrink-0",
            value.length > 0
              ? "bg-[#5865f2] hover:bg-[#4752c4] text-white"
              : "bg-[#5865f2]/30 text-white/30 cursor-not-allowed"
          )}
          disabled={value.length === 0}
        >
          Send Friend Request
        </button>
      </div>
    </div>
  );
}
