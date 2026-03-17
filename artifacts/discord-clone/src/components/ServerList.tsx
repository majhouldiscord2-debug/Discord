import { useState } from "react";
import { Plus, Compass, Download } from "lucide-react";
import { servers } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function DiscordLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

interface TooltipServerProps {
  name: string;
  children: React.ReactNode;
  isActive: boolean;
  hasNotification?: boolean;
  notificationCount?: number;
  onClick: () => void;
}

function ServerButton({ name, children, isActive, hasNotification, notificationCount, onClick }: TooltipServerProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative group flex items-center justify-center w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Active pill */}
      <div
        className={cn(
          "absolute left-0 bg-white rounded-r-full transition-all duration-200",
          isActive ? "w-1 h-10" : hovered ? "w-1 h-5" : hasNotification ? "w-1 h-2" : "w-0 h-0"
        )}
      />

      {/* Notification badge */}
      {!isActive && notificationCount && notificationCount > 0 && (
        <div className="absolute bottom-0 right-1 min-w-[18px] h-[18px] bg-[#ed4245] rounded-full flex items-center justify-center z-20 px-1">
          <span className="text-[10px] text-white font-bold leading-none">{notificationCount}</span>
        </div>
      )}

      <button
        onClick={onClick}
        className={cn(
          "w-12 h-12 flex items-center justify-center text-white font-bold text-[18px] transition-all duration-200 overflow-hidden",
          isActive ? "rounded-[16px]" : "rounded-[24px] hover:rounded-[16px]"
        )}
      >
        {children}
      </button>

      {/* Tooltip */}
      {hovered && (
        <div className="absolute left-[68px] z-50 pointer-events-none">
          <div className="bg-[#111214] text-white text-sm font-semibold px-3 py-2 rounded-md shadow-xl whitespace-nowrap">
            {name}
            <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#111214]" />
          </div>
        </div>
      )}
    </div>
  );
}

export function ServerList() {
  const [activeServer, setActiveServer] = useState<number | "dms">("dms");

  return (
    <div className="w-[72px] h-full bg-[#1e1f22] flex flex-col items-center py-3 gap-2 overflow-y-auto no-scrollbar shrink-0">
      {/* Home / DMs Button */}
      <ServerButton
        name="Direct Messages"
        isActive={activeServer === "dms"}
        onClick={() => setActiveServer("dms")}
      >
        <div className={cn(
          "w-12 h-12 flex items-center justify-center transition-all duration-200",
          activeServer === "dms"
            ? "rounded-[16px] bg-[#5865f2]"
            : "rounded-[24px] bg-[#313338] hover:rounded-[16px] hover:bg-[#5865f2]"
        )}>
          <DiscordLogo />
        </div>
      </ServerButton>

      <div className="w-8 h-[2px] bg-[#35363c] rounded-full shrink-0" />

      {/* Server List */}
      {servers.map((server) => (
        <ServerButton
          key={server.id}
          name={server.name}
          isActive={activeServer === server.id}
          hasNotification={server.hasNotification}
          notificationCount={server.notificationCount}
          onClick={() => setActiveServer(server.id)}
        >
          <div
            className={cn(
              "w-12 h-12 flex items-center justify-center transition-all duration-200 text-[18px]",
              activeServer === server.id ? "rounded-[16px]" : "rounded-[24px] hover:rounded-[16px]"
            )}
            style={{ backgroundColor: server.color }}
          >
            {server.initials}
          </div>
        </ServerButton>
      ))}

      <div className="w-8 h-[2px] bg-[#35363c] rounded-full shrink-0 mt-1" />

      {/* Add Server */}
      <ServerButton name="Add a Server" isActive={false} onClick={() => {}}>
        <div className="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-[#313338] hover:bg-[#23a55a] flex items-center justify-center text-[#23a55a] hover:text-white transition-all duration-200">
          <Plus className="w-6 h-6" />
        </div>
      </ServerButton>

      {/* Explore */}
      <ServerButton name="Explore Discoverable Servers" isActive={false} onClick={() => {}}>
        <div className="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-[#313338] hover:bg-[#23a55a] flex items-center justify-center text-[#23a55a] hover:text-white transition-all duration-200">
          <Compass className="w-6 h-6" />
        </div>
      </ServerButton>

      <div className="w-8 h-[2px] bg-[#35363c] rounded-full shrink-0" />

      {/* Download */}
      <ServerButton name="Download Apps" isActive={false} onClick={() => {}}>
        <div className="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-[#313338] hover:bg-[#5865f2] flex items-center justify-center text-[#5865f2] hover:text-white transition-all duration-200">
          <Download className="w-[22px] h-[22px]" />
        </div>
      </ServerButton>
    </div>
  );
}
