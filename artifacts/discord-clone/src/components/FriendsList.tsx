import { useState } from "react";
import { Users, MessageCircle, MoreVertical, Search, Video, UserPlus } from "lucide-react";
import { useDiscord } from "@/hooks/useDiscord";
import { avatarUrl } from "@/lib/api";
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
  const { relationships } = useDiscord();
  const [activeTab, setActiveTab] = useState<Tab>("online");
  const [search, setSearch] = useState("");

  const friends = relationships.filter((r) => r.type === 1);
  const pending = relationships.filter((r) => r.type === 3 || r.type === 4);
  const blocked = relationships.filter((r) => r.type === 2);

  const rawRels =
    activeTab === "online" || activeTab === "all"
      ? friends
      : activeTab === "pending"
      ? pending
      : activeTab === "blocked"
      ? blocked
      : [];

  const displayRels = rawRels.filter((r) =>
    (r.user.global_name ?? r.user.username).toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount = pending.length;

  return (
    <div className="flex-1 h-full flex flex-col min-w-0" style={{ backgroundColor: "#0a1220" }}>
      {/* Top Header */}
      <div
        className="h-12 shrink-0 flex items-center px-4 gap-3"
        style={{
          borderBottom: "1px solid rgba(0,0,0,0.4)",
          background: "linear-gradient(180deg, #0c1530 0%, #0a1220 100%)",
        }}
      >
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#7d8188]" />
          <span className="text-[#f2f3f5] font-semibold text-[15px] tracking-[-0.01em]">Stats</span>
        </div>

        <div className="w-px h-5 bg-white/10 mx-1" />

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
              "px-3 py-1 text-[13px] font-semibold rounded-[5px] transition-all duration-150 whitespace-nowrap",
              activeTab === "add"
                ? "text-[#dbdee1] bg-[#404249]"
                : "bg-[#23a55a] text-white hover:bg-[#1f9350] hover:shadow-[0_2px_12px_rgba(35,165,90,0.35)]"
            )}
          >
            Add Friend
          </button>
        </div>

        <div className="flex items-center gap-2 ml-2 shrink-0">
          <button className="text-[#87898c] hover:text-[#dbdee1] p-1.5 rounded-[6px] transition-colors hover:bg-white/8" title="New Group DM">
            <Video className="w-[18px] h-[18px]" />
          </button>
          <div className="w-px h-5 bg-white/10" />
          <button className="text-[#87898c] hover:text-[#dbdee1] p-1.5 rounded-[6px] transition-colors hover:bg-white/8" title="Inbox">
            <MessageCircle className="w-[18px] h-[18px]" />
          </button>
          <button className="text-[#87898c] hover:text-[#dbdee1] p-1.5 rounded-[6px] transition-colors hover:bg-white/8" title="Help">
            <span className="w-[18px] h-[18px] flex items-center justify-center text-[15px] font-bold">?</span>
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
                className="w-full text-[#dbdee1] placeholder:text-[#5e6068] text-[14px] py-[7px] pl-3 pr-9 rounded-[6px] outline-none transition-all duration-150 focus:ring-1 focus:ring-white/10"
                style={{ backgroundColor: "#060b14" }}
              />
              <Search className="absolute right-3 top-[8px] w-[15px] h-[15px] text-[#5e6068]" />
            </div>

            {/* Section label */}
            <div className="text-[10px] font-bold text-[#6d6f76] uppercase tracking-widest mb-3">
              {activeTab === "online"
                ? `Friends — ${displayRels.length}`
                : activeTab === "pending"
                ? `Pending — ${displayRels.length}`
                : activeTab === "blocked"
                ? `Blocked — ${displayRels.length}`
                : `All Friends — ${displayRels.length}`}
            </div>

            {/* Friend Rows */}
            <div className="space-y-[1px]">
              {displayRels.map((rel, i) => {
                const u = rel.user;
                const name = rel.nickname ?? u.global_name ?? u.username;
                const src = avatarUrl(u);
                const initials = name[0]?.toUpperCase() ?? "?";
                const isPending = rel.type === 3 || rel.type === 4;
                const typeLabel = rel.type === 3 ? "Incoming request" : rel.type === 4 ? "Outgoing request" : rel.type === 2 ? "Blocked" : u.username;
                return (
                  <div
                    key={rel.id}
                    className="flex items-center justify-between py-[10px] px-3 rounded-[8px] cursor-pointer group transition-all duration-150 hover:bg-[#0d1a2e] border-t border-[rgba(255,255,255,0.04)] first:border-t-0 animate-fade-slide-up"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar
                        initials={initials}
                        src={src}
                        color="#5865f2"
                        size="md"
                        statusBg="#0a1220"
                        className="transition-transform duration-150 group-hover:scale-105"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[14px] font-semibold text-[#f2f3f5] leading-tight truncate tracking-[-0.01em]">
                          {name}
                        </span>
                        <span className="text-[12px] text-[#7d8188] leading-tight truncate mt-[1px]">
                          {typeLabel}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-150 shrink-0">
                      {isPending ? (
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
                            <MessageCircle className="w-[17px] h-[17px]" />
                          </ActionBtn>
                          <ActionBtn title="More">
                            <MoreVertical className="w-[17px] h-[17px]" />
                          </ActionBtn>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

              {displayRels.length === 0 && (activeTab as string) !== "add" && (
                <div className="flex flex-col items-center justify-center py-20 select-none animate-fade-slide-up">
                  <div className="w-[180px] h-[180px] mb-5 flex items-center justify-center rounded-full" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <Users className="w-24 h-24 text-[#3e4147]" />
                  </div>
                  <p className="text-[#5e6068] font-medium text-[15px] max-w-[280px] text-center leading-relaxed">
                    {activeTab === "blocked"
                      ? "You haven't blocked anyone."
                      : activeTab === "pending"
                      ? "No pending friend requests."
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
        "px-3 py-1 text-[13px] font-medium rounded-[5px] transition-all duration-150 relative whitespace-nowrap",
        isActive
          ? "bg-[#404249] text-[#f2f3f5]"
          : "text-[#87898c] hover:bg-[#0d1a2e] hover:text-[#dbdee1]"
      )}
    >
      {label}
      {badge !== undefined && (
        <span className="ml-1.5 bg-[#ed4245] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
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
        "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150",
        danger
          ? "bg-[#060b14] text-[#ed4245] hover:text-white hover:bg-[#ed4245] hover:shadow-[0_2px_8px_rgba(237,66,69,0.4)]"
          : "bg-[#060b14] text-[#87898c] hover:text-[#f2f3f5] hover:bg-[#0d1a2e]"
      )}
    >
      {children}
    </button>
  );
}

function AddFriendView() {
  const [value, setValue] = useState("");
  return (
    <div className="max-w-[640px] animate-fade-slide-up">
      <h2 className="text-[18px] font-bold text-[#f2f3f5] mb-1 tracking-[-0.02em]">Add Friend</h2>
      <p className="text-[#87898c] text-[14px] mb-5">
        You can add friends with their Discord username.
      </p>
      <div
        className="flex items-center rounded-[8px] px-4 py-3 gap-3 transition-all duration-150 focus-within:ring-1 focus-within:ring-[#5865f2]/40"
        style={{ backgroundColor: "#060b14" }}
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
            "px-4 py-1.5 rounded-[5px] text-[13px] font-semibold transition-all duration-150",
            value.length > 0
              ? "bg-[#5865f2] hover:bg-[#4752c4] text-white hover:shadow-[0_2px_12px_rgba(88,101,242,0.4)]"
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
