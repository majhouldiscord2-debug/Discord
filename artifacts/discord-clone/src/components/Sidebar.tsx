import { useState } from "react";
import { Users, LayoutGrid, Rocket, Target, Plus, Mic, MicOff, Headphones, Settings } from "lucide-react";
import { dmContacts, currentUser } from "@/lib/mock-data";
import { Avatar } from "./Avatar";

export function Sidebar() {
  const [activeItem, setActiveItem] = useState<string>("friends");
  const [micMuted, setMicMuted] = useState(false);

  return (
    <div className="w-[240px] h-full bg-sidebar flex flex-col shrink-0">
      {/* Top Search Button */}
      <div className="h-12 border-b border-sidebar-dark flex items-center px-2.5 shrink-0 shadow-sm">
        <button className="w-full h-7 bg-sidebar-dark hover:bg-[#1e1f22]/80 text-muted text-[13px] font-medium text-left px-2 rounded-[4px] transition-colors">
          Find or start a conversation
        </button>
      </div>

      {/* Main Scrollable Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-2">
        {/* Nav Items */}
        <div className="px-2 space-y-[2px]">
          <NavItem 
            icon={<Users className="w-5 h-5" />} 
            label="Friends" 
            isActive={activeItem === "friends"} 
            onClick={() => setActiveItem("friends")} 
          />
          <NavItem 
            icon={<Rocket className="w-5 h-5" />} 
            label="Nitro" 
            isActive={activeItem === "nitro"} 
            onClick={() => setActiveItem("nitro")} 
          />
          <NavItem 
            icon={<LayoutGrid className="w-5 h-5" />} 
            label="Message Requests" 
            isActive={activeItem === "requests"} 
            onClick={() => setActiveItem("requests")} 
          />
          <NavItem 
            icon={<Target className="w-5 h-5" />} 
            label="Quests" 
            isActive={activeItem === "quests"} 
            onClick={() => setActiveItem("quests")} 
          />
        </div>

        {/* DMs Section Header */}
        <div className="pt-4 pb-1 px-4 flex items-center justify-between hover:text-foreground text-muted cursor-pointer transition-colors group">
          <span className="text-xs font-bold tracking-wider">DIRECT MESSAGES</span>
          <Plus className="w-4 h-4 opacity-70 group-hover:opacity-100" />
        </div>

        {/* DM List */}
        <div className="px-2 pb-2 space-y-[2px]">
          {dmContacts.map((contact) => (
            <button 
              key={contact.id}
              className="w-full flex items-center px-2 py-1.5 rounded-[4px] hover:bg-[#3f4147] hover:text-foreground text-muted transition-colors group"
            >
              <Avatar 
                initials={contact.initials} 
                colorClass={contact.avatarColor}
                status={contact.status}
                size="sm"
                className="mr-3 opacity-90 group-hover:opacity-100"
              />
              <span className="truncate text-[15px] font-medium opacity-90 group-hover:opacity-100">{contact.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* User Profile Bar */}
      <div className="h-[52px] bg-sidebar-darker flex items-center px-2 shrink-0">
        <button className="flex items-center flex-1 hover:bg-white/10 p-1 rounded-md transition-colors min-w-0">
          <Avatar 
            initials={currentUser.initials} 
            colorClass={currentUser.avatarColor}
            status={currentUser.status}
            statusBgClass="border-sidebar-darker"
            size="sm"
            className="mr-2"
          />
          <div className="flex flex-col text-left min-w-0 pr-1">
            <span className="text-[13px] font-bold text-foreground leading-tight truncate">{currentUser.name}</span>
            <span className="text-[11px] text-muted leading-tight truncate">{currentUser.statusText}</span>
          </div>
        </button>

        <div className="flex items-center">
          <button 
            onClick={() => setMicMuted(!micMuted)}
            className="w-8 h-8 rounded-md flex items-center justify-center text-muted hover:bg-white/10 hover:text-foreground transition-colors"
          >
            {micMuted ? <MicOff className="w-[18px] h-[18px] text-danger" /> : <Mic className="w-[18px] h-[18px]" />}
          </button>
          <button className="w-8 h-8 rounded-md flex items-center justify-center text-muted hover:bg-white/10 hover:text-foreground transition-colors">
            <Headphones className="w-[18px] h-[18px]" />
          </button>
          <button className="w-8 h-8 rounded-md flex items-center justify-center text-muted hover:bg-white/10 hover:text-foreground transition-colors">
            <Settings className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center px-3 py-2.5 rounded-[4px] transition-colors ${
        isActive 
          ? "bg-accent text-foreground" 
          : "text-muted hover:bg-[#3f4147] hover:text-foreground"
      }`}
    >
      <div className="mr-4 opacity-90">{icon}</div>
      <span className="font-medium text-[15px]">{label}</span>
    </button>
  );
}
