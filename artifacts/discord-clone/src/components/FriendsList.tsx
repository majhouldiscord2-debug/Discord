import { useState } from "react";
import { Users, MessageCircle, MoreVertical, Search, UserPlus } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Avatar } from "./Avatar";
import { InProgress } from "./InProgress";
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

  return (
    <div className="flex-1 h-full flex flex-col min-w-0" style={{ backgroundColor: "#000000" }}>
      {/* Top header bar */}
      <div
        className="h-12 shrink-0 flex items-center px-4 gap-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", backgroundColor: "#000000" }}
      >
        {/* Friends icon + label */}
        <div className="flex items-center gap-2 shrink-0">
          <Users className="w-5 h-5 text-[#7d8188]" />
          <span className="text-[#f2f3f5] font-semibold text-[15px]">Friends</span>
        </div>

        {/* Dot separator */}
        <span className="mx-3 text-[#6d6f76] font-bold text-[16px] select-none shrink-0">·</span>

        {/* Tabs */}
        <div className="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
          {(["online", "all", "pending", "blocked"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className="relative px-3 py-1.5 text-[14px] font-medium transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 rounded-[5px]"
              style={{
                backgroundColor: activeTab === t ? "#35373c" : "transparent",
                color: activeTab === t ? "#f2f3f5" : "#87898c",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== t) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#2e3035";
                  (e.currentTarget as HTMLButtonElement).style.color = "#dbdee1";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== t) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#87898c";
                }
              }}
            >
              {t === "online" ? "Online" : t === "all" ? "All" : t === "pending" ? "Pending" : "Blocked"}
              {t === "pending" && pendingFriends.length > 0 && (
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full leading-none" style={{ backgroundColor: "#ed4245", color: "white" }}>
                  {pendingFriends.length}
                </span>
              )}
            </button>
          ))}

          {/* Add Friend button */}
          <button
            onClick={() => setActiveTab("add")}
            className="ml-1 px-3 py-1.5 text-[13px] font-semibold rounded-[6px] transition-all duration-150 whitespace-nowrap bg-[#222222] text-[#dbdee1] hover:bg-[#2e2e2e]"
          >
            Add Friend
          </button>
        </div>

      </div>

      <div className="flex-1 overflow-y-auto discord-scrollbar flex flex-col items-center justify-center" style={{ backgroundColor: "#000000" }}>
        <InProgress
          size="lg"
          label="Friends List"
          description="Your friends list is being built. Check back soon!"
        />
      </div>
    </div>
  );
}

function TabBtn({ label, isActive, onClick, badge }: { label: string; isActive: boolean; onClick: () => void; badge?: number }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1 text-[13px] font-medium rounded-[5px] transition-all duration-150 relative whitespace-nowrap",
        isActive ? "bg-[#1a1a1a] text-[#f2f3f5]" : "text-[#87898c] hover:bg-[#111111] hover:text-[#dbdee1]"
      )}
    >
      {label}
      {badge !== undefined && (
        <span className="ml-1.5 bg-[#ed4245] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">{badge}</span>
      )}
    </button>
  );
}

function ActionBtn({ children, title, danger }: { children: React.ReactNode; title: string; danger?: boolean }) {
  return (
    <button
      title={title}
      className={cn(
        "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150",
        danger
          ? "bg-[#111111] text-[#ed4245] hover:text-white hover:bg-[#ed4245] hover:shadow-[0_2px_8px_rgba(237,66,69,0.4)]"
          : "bg-[#111111] text-[#87898c] hover:text-[#f2f3f5] hover:bg-[#1c1c1c]"
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
      <p className="text-[#87898c] text-[14px] mb-5">You can add friends with their Discord username.</p>
      <div
        className="flex items-center rounded-[8px] px-4 py-3 gap-3 transition-all duration-150 focus-within:ring-1 focus-within:ring-white/10"
        style={{ backgroundColor: "#0d0d0d" }}
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
              ? "bg-[#222222] hover:bg-[#2e2e2e] text-white"
              : "bg-[#1a1a1a] text-white/30 cursor-not-allowed"
          )}
          disabled={value.length === 0}
        >
          Send Friend Request
        </button>
      </div>
    </div>
  );
}
