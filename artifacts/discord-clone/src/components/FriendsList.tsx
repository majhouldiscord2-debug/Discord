import { useState } from "react";
import { Users, MessageCircle, MoreVertical, Search, Video, UserPlus } from "lucide-react";
import { allFriends, friendsOnline, pendingFriends } from "@/lib/mock-data";
import { Avatar } from "./Avatar";
import { cn } from "@/lib/utils";

type Tab = "online" | "all" | "pending" | "blocked" | "add";

const statusLabels: Record<string, string> = {
  online: "Online",
  idle: "Idle",
  dnd: "Do Not Disturb",
  offline: "Offline",
};

export function FriendsList() {
  const [activeTab, setActiveTab] = useState<Tab>("online");
  const [search, setSearch] = useState("");

  const rawFriends =
    activeTab === "online"
      ? friendsOnline
      : activeTab === "pending"
      ? pendingFriends
      : activeTab === "blocked"
      ? []
      : allFriends;

  const displayFriends = rawFriends.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount = pendingFriends.length;

  return (
    <div className="flex-1 h-full flex flex-col min-w-0" style={{ backgroundColor: "#313338" }}>
      {/* Top Header */}
      <div
        className="h-12 shrink-0 flex items-center px-4 gap-3 shadow-sm"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.3)" }}
      >
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#949ba4]" />
          <span className="text-[#f2f3f5] font-semibold text-[16px]">Friends</span>
        </div>

        <div className="w-px h-6 bg-white/10 mx-1" />

        <div className="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
          <TabBtn label="Online" isActive={activeTab === "online"} onClick={() => setActiveTab("online")} />
          <TabBtn label="All" isActive={activeTab === "all"} onClick={() => setActiveTab("all")} />
          <TabBtn
            label="Pending"
            isActive={activeTab === "pending"}
            onClick={() => setActiveTab("pending")}
            badge={pendingCount > 0 ? pendingCount : undefined}
          />
          <TabBtn label="Blocked" isActive={activeTab === "blocked"} onClick={() => setActiveTab("blocked")} />
          <button
            onClick={() => setActiveTab("add")}
            className={cn(
              "px-3 py-1 text-[14px] font-medium rounded-[4px] transition-colors whitespace-nowrap",
              activeTab === "add"
                ? "text-[#dbdee1] bg-[#404249]"
                : "bg-[#23a55a] text-white hover:bg-[#1f9350]"
            )}
          >
            Add Friend
          </button>
        </div>

        <div className="flex items-center gap-2 ml-2 shrink-0">
          <button className="text-[#b5bac1] hover:text-[#dbdee1] p-1 rounded transition-colors" title="New Group DM">
            <Video className="w-5 h-5" />
          </button>
          <div className="w-px h-5 bg-white/10" />
          <button className="text-[#b5bac1] hover:text-[#dbdee1] p-1 rounded transition-colors" title="Inbox">
            <MessageCircle className="w-5 h-5" />
          </button>
          <button className="text-[#b5bac1] hover:text-[#dbdee1] p-1 rounded transition-colors" title="Help">
            <span className="w-5 h-5 flex items-center justify-center text-[16px] font-bold">?</span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto discord-scrollbar px-4 pt-4">
        {activeTab === "add" ? (
          <AddFriendView />
        ) : (
          <>
            {/* Search */}
            <div className="relative mb-5">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-[#dbdee1] placeholder:text-[#87898c] text-[14px] py-[6px] pl-3 pr-9 rounded-[4px] outline-none"
                style={{ backgroundColor: "#1e1f22" }}
              />
              <Search className="absolute right-2.5 top-[7px] w-4 h-4 text-[#87898c]" />
            </div>

            {/* Section label */}
            <div className="text-xs font-semibold text-[#949ba4] uppercase tracking-wider mb-3">
              {activeTab === "online"
                ? `Online — ${displayFriends.length}`
                : activeTab === "pending"
                ? `Pending — ${displayFriends.length}`
                : activeTab === "blocked"
                ? `Blocked — ${displayFriends.length}`
                : `All Friends — ${displayFriends.length}`}
            </div>

            {/* Friend Rows */}
            <div>
              {displayFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between py-3 px-3 rounded-lg cursor-pointer group transition-colors hover:bg-[#3c3f45] border-t border-[#3c3f45]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar
                      initials={friend.initials}
                      color={friend.avatarColor}
                      status={friend.status}
                      size="md"
                      statusBg="#313338"
                      className="group-hover:[--status-bg:#3c3f45]"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[15px] font-semibold text-[#f2f3f5] leading-tight truncate">
                        {friend.name}
                      </span>
                      <span className="text-[13px] text-[#949ba4] leading-tight truncate">
                        {friend.statusText || statusLabels[friend.status]}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    {activeTab === "pending" ? (
                      <>
                        <ActionBtn title="Accept">
                          <UserPlus className="w-4 h-4" />
                        </ActionBtn>
                        <ActionBtn title="Ignore" danger>
                          <MoreVertical className="w-4 h-4" />
                        </ActionBtn>
                      </>
                    ) : (
                      <>
                        <ActionBtn title="Message">
                          <MessageCircle className="w-[18px] h-[18px]" />
                        </ActionBtn>
                        <ActionBtn title="More">
                          <MoreVertical className="w-[18px] h-[18px]" />
                        </ActionBtn>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {displayFriends.length === 0 && activeTab !== "add" && (
                <div className="flex flex-col items-center justify-center py-16 select-none">
                  <div className="w-[220px] h-[220px] mb-4 opacity-25 flex items-center justify-center">
                    <Users className="w-32 h-32 text-[#949ba4]" />
                  </div>
                  <p className="text-[#949ba4] font-medium text-[16px]">
                    {activeTab === "blocked"
                      ? "You can't unblock the block!"
                      : activeTab === "pending"
                      ? "There are no pending friend requests. Here's Wumpus for now."
                      : "Wumpus is waiting on friends. You don't have to though!"}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TabBtn({
  label,
  isActive,
  onClick,
  badge,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1 text-[15px] font-medium rounded-[4px] transition-colors relative whitespace-nowrap",
        isActive
          ? "bg-[#404249] text-[#f2f3f5]"
          : "text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]"
      )}
    >
      {label}
      {badge !== undefined && (
        <span className="ml-1.5 bg-[#ed4245] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full leading-none">
          {badge}
        </span>
      )}
    </button>
  );
}

function ActionBtn({
  children,
  title,
  danger,
}: {
  children: React.ReactNode;
  title: string;
  danger?: boolean;
}) {
  return (
    <button
      title={title}
      className={cn(
        "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
        danger
          ? "bg-[#1e1f22] text-[#ed4245] hover:text-white hover:bg-[#ed4245]"
          : "bg-[#1e1f22] text-[#b5bac1] hover:text-[#f2f3f5]"
      )}
    >
      {children}
    </button>
  );
}

function AddFriendView() {
  const [value, setValue] = useState("");
  return (
    <div className="max-w-[680px]">
      <h2 className="text-[20px] font-semibold text-[#f2f3f5] mb-2">Add Friend</h2>
      <p className="text-[#949ba4] text-[14px] mb-4">
        You can add friends with their Discord username.
      </p>
      <div
        className="flex items-center rounded-lg px-4 py-3 gap-3"
        style={{ backgroundColor: "#1e1f22" }}
      >
        <input
          type="text"
          placeholder="You can add friends with their Discord username."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 bg-transparent text-[#dbdee1] placeholder:text-[#87898c] text-[16px] outline-none"
        />
        <button
          className={cn(
            "px-4 py-1.5 rounded-[4px] text-[14px] font-medium transition-colors",
            value.length > 0
              ? "bg-[#5865f2] hover:bg-[#4752c4] text-white"
              : "bg-[#5865f2]/40 text-white/40 cursor-not-allowed"
          )}
          disabled={value.length === 0}
        >
          Send Friend Request
        </button>
      </div>
    </div>
  );
}
