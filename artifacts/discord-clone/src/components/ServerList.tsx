import { useState } from "react";
import { Plus, Compass, Download, MessageCircle } from "lucide-react";
import { servers } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function ServerList() {
  const [activeServer, setActiveServer] = useState<number | "dms">("dms");

  return (
    <div className="w-[72px] h-full bg-sidebar-dark flex flex-col items-center py-3 gap-2 overflow-y-auto no-scrollbar shrink-0 z-20">
      {/* Home / DMs Button */}
      <div className="relative group flex items-center justify-center w-full">
        {activeServer === "dms" && (
          <div className="absolute left-0 w-1 h-10 bg-foreground rounded-r-lg" />
        )}
        <button 
          onClick={() => setActiveServer("dms")}
          className={cn(
            "w-12 h-12 flex items-center justify-center text-foreground transition-all duration-200",
            activeServer === "dms" 
              ? "rounded-[16px] bg-primary" 
              : "rounded-[24px] bg-sidebar hover:rounded-[16px] hover:bg-primary"
          )}
        >
          <MessageCircle className="w-7 h-7" />
        </button>
      </div>

      <div className="w-8 h-[2px] bg-sidebar rounded-full my-1" />

      {/* Server List */}
      {servers.map((server) => (
        <div key={server.id} className="relative group flex items-center justify-center w-full">
          {activeServer === server.id && (
            <div className="absolute left-0 w-1 h-10 bg-foreground rounded-r-lg" />
          )}
          {activeServer !== server.id && server.hasNotification && (
            <div className="absolute left-0 w-1 h-2 bg-foreground rounded-r-lg group-hover:h-5 transition-all duration-200" />
          )}
          
          <button
            onClick={() => setActiveServer(server.id)}
            className={cn(
              "w-12 h-12 flex items-center justify-center text-foreground text-lg font-medium transition-all duration-200",
              server.color,
              activeServer === server.id ? "rounded-[16px]" : "rounded-[24px] hover:rounded-[16px]"
            )}
          >
            {server.initials}
          </button>
        </div>
      ))}

      {/* Actions */}
      <button className="w-12 h-12 rounded-[24px] bg-sidebar hover:bg-success hover:text-white text-success transition-all duration-200 flex items-center justify-center mt-2 hover:rounded-[16px]">
        <Plus className="w-6 h-6" />
      </button>
      
      <button className="w-12 h-12 rounded-[24px] bg-sidebar hover:bg-success hover:text-white text-success transition-all duration-200 flex items-center justify-center hover:rounded-[16px]">
        <Compass className="w-6 h-6" />
      </button>

      <div className="w-8 h-[2px] bg-sidebar rounded-full my-1" />

      <button className="w-12 h-12 rounded-[24px] bg-sidebar hover:bg-success hover:text-white text-success transition-all duration-200 flex items-center justify-center hover:rounded-[16px]">
        <Download className="w-6 h-6" />
      </button>
    </div>
  );
}
