import { useState } from "react";
import { Hash, Volume2, ChevronDown, Megaphone, Plus, Settings } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import type { Server, Channel, Category } from "@/types";
import { cn } from "@/lib/utils";

interface GuildChannelListProps {
  server: Server;
  activeChannelId: string | null;
  onSelectChannel: (channel: Channel) => void;
  onOpenSettings?: () => void;
}

interface CategoryGroup {
  category: Category | null;
  channels: Channel[];
}

function buildGroups(categories: Category[], channels: Channel[]): CategoryGroup[] {
  const groups: CategoryGroup[] = [];

  const uncategorized = channels.filter((c) => !c.categoryId);
  if (uncategorized.length > 0) {
    groups.push({ category: null, channels: uncategorized });
  }

  for (const cat of categories) {
    const children = channels.filter((c) => c.categoryId === cat.id);
    if (children.length > 0) {
      groups.push({ category: cat, channels: children });
    }
  }
  return groups;
}

function ChannelIcon({ type }: { type: Channel["type"] }) {
  if (type === "voice") return <Volume2 className="w-[15px] h-[15px] shrink-0" />;
  if (type === "announcement") return <Megaphone className="w-[15px] h-[15px] shrink-0" />;
  return <Hash className="w-[15px] h-[15px] shrink-0" />;
}

export function GuildChannelList({ server, activeChannelId, onSelectChannel, onOpenSettings }: GuildChannelListProps) {
  const getChannelsByServer = useAppStore((s) => s.getChannelsByServer);
  const getCategoriesByServer = useAppStore((s) => s.getCategoriesByServer);
  const channels = getChannelsByServer(server.id);
  const categories = getCategoriesByServer(server.id);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  function toggleCategory(id: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const groups = buildGroups(categories, channels);
  const initials = server.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div
      className="w-[240px] h-full flex flex-col shrink-0"
      style={{ background: "linear-gradient(180deg, #080d1a 0%, #080f1c 60%, #06091a 100%)" }}
    >
      <div
        className="h-12 shrink-0 flex items-center px-3 gap-2 cursor-pointer hover:bg-white/5 transition-colors select-none"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.25)" }}
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
          style={{ backgroundColor: server.iconColor }}
        >
          {server.initials.length > 1 ? server.initials : initials}
        </div>
        <span className="flex-1 font-semibold text-[15px] text-[#f2f3f5] truncate tracking-[-0.01em]">
          {server.name}
        </span>
        <ChevronDown className="w-4 h-4 text-[#87898c] shrink-0" />
      </div>

      <div className="flex-1 overflow-y-auto discord-scrollbar pt-3 pb-2">
        {groups.map((group) => {
          const catId = group.category?.id ?? "uncategorized";
          const isCollapsed = group.category ? collapsed.has(catId) : false;

          return (
            <div key={catId} className="mb-2">
              {group.category && (
                <button
                  onClick={() => toggleCategory(catId)}
                  className="w-full flex items-center gap-1 px-2 py-[3px] text-[#6d6f76] hover:text-[#c0c3c9] transition-colors uppercase text-[10px] font-bold tracking-widest mb-[2px] group"
                >
                  <ChevronDown
                    className={cn("w-3 h-3 shrink-0 transition-transform", isCollapsed ? "-rotate-90" : "")}
                  />
                  <span className="truncate flex-1 text-left">{group.category.name}</span>
                  <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity mr-1" />
                </button>
              )}

              {!isCollapsed &&
                group.channels.map((ch) => {
                  const isActive = activeChannelId === ch.id;
                  const isVoice = ch.type === "voice";
                  return (
                    <button
                      key={ch.id}
                      onClick={() => !isVoice && onSelectChannel(ch)}
                      className={cn(
                        "w-full flex items-center gap-1.5 px-2 py-[5px] mx-2 rounded-[6px] transition-all duration-150 text-left group/ch",
                        "max-w-[calc(100%-16px)]",
                        isActive
                          ? "bg-[#404249] text-[#f2f3f5]"
                          : isVoice
                          ? "text-[#5e6068] hover:text-[#c0c3c9] hover:bg-[#35373c]/50"
                          : "text-[#87898c] hover:bg-[#35373c] hover:text-[#dbdee1]"
                      )}
                    >
                      <span className="shrink-0">
                        <ChannelIcon type={ch.type} />
                      </span>
                      <span className="flex-1 text-[15px] font-medium truncate">{ch.name}</span>
                      {ch.unreadCount ? (
                        <span className="bg-[#ed4245] text-white text-[10px] font-bold rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center">
                          {ch.unreadCount}
                        </span>
                      ) : (
                        <Settings className="w-3 h-3 opacity-0 group-hover/ch:opacity-50 transition-opacity shrink-0" />
                      )}
                    </button>
                  );
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
