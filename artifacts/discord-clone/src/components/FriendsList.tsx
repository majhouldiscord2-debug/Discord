import { useState } from "react";
import { Users, MessageCircle, MoreVertical, Search, Inbox, HelpCircle } from "lucide-react";
import { allFriends, friendsOnline } from "@/lib/mock-data";
import { Avatar } from "./Avatar";

type Tab = "online" | "all" | "pending" | "blocked" | "add";

export function FriendsList() {
  const [activeTab, setActiveTab] = useState<Tab>("online");

  const displayFriends = activeTab === "online" ? friendsOnline : allFriends;

  return (
    <div className="flex-1 h-full bg-background flex flex-col min-w-0">
      {/* Top Header */}
      <div className="h-12 border-b border-sidebar-dark flex items-center justify-between px-4 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-foreground font-semibold px-2">
            <Users className="w-6 h-6 text-muted" />
            <span>Friends</span>
          </div>
          
          <div className="w-[1px] h-6 bg-white/10" />
          
          <div className="flex items-center gap-1 sm:gap-2">
            <TabButton label="Online" isActive={activeTab === "online"} onClick={() => setActiveTab("online")} />
            <TabButton label="All" isActive={activeTab === "all"} onClick={() => setActiveTab("all")} />
            <TabButton label="Pending" isActive={activeTab === "pending"} onClick={() => setActiveTab("pending")} />
            <TabButton label="Blocked" isActive={activeTab === "blocked"} onClick={() => setActiveTab("blocked")} />
            <button 
              onClick={() => setActiveTab("add")}
              className={`px-2 py-1 text-sm font-medium rounded-md transition-colors ${
                activeTab === "add" 
                  ? "text-success bg-[#1a4a31]" 
                  : "bg-success text-white hover:bg-[#1a8b48]"
              }`}
            >
              Add Friend
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="text-muted hover:text-foreground transition-colors p-1" title="New Group DM">
            <MessageCircle className="w-5 h-5" />
          </button>
          <div className="w-[1px] h-6 bg-white/10 mx-1" />
          <button className="text-muted hover:text-foreground transition-colors p-1" title="Inbox">
            <Inbox className="w-5 h-5" />
          </button>
          <button className="text-muted hover:text-foreground transition-colors p-1" title="Help">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 lg:p-7">
        {/* Search */}
        <div className="relative mb-6">
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-sidebar text-foreground placeholder:text-muted rounded-[4px] py-2 pl-3 pr-10 outline-none focus:ring-1 focus:ring-primary transition-all shadow-sm"
          />
          <Search className="absolute right-3 top-2.5 w-5 h-5 text-muted" />
        </div>

        {/* List Header */}
        <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-4 border-b border-white/5 pb-4">
          {activeTab === "online" ? `ONLINE — ${friendsOnline.length}` : `ALL FRIENDS — ${allFriends.length}`}
        </div>

        {/* Friend Items */}
        <div className="space-y-1">
          {displayFriends.map((friend) => (
            <div 
              key={friend.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/40 group transition-colors border-t border-transparent hover:border-white/5 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Avatar 
                  initials={friend.initials} 
                  colorClass={friend.avatarColor}
                  status={friend.status}
                  statusBgClass="border-background group-hover:border-[#393b40] transition-colors"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground text-[15px] leading-snug flex items-center gap-2">
                    {friend.name}
                    <span className="hidden group-hover:inline text-xs text-muted font-normal">#{1000 + Number(friend.id)}</span>
                  </span>
                  <span className="text-[13px] text-muted leading-snug">
                    {friend.statusText || (friend.status === "online" ? "Online" : "Offline")}
                  </span>
                </div>
              </div>

              {/* Action Buttons (Visible on Hover) */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-9 h-9 rounded-full bg-sidebar flex items-center justify-center text-muted hover:text-foreground transition-colors shadow-sm">
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button className="w-9 h-9 rounded-full bg-sidebar flex items-center justify-center text-muted hover:text-foreground transition-colors shadow-sm">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          
          {displayFriends.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-muted">
              <div className="w-48 h-48 bg-sidebar rounded-full mb-6 opacity-50 flex items-center justify-center">
                <Users className="w-20 h-20" />
              </div>
              <p className="text-base font-medium">No friends to show here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`px-3 py-1 text-[15px] font-medium rounded-md transition-colors ${
        isActive 
          ? "bg-accent/80 text-foreground" 
          : "text-muted hover:bg-accent/40 hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
