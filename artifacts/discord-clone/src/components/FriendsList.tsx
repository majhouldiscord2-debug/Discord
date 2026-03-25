import { useState } from "react";
import { Users, MessageCircle, MoreVertical, Search, Video, UserPlus, Inbox } from "lucide-react";
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
    <div className="flex-1 h-full flex flex-col min-w-0" style={{ backgroundColor: "#313338" }}>
      <div
        className="h-12 shrink-0 flex items-center px-4 gap-3"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.3)", backgroundColor: "#313338" }}
      >
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#7d8188]" />
          <span className="text-[#f2f3f5] font-semibold text-[15px] tracking-[-0.01em]">Friends</span>
        </div>
        <div className="w-px h-5 bg-white/10 mx-1" />
        <div className="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
          <TabBtn label="Online" isActive={activeTab === "online"} onClick={() => setActiveTab("online")} />
          <TabBtn label="All" isActive={activeTab === "all"} onClick={() => setActiveTab("all")} />
          <TabBtn label="Pending" isActive={activeTab === "pending"} onClick={() => setActiveTab("pending")} badge={pendingFriends.length || undefined} />
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
        <div className="flex items-center gap-1 ml-2 shrink-0">
          <button className="text-[#87898c] hover:text-[#dbdee1] p-1.5 rounded-[6px] transition-colors hover:bg-white/8" title="New Group DM">
            <Video className="w-[18px] h-[18px]" />
          </button>
          <div className="w-px h-5 bg-white/10 mx-1" />
          <button className="text-[#87898c] hover:text-[#dbdee1] p-1.5 rounded-[6px] transition-colors hover:bg-white/8" title="Inbox">
            <Inbox className="w-[18px] h-[18px]" />
          </button>
          <button className="text-[#87898c] hover:text-[#dbdee1] p-1.5 rounded-[6px] transition-colors hover:bg-white/8" title="Help">
            <span className="w-[18px] h-[18px] flex items-center justify-center text-[15px] font-bold leading-none">?</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto discord-scrollbar flex flex-col items-center justify-center" style={{ backgroundColor: "#313338" }}>
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
        isActive ? "bg-[#404249] text-[#f2f3f5]" : "text-[#87898c] hover:bg-[#35373c] hover:text-[#dbdee1]"
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
      <p className="text-[#87898c] text-[14px] mb-5">You can add friends with their Discord username.</p>
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
