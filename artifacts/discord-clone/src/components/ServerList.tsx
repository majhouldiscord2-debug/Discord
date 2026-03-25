import { useState } from "react";
import { Plus, Compass, Download } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { InProgress } from "./InProgress";

function DiscordLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function ServerButton({
  name, children, isActive, hasNotification, notificationCount, onClick, glowColor,
}: {
  name: string;
  children: React.ReactNode;
  isActive: boolean;
  hasNotification?: boolean;
  notificationCount?: number;
  onClick: () => void;
  glowColor?: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative flex items-center justify-center w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="absolute left-0 rounded-r-full transition-all duration-200 bg-white"
        style={{
          width: isActive ? 4 : hovered ? 4 : hasNotification ? 4 : 0,
          height: isActive ? 40 : hovered ? 20 : hasNotification ? 8 : 0,
          opacity: (isActive || hovered || hasNotification) ? 1 : 0,
        }}
      />
      {!isActive && notificationCount && notificationCount > 0 ? (
        <div className="absolute bottom-0 right-1 min-w-[18px] h-[18px] bg-[#ed4245] rounded-full flex items-center justify-center z-20 px-1 shadow-lg">
          <span className="text-[10px] text-white font-bold leading-none">{notificationCount}</span>
        </div>
      ) : null}
      <button
        onClick={onClick}
        className="w-12 h-12 flex items-center justify-center text-white font-bold text-[18px] transition-all duration-200 overflow-hidden"
        style={{
          borderRadius: isActive || hovered ? 16 : 24,
          boxShadow: isActive && glowColor ? `0 4px 20px ${glowColor}55` : undefined,
        }}
      >
        {children}
      </button>
      {hovered && (
        <div className="absolute left-[68px] z-50 pointer-events-none animate-scale-in">
          <div
            className="text-white text-[13px] font-semibold px-3 py-2 rounded-lg shadow-2xl whitespace-nowrap"
            style={{ background: "#06090f", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {name}
            <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#06090f]" />
          </div>
        </div>
      )}
    </div>
  );
}

interface ServerListProps {
  activeServer: "dms" | string;
  onSelectServer: (serverId: "dms" | string) => void;
  isBotMode: boolean;
  onToggleBotMode: () => void;
}

export function ServerList({ activeServer, onSelectServer, isBotMode, onToggleBotMode }: ServerListProps) {
  const servers = useAppStore((s) => s.servers);

  return (
    <div
      className="w-[72px] h-full flex flex-col items-center py-3 gap-2 overflow-y-auto no-scrollbar shrink-0"
      style={{ background: "linear-gradient(180deg, #080e1c 0%, #060b14 50%, #070a18 100%)" }}
    >
      <ServerButton
        name={isBotMode ? "Switch to Discord" : "Switch to Bot Manager"}
        isActive={activeServer === "dms" && !isBotMode}
        onClick={() => {
          if (!isBotMode) onSelectServer("dms");
          onToggleBotMode();
        }}
        glowColor="#1d6ef5"
      >
        <div
          className="w-12 h-12 flex items-center justify-center transition-all duration-200"
          style={{
            borderRadius: (!isBotMode && activeServer === "dms") || isBotMode ? 16 : 24,
            background:
              (!isBotMode && activeServer === "dms") || isBotMode
                ? "linear-gradient(135deg, #1d6ef5 0%, #1a5fd4 100%)"
                : "#0a1420",
          }}
        >
          <DiscordLogo />
        </div>
      </ServerButton>

      <div className="w-8 h-px shrink-0" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }} />

      {!isBotMode && (
        <div className="flex flex-col items-center w-full mt-1">
          <InProgress size="sm" label="Servers" description="Coming soon" />
        </div>
      )}
    </div>
  );
}
