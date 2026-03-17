import { useState, useEffect } from "react";
import { Hash, Volume2, ChevronDown, Lock, Plus, Settings } from "lucide-react";
import { getGuildChannels, guildIconUrl, type DiscordGuild, type GuildChannel } from "@/lib/api";
import { cn } from "@/lib/utils";

interface GuildChannelListProps {
  guild: DiscordGuild;
  activeChannelId: string | null;
  onSelectChannel: (channel: GuildChannel) => void;
  onOpenSettings?: () => void;
}

interface CategoryGroup {
  id: string | null;
  name: string;
  position: number;
  channels: GuildChannel[];
}

function buildCategoryGroups(channels: GuildChannel[]): CategoryGroup[] {
  const categories = channels
    .filter((c) => c.type === 4)
    .sort((a, b) => a.position - b.position);

  const textAndVoice = channels.filter((c) => c.type === 0 || c.type === 2 || c.type === 5 || c.type === 13 || c.type === 15);

  const uncategorized: GuildChannel[] = textAndVoice
    .filter((c) => !c.parent_id)
    .sort((a, b) => a.position - b.position);

  const groups: CategoryGroup[] = [];

  if (uncategorized.length > 0) {
    groups.push({
      id: null,
      name: "",
      position: -1,
      channels: uncategorized,
    });
  }

  for (const cat of categories) {
    const children = textAndVoice
      .filter((c) => c.parent_id === cat.id)
      .sort((a, b) => a.position - b.position);
    if (children.length > 0) {
      groups.push({
        id: cat.id,
        name: cat.name,
        position: cat.position,
        channels: children,
      });
    }
  }

  return groups;
}

function ChannelIcon({ type, nsfw }: { type: number; nsfw?: boolean }) {
  if (nsfw) return <Lock className="w-[15px] h-[15px] shrink-0" />;
  if (type === 2 || type === 13) return <Volume2 className="w-[15px] h-[15px] shrink-0" />;
  return <Hash className="w-[15px] h-[15px] shrink-0" />;
}

export function GuildChannelList({ guild, activeChannelId, onSelectChannel, onOpenSettings }: GuildChannelListProps) {
  const [channels, setChannels] = useState<GuildChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLoading(true);
    setChannels([]);
    getGuildChannels(guild.id).then((ch) => {
      setChannels(ch);
      setLoading(false);
    });
  }, [guild.id]);

  function toggleCategory(id: string) {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const iconSrc = guildIconUrl(guild);
  const initials = guild.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const groups = buildCategoryGroups(channels);

  return (
    <div
      className="w-[240px] h-full flex flex-col shrink-0"
      style={{
        background: "linear-gradient(180deg, #080d1a 0%, #080f1c 60%, #06091a 100%)",
      }}
    >
      {/* Guild Header */}
      <div
        className="h-12 shrink-0 flex items-center px-3 gap-2 cursor-pointer hover:bg-white/5 transition-colors select-none"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.25)" }}
      >
        {iconSrc ? (
          <img src={iconSrc} alt={guild.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
        ) : (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
            style={{ backgroundColor: "#1d6ef5" }}
          >
            {initials}
          </div>
        )}
        <span className="flex-1 font-semibold text-[15px] text-[#f2f3f5] truncate tracking-[-0.01em]">
          {guild.name}
        </span>
        <ChevronDown className="w-4 h-4 text-[#87898c] shrink-0" />
      </div>

      {/* Channel List */}
      <div className="flex-1 overflow-y-auto discord-scrollbar pt-3 pb-2">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 rounded-full border-2 border-[#1d6ef5]/30 border-t-[#1d6ef5] animate-spin" />
          </div>
        )}

        {!loading && groups.map((group) => (
          <div key={group.id ?? "uncategorized"} className="mb-2">
            {group.name && (
              <button
                onClick={() => group.id && toggleCategory(group.id)}
                className="w-full flex items-center gap-1 px-2 py-[3px] text-[#6d6f76] hover:text-[#c0c3c9] transition-colors uppercase text-[10px] font-bold tracking-widest mb-[2px] group"
              >
                <ChevronDown
                  className={cn(
                    "w-3 h-3 shrink-0 transition-transform",
                    group.id && collapsedCategories.has(group.id) ? "-rotate-90" : ""
                  )}
                />
                <span className="truncate flex-1 text-left">{group.name}</span>
                <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity mr-1" />
              </button>
            )}

            {(!group.id || !collapsedCategories.has(group.id)) &&
              group.channels.map((ch) => {
                const isActive = activeChannelId === ch.id;
                const isVoice = ch.type === 2 || ch.type === 13;
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
                        : "text-[#87898c] hover:bg-[#35373c] hover:text-[#dbdee1]",
                    )}
                  >
                    <ChannelIcon type={ch.type} nsfw={ch.nsfw} />
                    <span className="flex-1 text-[15px] font-medium truncate">{ch.name}</span>
                    <Settings className="w-3 h-3 opacity-0 group-hover/ch:opacity-50 transition-opacity shrink-0" />
                  </button>
                );
              })}
          </div>
        ))}

        {!loading && channels.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center gap-2">
            <Hash className="w-8 h-8 text-[#3e4147]" />
            <p className="text-[#5e6068] text-[13px]">No accessible channels</p>
          </div>
        )}
      </div>
    </div>
  );
}
