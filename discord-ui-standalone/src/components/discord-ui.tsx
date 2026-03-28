import React, { useState } from "react";
import { Users, ShoppingBag, Zap, Target, MailCheck, Plus, Mic, MicOff, Headphones, Settings, Search, MessageCircle, MoreVertical, Video, UserPlus, Compass, Download } from "lucide-react";
import { cn, dmContacts, currentUser, allFriends, friendsOnline, pendingFriends, servers, type Status } from "@/core";

// --- Avatar ---
export interface AvatarProps {
  initials: string; colorClass?: string; color?: string; status?: Status;
  size?: "xs" | "sm" | "md" | "lg"; className?: string; statusBg?: string; statusBgClass?: string;
}
const sizeMap = {
  xs: { avatar: "w-6 h-6 text-[10px]", dot: "w-3 h-3 border-[2px]", offset: "bottom-[-3px] right-[-3px]" },
  sm: { avatar: "w-8 h-8 text-xs", dot: "w-[14px] h-[14px] border-[2px]", offset: "bottom-[-2px] right-[-2px]" },
  md: { avatar: "w-10 h-10 text-sm", dot: "w-[16px] h-[16px] border-[3px]", offset: "bottom-[-3px] right-[-3px]" },
  lg: { avatar: "w-12 h-12 text-base", dot: "w-5 h-5 border-[3px]", offset: "bottom-[-3px] right-[-3px]" },
};
const statusBgColors = { online: "#23a55a", idle: "#f0b232", dnd: "#f23f43", offline: "#80848e" };
export function Avatar({ initials, colorClass, color, status, size = "md", className, statusBg = "#2b2d31", statusBgClass }: AvatarProps) {
  const s = sizeMap[size];
  return (
    <div className={cn("relative inline-flex items-center justify-center shrink-0", className)}>
      <div className={cn(s.avatar, "rounded-full flex items-center justify-center font-semibold text-white select-none", colorClass)} style={color ? { backgroundColor: color } : undefined}>{initials}</div>
      {status && (
        <div className={cn(s.dot, "absolute rounded-full flex items-center justify-center", s.offset, statusBgClass)} style={{ backgroundColor: statusBgColors[status], borderColor: statusBgClass ? undefined : statusBg }}>
          {status === "dnd" && <div className="w-[55%] h-[2px] bg-white rounded-full" />}
          {status === "idle" && <div className="absolute rounded-full" style={{ width: "70%", height: "70%", top: "-15%", left: "-15%", backgroundColor: statusBg }} />}
          {status === "offline" && <div className="w-[40%] h-[40%] rounded-full bg-white opacity-90" />}
        </div>
      )}
    </div>
  );
}

// --- Sidebar ---
export function Sidebar({ activeView = "friends", onNavigate }: { activeView?: string; onNavigate?: (v: string) => void }) {
  const [micMuted, setMicMuted] = useState(false);
  const [deafened, setDeafened] = useState(false);
  const [activeDm, setActiveDm] = useState<number | null>(null);
  const handleNav = (k: string) => { setActiveDm(null); onNavigate?.(k); };
  const handleDm = (id: number) => { setActiveDm(id); onNavigate?.("dm"); };
  return (
    <div className="w-[240px] h-full flex flex-col shrink-0 bg-[#2b2d31]">
      <button className="h-12 shrink-0 flex items-center px-3 border-b border-black/25 hover:bg-white/5 transition-colors"><span className="flex-1 text-left text-[14px] font-medium text-[#949ba4] truncate">Find or start a conversation</span><Search className="w-4 h-4 text-[#949ba4]" /></button>
      <div className="flex-1 overflow-y-auto discord-scrollbar pt-2 px-2">
        <div className="space-y-[2px] mb-1">
          <NavItem icon={<Users className="w-5 h-5" />} label="Friends" isActive={activeView === "friends"} onClick={() => handleNav("friends")} />
          <NavItem icon={<Zap className="w-5 h-5" />} label="Nitro" isActive={activeView === "nitro"} onClick={() => handleNav("nitro")} badge={<span className="ml-auto bg-[#5865f2] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>} />
        </div>
        <div className="mt-4 mb-1 px-2 flex items-center justify-between group cursor-pointer"><span className="text-[11px] font-semibold text-[#949ba4] uppercase tracking-wider">Direct Messages</span><Plus className="w-4 h-4 text-[#949ba4] opacity-0 group-hover:opacity-100" /></div>
        <div className="space-y-[2px] pb-2">
          {dmContacts.map((c) => (
            <button key={c.id} onClick={() => handleDm(c.id as number)} className={cn("w-full flex items-center gap-3 px-2 py-[6px] rounded-[4px] transition-colors group", activeDm === c.id ? "bg-[#404249] text-[#f2f3f5]" : "text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]")}>
              <Avatar initials={c.initials} color={c.avatarColor} status={c.status} size="sm" statusBg="#2b2d31" />
              <span className="truncate text-[15px] font-medium">{c.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="h-[52px] shrink-0 flex items-center px-2 gap-1 bg-[#232428]">
        <button className="flex items-center flex-1 hover:bg-white/10 p-1 rounded-[4px] min-w-0 mr-1">
          <Avatar initials={currentUser.initials} color={currentUser.avatarColor} status={currentUser.status} size="sm" statusBg="#232428" className="mr-2" />
          <div className="flex flex-col text-left min-w-0"><span className="text-[13px] font-semibold text-[#f2f3f5] truncate">{currentUser.name}</span><span className="text-[11px] text-[#949ba4] truncate">{currentUser.statusText}</span></div>
        </button>
        <div className="flex items-center gap-0.5 shrink-0">
          <IconBtn title={micMuted ? "Unmute" : "Mute"} onClick={() => setMicMuted(!micMuted)} danger={micMuted}>{micMuted ? <MicOff className="w-[18px] h-[18px]" /> : <Mic className="w-[18px] h-[18px]" />}</IconBtn>
          <IconBtn title="User Settings" onClick={() => {}}><Settings className="w-[18px] h-[18px]" /></IconBtn>
        </div>
      </div>
    </div>
  );
}
function NavItem({ icon, label, isActive, onClick, badge }: { icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; badge?: React.ReactNode }) {
  return <button onClick={onClick} className={cn("w-full flex items-center px-2 py-[7px] rounded-[4px] transition-colors gap-3", isActive ? "bg-[#404249] text-[#f2f3f5]" : "text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]")}><span className="shrink-0">{icon}</span><span className="font-medium text-[16px] flex-1 text-left">{label}</span>{badge}</button>;
}
function IconBtn({ children, title, onClick, danger }: { children: React.ReactNode; title: string; onClick: () => void; danger?: boolean }) {
  return <button title={title} onClick={onClick} className={cn("w-8 h-8 rounded-[4px] flex items-center justify-center transition-colors", danger ? "text-[#f23f43] hover:bg-white/10" : "text-[#b5bac1] hover:bg-white/10 hover:text-[#dbdee1]")}>{children}</button>;
}

// --- ServerList ---
export function ServerList({ activeServer = "dms", onServerSelect }: { activeServer?: number | "dms"; onServerSelect?: (id: number | "dms") => void }) {
  return (
    <div className="w-[72px] h-full bg-[#1e1f22] flex flex-col items-center py-3 gap-2 overflow-y-auto no-scrollbar shrink-0">
      <ServerButton name="Direct Messages" isActive={activeServer === "dms"} onClick={() => onServerSelect?.("dms")}><div className={cn("w-12 h-12 flex items-center justify-center transition-all duration-200", activeServer === "dms" ? "rounded-[16px] bg-[#5865f2]" : "rounded-[24px] bg-[#313338] hover:rounded-[16px] hover:bg-[#5865f2]")}><DiscordLogo /></div></ServerButton>
      <div className="w-8 h-[2px] bg-[#35363c] rounded-full shrink-0" />
      {servers.map((s) => (
        <ServerButton key={s.id} name={s.name} isActive={activeServer === s.id} hasNotification={s.hasNotification} notificationCount={s.notificationCount} onClick={() => onServerSelect?.(s.id)}>
          <div className={cn("w-12 h-12 flex items-center justify-center transition-all duration-200 text-[18px]", activeServer === s.id ? "rounded-[16px]" : "rounded-[24px] hover:rounded-[16px]")} style={{ backgroundColor: s.color }}>{s.iconUrl ? <img src={s.iconUrl} alt={s.name} className="w-full h-full object-cover rounded-[inherit]" /> : s.initials}</div>
        </ServerButton>
      ))}
    </div>
  );
}
function ServerButton({ name, children, isActive, notificationCount, onClick }: any) {
  const [h, setH] = useState(false);
  return (
    <div className="relative group flex items-center justify-center w-full" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      <div className={cn("absolute left-0 bg-white rounded-r-full transition-all duration-200", isActive ? "w-1 h-10" : h ? "w-1 h-5" : "w-0 h-0")} />
      {notificationCount && <div className="absolute bottom-0 right-1 min-w-[18px] h-[18px] bg-[#ed4245] rounded-full flex items-center justify-center z-20 px-1 text-[10px] text-white font-bold">{notificationCount}</div>}
      <button onClick={onClick} className={cn("w-12 h-12 flex items-center justify-center text-white font-bold text-[18px] transition-all duration-200 overflow-hidden", isActive ? "rounded-[16px]" : "rounded-[24px] hover:rounded-[16px]")}>{children}</button>
      {h && <div className="absolute left-[68px] z-50 pointer-events-none bg-[#111214] text-white text-sm font-semibold px-3 py-2 rounded-md shadow-xl whitespace-nowrap">{name}<div className="absolute left-[-6px] top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#111214]" /></div>}
    </div>
  );
}
function DiscordLogo() { return <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>; }

// --- FriendsList ---
export function FriendsList() {
  const [activeTab, setActiveTab] = useState("online");
  const [search, setSearch] = useState("");
  const raw = activeTab === "online" ? friendsOnline : activeTab === "pending" ? pendingFriends : allFriends;
  const filtered = raw.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="flex-1 h-full flex flex-col bg-[#313338]">
      <div className="h-12 flex items-center px-4 gap-3 border-b border-black/25 shadow-sm">
        <div className="flex items-center gap-2"><Users className="w-5 h-5 text-[#949ba4]" /><span className="text-[#f2f3f5] font-semibold text-[16px]">Friends</span></div>
        <div className="w-px h-6 bg-white/10 mx-1" />
        <div className="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
          <TabBtn label="Online" isActive={activeTab === "online"} onClick={() => setActiveTab("online")} />
          <TabBtn label="All" isActive={activeTab === "all"} onClick={() => setActiveTab("all")} />
          <TabBtn label="Pending" isActive={activeTab === "pending"} onClick={() => setActiveTab("pending")} badge={pendingFriends.length} />
          <button onClick={() => setActiveTab("add")} className={cn("px-3 py-1 text-[14px] font-medium rounded-[4px] transition-colors", activeTab === "add" ? "text-[#dbdee1] bg-[#404249]" : "bg-[#23a55a] text-white")}>Add Friend</button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto discord-scrollbar px-4 pt-4">
        <div className="relative mb-5"><input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-[#1e1f22] text-[#dbdee1] text-[14px] py-[6px] pl-3 pr-9 rounded-[4px] outline-none" /><Search className="absolute right-2.5 top-[7px] w-4 h-4 text-[#87898c]" /></div>
        <div className="text-xs font-semibold text-[#949ba4] uppercase tracking-wider mb-3">{activeTab} — {filtered.length}</div>
        {filtered.map((f) => (
          <div key={f.id} className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-[#3c3f45] transition-colors group border-t border-[#3c3f45]">
            <div className="flex items-center gap-3"><Avatar initials={f.initials} color={f.avatarColor} status={f.status} size="md" statusBg="#313338" /><div className="flex flex-col"><span className="text-[15px] font-semibold text-[#f2f3f5]">{f.name}</span><span className="text-[13px] text-[#949ba4]">{f.status}</span></div></div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><IconBtn title="Message" onClick={() => {}}><MessageCircle className="w-5 h-5" /></IconBtn><IconBtn title="More" onClick={() => {}}><MoreVertical className="w-5 h-5" /></IconBtn></div>
          </div>
        ))}
      </div>
    </div>
  );
}
function TabBtn({ label, isActive, onClick, badge }: any) {
  return <button onClick={onClick} className={cn("px-3 py-1 text-[15px] font-medium rounded-[4px] transition-colors", isActive ? "bg-[#404249] text-[#f2f3f5]" : "text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]")}>{label}{badge > 0 && <span className="ml-1.5 bg-[#ed4245] text-white text-[11px] px-1.5 py-0.5 rounded-full">{badge}</span>}</button>;
}

// --- ActiveNow ---
export function ActiveNow() {
  return (
    <div className="w-[340px] h-full hidden lg:flex flex-col shrink-0 p-4 bg-[#2b2d31] border-l border-black/25">
      <h2 className="font-semibold text-[#f2f3f5] text-[16px] mb-4">Active Now</h2>
      <div className="flex flex-col items-center justify-center text-center mt-12 px-4 gap-3">
        <p className="text-[16px] font-semibold text-[#f2f3f5]">It's quiet for now...</p>
        <p className="text-[14px] text-[#949ba4] leading-relaxed">When a friend starts an activity—like playing a game or hanging out on voice—we'll show it here!</p>
      </div>
    </div>
  );
}
