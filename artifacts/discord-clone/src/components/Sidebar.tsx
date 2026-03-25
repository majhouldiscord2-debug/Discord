import { useState } from "react";
import { Users, ShoppingBag, Zap, Target, MailCheck, Plus, Mic, MicOff, Headphones, Settings, Search, Sparkles, BarChart2, Wrench, Server, ScrollText } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Avatar } from "./Avatar";
import { InProgressClock } from "./InProgress";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeView?: string;
  onNavigate?: (view: string) => void;
  onOpenDm?: (dmId: string) => void;
  activeDmId?: string | null;
  onOpenSettings?: () => void;
  isBotMode?: boolean;
}

export function Sidebar({ activeView = "friends", onNavigate, onOpenDm, activeDmId, onOpenSettings, isBotMode = false }: SidebarProps) {
  const currentUserId = useAppStore((s) => s.currentUserId);
  const users = useAppStore((s) => s.users);
  const dmChannels = useAppStore((s) => s.dmChannels);
  const currentUser = users[currentUserId];
  const [micMuted, setMicMuted] = useState(false);
  const [deafened, setDeafened] = useState(false);

  const activeItem = activeView === "dm" ? "" : activeView;

  return (
    <div
      className="w-[240px] h-full flex flex-col shrink-0"
      style={{ backgroundColor: "#000000" }}
    >
      <button
        className="h-12 shrink-0 flex items-center px-3 gap-2 transition-colors hover:bg-white/5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span className="flex-1 text-left text-[13px] font-medium text-[#87898c] hover:text-[#dbdee1] transition-colors truncate">
          Find or start a conversation
        </span>
        <Search className="w-4 h-4 text-[#5e6068] shrink-0" />
      </button>

      <div className="flex-1 overflow-y-auto discord-scrollbar pt-2 px-2">
        <div className="space-y-[2px] mb-1">
          {isBotMode ? (
            <>
              <NavItem icon={<BarChart2 className="w-[18px] h-[18px]" />} label="Overview" isActive={activeItem === "friends"} onClick={() => onNavigate?.("friends")} />
              <NavItem icon={<Zap className="w-[18px] h-[18px]" />} label="Bot Skills" isActive={activeItem === "skills"} onClick={() => onNavigate?.("skills")} />
              <NavItem icon={<ScrollText className="w-[18px] h-[18px]" />} label="Audit Logs" isActive={activeItem === "logs"} onClick={() => onNavigate?.("logs")} />
              <NavItem icon={<Wrench className="w-[18px] h-[18px]" />} label="Configuration" isActive={activeItem === "tools"} onClick={() => onNavigate?.("tools")} />
              <NavItem icon={<Server className="w-[18px] h-[18px]" />} label="Servers" isActive={activeItem === "servers"} onClick={() => onNavigate?.("servers")} />
            </>
          ) : (
            <>
              <NavItem icon={<Users className="w-[18px] h-[18px]" />} label="Friends" isActive={activeItem === "friends"} onClick={() => onNavigate?.("friends")} />
              <NavItem icon={<MailCheck className="w-[18px] h-[18px]" />} label="Message Requests" isActive={activeItem === "requests"} onClick={() => onNavigate?.("requests")} />
              <NavItem icon={<Sparkles className="w-[18px] h-[18px]" />} label="Nitro Home" isActive={activeItem === "nitro"} onClick={() => onNavigate?.("nitro")} />
              <NavItem icon={<ShoppingBag className="w-[18px] h-[18px]" />} label="Shop" isActive={activeItem === "shop"} onClick={() => onNavigate?.("shop")} />
              <NavItem icon={<Target className="w-[18px] h-[18px]" />} label="Quests" isActive={activeItem === "quests"} onClick={() => onNavigate?.("quests")} />
            </>
          )}
        </div>

        <div className="mt-4 mb-1 px-2 flex items-center justify-between group cursor-pointer">
          <span className="text-[10px] font-bold text-[#6d6f76] group-hover:text-[#c0c3c9] uppercase tracking-widest transition-colors select-none">
            Direct Messages
          </span>
          {!isBotMode && (
            <button className="opacity-0 group-hover:opacity-100 text-[#6d6f76] hover:text-[#dbdee1] transition-all p-0.5 rounded">
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {isBotMode ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 gap-2">
            <p className="text-[12px] text-[#4e5058] text-center">DMs are unavailable in bot management mode</p>
          </div>
        ) : (
          <div className="pb-2 space-y-[2px]">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-2 py-[6px] rounded-[6px]" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="w-8 h-8 rounded-full shrink-0 skeleton-shimmer" />
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <div className="h-2.5 rounded-full skeleton-shimmer" style={{ width: `${58 + (i * 13) % 37}%`, animationDelay: `${i * 120}ms` }} />
                  <div className="h-2 rounded-full skeleton-shimmer" style={{ width: `${38 + (i * 9) % 28}%`, animationDelay: `${i * 80 + 200}ms` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        className="h-[52px] shrink-0 flex items-center px-2 gap-1"
        style={{ backgroundColor: "#000000", borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {!isBotMode ? (
          <>
            <div className="flex items-center flex-1 gap-2 p-1 min-w-0 mr-1">
              <div className="shrink-0"><InProgressClock size={32} /></div>
              <div className="flex flex-col text-left min-w-0">
                <span className="text-[13px] font-semibold text-[#f2f3f5] leading-tight truncate">User Info</span>
                <span className="text-[11px] text-[#6d6f76] leading-tight truncate">In Progress</span>
              </div>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              <IconBtn title={micMuted ? "Unmute" : "Mute"} onClick={() => setMicMuted(!micMuted)} danger={micMuted}>
                {micMuted ? <MicOff className="w-[17px] h-[17px]" /> : <Mic className="w-[17px] h-[17px]" />}
              </IconBtn>
              <IconBtn title={deafened ? "Undeafen" : "Deafen"} onClick={() => setDeafened(!deafened)} danger={deafened}>
                <Headphones className="w-[17px] h-[17px]" />
              </IconBtn>
              <div className="group">
                <IconBtn title="User Settings" onClick={() => onOpenSettings?.()}>
                  <Settings className="w-[17px] h-[17px] transition-transform duration-300 group-hover:rotate-45" />
                </IconBtn>
              </div>
            </div>
          </>
        ) : (
          <>
            <button className="flex items-center flex-1 hover:bg-white/8 p-1 rounded-[6px] transition-colors min-w-0 mr-1">
              <Avatar
                initials={currentUser?.initials ?? "?"}
                color={currentUser?.avatarColor ?? "#cc0000"}
                status={currentUser?.status ?? "online"}
                size="sm"
                statusBg="#1e2022"
                className="mr-2"
              />
              <div className="flex flex-col text-left min-w-0">
                <span className="text-[13px] font-semibold text-[#f2f3f5] leading-tight truncate">{currentUser?.displayName}</span>
                <span className="text-[11px] text-[#6d6f76] leading-tight truncate">@{currentUser?.username}</span>
              </div>
            </button>
            <div className="flex items-center gap-0.5 shrink-0">
              <IconBtn title={micMuted ? "Unmute" : "Mute"} onClick={() => setMicMuted(!micMuted)} danger={micMuted}>
                {micMuted ? <MicOff className="w-[17px] h-[17px]" /> : <Mic className="w-[17px] h-[17px]" />}
              </IconBtn>
              <IconBtn title={deafened ? "Undeafen" : "Deafen"} onClick={() => setDeafened(!deafened)} danger={deafened}>
                <Headphones className="w-[17px] h-[17px]" />
              </IconBtn>
              <div className="group">
                <IconBtn title="User Settings" onClick={() => onOpenSettings?.()}>
                  <Settings className="w-[17px] h-[17px] transition-transform duration-300 group-hover:rotate-45" />
                </IconBtn>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center px-2 py-[7px] rounded-[6px] transition-all duration-150 gap-3",
        isActive ? "bg-[#2a0505] text-[#f2f3f5]" : "text-[#87898c] hover:bg-[#1a0505] hover:text-[#dbdee1]"
      )}
    >
      <span className={cn("shrink-0 transition-colors", isActive ? "text-[#5865f2]" : "text-[#6d6f76]")}>{icon}</span>
      <span className="font-medium text-[15px] flex-1 text-left tracking-[-0.01em]">{label}</span>
    </button>
  );
}

function IconBtn({ children, title, onClick, danger }: { children: React.ReactNode; title: string; onClick?: () => void; danger?: boolean }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={cn(
        "w-8 h-8 rounded-[6px] flex items-center justify-center transition-all duration-150",
        danger ? "text-[#f23f43] hover:bg-white/8" : "text-[#87898c] hover:bg-white/8 hover:text-[#dbdee1]"
      )}
    >
      {children}
    </button>
  );
}
