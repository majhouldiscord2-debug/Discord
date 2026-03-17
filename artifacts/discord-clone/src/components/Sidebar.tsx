import { useState } from "react";
import { Users, ShoppingBag, Zap, Target, MailCheck, Plus, Mic, MicOff, Headphones, Settings, Search } from "lucide-react";
import { dmContacts, currentUser } from "@/lib/mock-data";
import { Avatar } from "./Avatar";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeView?: string;
  onNavigate?: (view: string) => void;
  onOpenSettings?: () => void;
}

export function Sidebar({ activeView = "friends", onNavigate, onOpenSettings }: SidebarProps) {
  const [micMuted, setMicMuted] = useState(false);
  const [deafened, setDeafened] = useState(false);
  const [activeDm, setActiveDm] = useState<number | null>(null);

  const activeItem = activeView === "dm" ? "" : activeView;

  const handleNav = (key: string) => {
    setActiveDm(null);
    onNavigate?.(key);
  };

  const handleDm = (id: number) => {
    setActiveDm(id);
    onNavigate?.("dm");
  };

  return (
    <div
      className="w-[240px] h-full flex flex-col shrink-0"
      style={{
        background: "linear-gradient(180deg, #28292e 0%, #2b2d31 60%, #272930 100%)",
      }}
    >
      {/* Top Search Button */}
      <button
        className="h-12 shrink-0 flex items-center px-3 gap-2 transition-colors hover:bg-white/5"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.25)" }}
      >
        <span className="flex-1 text-left text-[13px] font-medium text-[#87898c] hover:text-[#dbdee1] transition-colors truncate">
          Find or start a conversation
        </span>
        <Search className="w-4 h-4 text-[#5e6068] shrink-0" />
      </button>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto discord-scrollbar pt-2 px-2">
        {/* Nav Items */}
        <div className="space-y-[2px] mb-1">
          <NavItem
            icon={<Users className="w-[18px] h-[18px]" />}
            label="Stats"
            isActive={activeItem === "friends"}
            onClick={() => handleNav("friends")}
          />
          <NavItem
            icon={<MailCheck className="w-[18px] h-[18px]" />}
            label="Message Requests"
            isActive={activeItem === "requests"}
            onClick={() => handleNav("requests")}
          />
          <NavItem
            icon={<Zap className="w-[18px] h-[18px]" />}
            label="Logs"
            isActive={activeItem === "nitro"}
            onClick={() => handleNav("nitro")}
          />
          <NavItem
            icon={<ShoppingBag className="w-[18px] h-[18px]" />}
            label="Tools"
            isActive={activeItem === "shop"}
            onClick={() => handleNav("shop")}
          />
          <NavItem
            icon={<Target className="w-[18px] h-[18px]" />}
            label="Servers"
            isActive={activeItem === "quests"}
            onClick={() => handleNav("quests")}
          />
        </div>

        {/* DMs Header */}
        <div className="mt-4 mb-1 px-2 flex items-center justify-between group cursor-pointer">
          <span className="text-[10px] font-bold text-[#6d6f76] group-hover:text-[#c0c3c9] uppercase tracking-widest transition-colors select-none">
            Direct Messages
          </span>
          <button className="opacity-0 group-hover:opacity-100 text-[#6d6f76] hover:text-[#dbdee1] transition-all p-0.5 rounded">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* DM Contacts */}
        <div className="space-y-[1px] pb-2">
          {dmContacts.map((contact, i) => (
            <button
              key={contact.id}
              onClick={() => handleDm(contact.id)}
              className={cn(
                "w-full flex items-center gap-3 px-2 py-[5px] rounded-[6px] transition-all duration-150 group animate-fade-slide-up",
                activeDm === contact.id
                  ? "bg-[#404249] text-[#f2f3f5]"
                  : "text-[#87898c] hover:bg-[#35373c] hover:text-[#dbdee1]"
              )}
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <Avatar
                initials={contact.initials}
                color={contact.avatarColor}
                status={contact.status}
                size="sm"
                statusBg={activeDm === contact.id ? "#404249" : "#2b2d31"}
              />
              <span className="truncate text-[14px] font-medium">{contact.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* User Profile Bar */}
      <div
        className="h-[52px] shrink-0 flex items-center px-2 gap-1"
        style={{
          background: "linear-gradient(180deg, #1e1f22 0%, #202225 100%)",
          borderTop: "1px solid rgba(0,0,0,0.2)",
        }}
      >
        <button className="flex items-center flex-1 hover:bg-white/8 p-1 rounded-[6px] transition-colors min-w-0 mr-1">
          <Avatar
            initials={currentUser.initials}
            color={currentUser.avatarColor}
            status={currentUser.status}
            size="sm"
            statusBg="#1e2022"
            className="mr-2"
          />
          <div className="flex flex-col text-left min-w-0">
            <span className="text-[13px] font-semibold text-[#f2f3f5] leading-tight truncate">
              {currentUser.name}
            </span>
            <span className="text-[11px] text-[#6d6f76] leading-tight truncate">
              {currentUser.statusText}
            </span>
          </div>
        </button>

        <div className="flex items-center gap-0.5 shrink-0">
          <IconBtn
            title={micMuted ? "Unmute" : "Mute"}
            onClick={() => setMicMuted(!micMuted)}
            danger={micMuted}
          >
            {micMuted ? <MicOff className="w-[17px] h-[17px]" /> : <Mic className="w-[17px] h-[17px]" />}
          </IconBtn>
          <IconBtn
            title={deafened ? "Undeafen" : "Deafen"}
            onClick={() => setDeafened(!deafened)}
            danger={deafened}
          >
            <Headphones className="w-[17px] h-[17px]" />
          </IconBtn>
          <div className="group">
            <IconBtn title="User Settings" onClick={() => onOpenSettings?.()}>
              <Settings className="w-[17px] h-[17px] transition-transform duration-300 group-hover:rotate-45" />
            </IconBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  isActive,
  onClick,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  badge?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center px-2 py-[7px] rounded-[6px] transition-all duration-150 gap-3",
        isActive
          ? "bg-[#404249] text-[#f2f3f5]"
          : "text-[#87898c] hover:bg-[#35373c] hover:text-[#dbdee1]"
      )}
    >
      <span className={cn("shrink-0 transition-colors", isActive ? "text-[#f2f3f5]" : "text-[#6d6f76] group-hover:text-[#dbdee1]")}>
        {icon}
      </span>
      <span className="font-medium text-[15px] flex-1 text-left tracking-[-0.01em]">{label}</span>
      {badge}
    </button>
  );
}

function IconBtn({
  children,
  title,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={cn(
        "w-8 h-8 rounded-[6px] flex items-center justify-center transition-all duration-150",
        danger
          ? "text-[#f23f43] hover:bg-white/8"
          : "text-[#87898c] hover:bg-white/8 hover:text-[#dbdee1]"
      )}
    >
      {children}
    </button>
  );
}
