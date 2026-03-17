import { useState } from "react";
import { Users, ShoppingBag, Zap, Target, MailCheck, Plus, Mic, MicOff, Headphones, Settings, Search } from "lucide-react";
import { dmContacts, currentUser } from "@/lib/mock-data";
import { Avatar } from "./Avatar";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeView?: string;
  onNavigate?: (view: string) => void;
}

export function Sidebar({ activeView = "friends", onNavigate }: SidebarProps) {
  const [activeItem, setActiveItem] = useState<string>("friends");
  const [micMuted, setMicMuted] = useState(false);
  const [deafened, setDeafened] = useState(false);
  const [activeDm, setActiveDm] = useState<number | null>(null);

  const handleNav = (key: string) => {
    setActiveItem(key);
    setActiveDm(null);
    onNavigate?.(key);
  };

  const handleDm = (id: number) => {
    setActiveDm(id);
    setActiveItem("");
    onNavigate?.("dm");
  };

  return (
    <div className="w-[240px] h-full flex flex-col shrink-0" style={{ backgroundColor: "#2b2d31" }}>
      {/* Top Search Button */}
      <button
        className="h-12 shrink-0 flex items-center px-3 mx-0 border-b border-black/25 hover:bg-white/5 transition-colors"
        style={{ borderBottomColor: "rgba(0,0,0,0.3)" }}
      >
        <span className="flex-1 text-left text-[14px] font-medium text-[#949ba4] hover:text-[#dbdee1] transition-colors truncate">
          Find or start a conversation
        </span>
        <Search className="w-4 h-4 text-[#949ba4] shrink-0" />
      </button>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto discord-scrollbar pt-2 px-2">
        {/* Nav Items */}
        <div className="space-y-[2px] mb-1">
          <NavItem
            icon={<Users className="w-5 h-5" />}
            label="Friends"
            isActive={activeItem === "friends"}
            onClick={() => handleNav("friends")}
          />
          <NavItem
            icon={<MailCheck className="w-5 h-5" />}
            label="Message Requests"
            isActive={activeItem === "requests"}
            onClick={() => handleNav("requests")}
          />
          <NavItem
            icon={<Zap className="w-5 h-5" />}
            label="Nitro"
            isActive={activeItem === "nitro"}
            onClick={() => handleNav("nitro")}
            badge={
              <span className="ml-auto bg-[#5865f2] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                NEW
              </span>
            }
          />
          <NavItem
            icon={<ShoppingBag className="w-5 h-5" />}
            label="Shop"
            isActive={activeItem === "shop"}
            onClick={() => handleNav("shop")}
            badge={
              <span className="ml-auto bg-[#23a55a] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                NEW
              </span>
            }
          />
          <NavItem
            icon={<Target className="w-5 h-5" />}
            label="Quests"
            isActive={activeItem === "quests"}
            onClick={() => handleNav("quests")}
          />
        </div>

        {/* DMs Header */}
        <div className="mt-4 mb-1 px-2 flex items-center justify-between group cursor-pointer">
          <span className="text-[11px] font-semibold text-[#949ba4] group-hover:text-[#dbdee1] uppercase tracking-wider transition-colors select-none">
            Direct Messages
          </span>
          <button className="opacity-0 group-hover:opacity-100 text-[#949ba4] hover:text-[#dbdee1] transition-all p-0.5 rounded">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* DM Contacts */}
        <div className="space-y-[2px] pb-2">
          {dmContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => handleDm(contact.id)}
              className={cn(
                "w-full flex items-center gap-3 px-2 py-[6px] rounded-[4px] transition-colors group",
                activeDm === contact.id
                  ? "bg-[#404249] text-[#f2f3f5]"
                  : "text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]"
              )}
            >
              <Avatar
                initials={contact.initials}
                color={contact.avatarColor}
                status={contact.status}
                size="sm"
                statusBg="#2b2d31"
              />
              <span className="truncate text-[15px] font-medium">{contact.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* User Profile Bar */}
      <div
        className="h-[52px] shrink-0 flex items-center px-2 gap-1"
        style={{ backgroundColor: "#232428" }}
      >
        <button className="flex items-center flex-1 hover:bg-white/10 p-1 rounded-[4px] transition-colors min-w-0 mr-1">
          <Avatar
            initials={currentUser.initials}
            color={currentUser.avatarColor}
            status={currentUser.status}
            size="sm"
            statusBg="#232428"
            className="mr-2"
          />
          <div className="flex flex-col text-left min-w-0">
            <span className="text-[13px] font-semibold text-[#f2f3f5] leading-tight truncate">
              {currentUser.name}
            </span>
            <span className="text-[11px] text-[#949ba4] leading-tight truncate">
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
            {micMuted ? <MicOff className="w-[18px] h-[18px]" /> : <Mic className="w-[18px] h-[18px]" />}
          </IconBtn>
          <IconBtn
            title={deafened ? "Undeafen" : "Deafen"}
            onClick={() => setDeafened(!deafened)}
            danger={deafened}
          >
            <Headphones className="w-[18px] h-[18px]" />
          </IconBtn>
          <IconBtn title="User Settings" onClick={() => {}}>
            <Settings className="w-[18px] h-[18px]" />
          </IconBtn>
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
        "w-full flex items-center px-2 py-[7px] rounded-[4px] transition-colors gap-3",
        isActive
          ? "bg-[#404249] text-[#f2f3f5]"
          : "text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]"
      )}
    >
      <span className="shrink-0">{icon}</span>
      <span className="font-medium text-[16px] flex-1 text-left">{label}</span>
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
        "w-8 h-8 rounded-[4px] flex items-center justify-center transition-colors",
        danger
          ? "text-[#f23f43] hover:bg-white/10"
          : "text-[#b5bac1] hover:bg-white/10 hover:text-[#dbdee1]"
      )}
    >
      {children}
    </button>
  );
}
