import { useState, useRef, useEffect } from "react";
import { ChevronDown, MoreHorizontal, Server, ArrowUpRight, X, Users, Circle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiscordServer {
  id: number;
  guildId?: string;
  name: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  serverBannerUrl?: string;
  tags: string[];
  accentColor: string;
  inviteCode?: string;
  memberCount?: number;
  onlineCount?: number;
}

const SERVERS: DiscordServer[] = [
  {
    id: 1,
    guildId: "1313625670026530866",
    name: "Blox Fruits Trading & Values & Stock",
    description: "Welcome to Blox Fruits Trading Server! We host legitimate giveaways & active traders with a community prioritized server",
    logoUrl: "https://cdn.discordapp.com/icons/1313625670026530866/a_7343ae11d606e8f1bf0d93e4f455dec6.gif?size=2048",
    bannerUrl: "https://cdn.discordapp.com/discovery-splashes/1313625670026530866/3aea8efe6a269342e8f5b90accb9f542.jpg?size=2048",
    serverBannerUrl: "https://tr.rbxcdn.com/180DAY-6d6508475e3ec09d955cc7d8cee0ddf6/500/280/Image/Jpeg/noFilter",
    tags: ["Blox Fruits", "Blox Fruits Codes", "Blox Fruits Trading", "Blox Fruit", "Blox Fruits Values", "Roblox", "Trading", "Giveaways", "Give-Aways", "Community"],
    accentColor: "#f59e0b",
    inviteCode: "bloxfruits",
  },
  {
    id: 2,
    name: "Pokémon GO",
    description: "The largest Pokémon GO community. Trade, raid, and connect with fellow trainers worldwide.",
    logoUrl: "",
    bannerUrl: "",
    tags: ["Pokémon", "Gaming", "Mobile", "Community", "Trading"],
    accentColor: "#ffa53e",
    memberCount: 98400,
    onlineCount: 3210,
  },
  {
    id: 3,
    name: "Arknights: Endfield",
    description: "Official community server for Arknights: Endfield. Get updates, guides, and connect with operators.",
    logoUrl: "",
    bannerUrl: "",
    tags: ["Arknights", "Gacha", "Gaming", "Anime", "Strategy"],
    accentColor: "#66aaff",
    memberCount: 54200,
    onlineCount: 1870,
  },
  {
    id: 4,
    name: "Valheim",
    description: "A mighty community for the beloved Viking survival game. Share builds, explore and conquer together.",
    logoUrl: "",
    bannerUrl: "",
    tags: ["Valheim", "Survival", "Vikings", "Gaming", "PC"],
    accentColor: "#7dde86",
    memberCount: 41700,
    onlineCount: 980,
  },
  {
    id: 5,
    name: "War Thunder",
    description: "The definitive community for War Thunder players. Discuss vehicles, tactics, and events.",
    logoUrl: "",
    bannerUrl: "",
    tags: ["War Thunder", "Military", "Tanks", "Aviation", "Gaming"],
    accentColor: "#a78bfa",
    memberCount: 122000,
    onlineCount: 4500,
  },
];

const GRADIENT_BANNERS: Record<number, string> = {
  2: "linear-gradient(135deg, #1a6b3c 0%, #2d8a5c 40%, #89c7e0 100%)",
  3: "linear-gradient(135deg, #1a2540 0%, #253a6b 50%, #6b8fcc 100%)",
  4: "linear-gradient(135deg, #1a2010 0%, #2d4020 50%, #4a6030 100%)",
  5: "linear-gradient(135deg, #0a0a2a 0%, #1a1a4a 50%, #2a2a8a 100%)",
};

const SORT_OPTIONS = ["Top Rating", "Top Active", "Top Member", "Top Events"] as const;
type SortOption = typeof SORT_OPTIONS[number];

const ALL_TAGS = [
  "roblox","discord","bot","app","automation","tools","utility","services","community","gaming",
  "server","online","multiplayer","chat","social","platform","dashboard","webapp","mobileapp","software",
  "program","coding","programming","developer","devtools","api","system","network","internet","digital",
  "tech","startup","project","creator","builders","development","script","scripting","javascript","python",
  "nodejs","react","backend","frontend","database","hosting","cloud","security","login","account",
  "user","stats","analytics","tracker","manager","controlpanel","admin","moderation","modtools","antispam",
  "antiraid","protection","verification","captcha","autorole","roles","permissions","logs","logging","alerts",
  "notify","autoresponder","automessage","scheduler","commands","ai","chatbot","assistant","machinelearning","growth",
  "servergrowth","marketing","advertising","promotion","bump","invites","invitetracker","reward","rewardsystem","economy",
  "leveling","xp","rank","leaderboard","engagement","active","members","boost","viral","trending",
  "discover","explore","hub","directory","publicserver","fun","chill","relax","friendly","memes",
  "humor","entertainment","media","streaming","youtube","twitch","tiktok","music","playlist","dj",
  "voicechat","vc","gamingcommunity","gamers","esports","tournaments","events","giveaways","freeloot","shop",
  "marketplace","trading","exchange","selling","buying","robux","robloxgames","bloxfruits","animefighters","animeadventures",
  "minecraft","survival","skyblock","factions","pvp","bedwars","clashroyale","clashofclans","brawlstars","fps",
  "shooter","cod","fortnite","apex","valorant","csgo","pubg","racing","simulator","tycoon",
  "idle","strategy","adventure","rpg","mmorpg","openworld","quests","missions","sandboxgame","mobilegames",
  "pcgames","console","playstation","xbox","android","ios","windows","mac","linux","multilingual",
];

function useClickOutside(ref: React.RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    function listener(e: MouseEvent) {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    }
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

function useDiscordWidget(guildId?: string) {
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [onlineCount, setOnlineCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!guildId) { setLoading(false); return; }
    let cancelled = false;

    async function fetchData() {
      try {
        const widgetRes = await fetch(`https://discord.com/api/guilds/${guildId}/widget.json`);
        const widgetData = await widgetRes.json();
        if (!cancelled && widgetData.presence_count !== undefined) {
          setOnlineCount(widgetData.presence_count);
        }
      } catch {}

      try {
        const previewRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/preview`);
        const previewData = await previewRes.json();
        if (!cancelled) {
          if (previewData.approximate_member_count) setMemberCount(previewData.approximate_member_count);
          if (previewData.approximate_presence_count) setOnlineCount(previewData.approximate_presence_count);
        }
      } catch {}

      if (!cancelled) setLoading(false);
    }

    fetchData();
    return () => { cancelled = true; };
  }, [guildId]);

  return { memberCount, onlineCount, loading };
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function SortDropdown({ value, onChange }: { value: SortOption; onChange: (v: SortOption) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null!);
  useClickOutside(ref, () => setOpen(false));
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium text-[#dbdee1] transition-colors hover:bg-white/10"
        style={{ backgroundColor: "#060b14", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        {value}
        <ChevronDown className={cn("w-3.5 h-3.5 text-[#949ba4] transition-transform duration-150", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 rounded-lg overflow-hidden py-1 min-w-[160px]"
          style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
          {SORT_OPTIONS.map((opt) => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              className={cn("w-full text-left px-4 py-2 text-[13px] font-medium transition-colors",
                value === opt ? "text-[#5865f2] bg-[#5865f2]/10" : "text-[#dbdee1] hover:bg-white/8")}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TagsDropdown({ selected, onChange }: { selected: Set<string>; onChange: (tags: Set<string>) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null!);
  useClickOutside(ref, () => setOpen(false));
  const filtered = ALL_TAGS.filter((t) => t.includes(search.toLowerCase()));
  function toggle(tag: string) {
    const next = new Set(selected);
    if (next.has(tag)) next.delete(tag); else next.add(tag);
    onChange(next);
  }
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium text-[#dbdee1] transition-colors hover:bg-white/10"
        style={{ backgroundColor: "#060b14", border: "1px solid rgba(255,255,255,0.1)" }}>
        <span>Tags</span>
        {selected.size > 0 && (
          <span className="flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold text-white" style={{ background: "#5865f2" }}>
            {selected.size}
          </span>
        )}
        <ChevronDown className={cn("w-3.5 h-3.5 text-[#949ba4] transition-transform duration-150", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 rounded-lg overflow-hidden"
          style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", width: 280 }}>
          <div className="p-2 border-b border-white/[0.06]">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tags…"
              className="w-full bg-transparent text-[12px] text-[#dbdee1] outline-none placeholder:text-[#4e5058] px-2 py-1" />
          </div>
          <div className="flex flex-wrap gap-1.5 p-2.5 max-h-[240px] overflow-y-auto discord-scrollbar">
            {filtered.map((tag) => {
              const active = selected.has(tag);
              return (
                <button key={tag} onClick={() => toggle(tag)}
                  className="px-2 py-0.5 rounded-full text-[11px] font-medium transition-all"
                  style={{ background: active ? "#5865f2" : "rgba(255,255,255,0.07)", color: active ? "#fff" : "#949ba4", border: `1px solid ${active ? "#5865f2" : "rgba(255,255,255,0.1)"}` }}>
                  {tag}
                </button>
              );
            })}
          </div>
          {selected.size > 0 && (
            <div className="px-2.5 pb-2.5">
              <button onClick={() => onChange(new Set())} className="text-[11px] text-[#949ba4] hover:text-[#f2f3f5] transition-colors">
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ServerCard({ server }: { server: DiscordServer }) {
  const { memberCount: widgetMembers, onlineCount: widgetOnline, loading } = useDiscordWidget(server.guildId);
  const members = widgetMembers ?? server.memberCount ?? null;
  const online = widgetOnline ?? server.onlineCount ?? null;
  const hasBanner = !!server.bannerUrl;
  const hasLogo = !!server.logoUrl;

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col transition-all duration-200"
      style={{ backgroundColor: "#060b14", border: "1px solid rgba(255,255,255,0.08)", willChange: "transform" }}
      onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-3px)"; el.style.boxShadow = `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.12)`; }}
      onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = ""; el.style.boxShadow = ""; }}
    >
      {/* Banner */}
      <div className="relative h-[130px] shrink-0 overflow-hidden">
        {hasBanner ? (
          <img src={server.bannerUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ background: GRADIENT_BANNERS[server.id] ?? "linear-gradient(135deg, #1a1f3a, #2a2f5a)" }} />
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(6,11,20,0.9) 100%)" }} />
        <button className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
        {/* Server icon overlapping banner */}
        <div className="absolute bottom-0 translate-y-1/2 left-3">
          {hasLogo ? (
            <img
              src={server.logoUrl}
              alt={server.name}
              className="w-14 h-14 rounded-xl object-cover"
              style={{ border: "3px solid #060b14", boxShadow: "0 4px 12px rgba(0,0,0,0.6)" }}
            />
          ) : (
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-[20px]"
              style={{ background: `linear-gradient(135deg, #1a1a2e, ${server.accentColor})`, border: "3px solid #060b14", boxShadow: "0 4px 12px rgba(0,0,0,0.6)" }}
            >
              {server.name[0]}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-3 pt-9 pb-3 flex flex-col gap-2">
        {/* Server name */}
        <p className="text-[13px] font-bold text-[#f2f3f5] leading-tight line-clamp-1">{server.name}</p>

        {/* Members row */}
        <div className="flex items-center gap-3 min-h-[16px]">
          {loading && server.guildId ? (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full border border-[#949ba4]/40 border-t-[#949ba4] animate-spin" />
              <span className="text-[11px] text-[#4e5058]">Loading...</span>
            </div>
          ) : (
            <>
              {members !== null && (
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-[#949ba4]" />
                  <span className="text-[11px] font-semibold text-[#949ba4]">{formatCount(members)} members</span>
                </div>
              )}
              {online !== null && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#23a55a]" style={{ boxShadow: "0 0 4px #23a55a" }} />
                  <span className="text-[11px] font-semibold text-[#23a55a]">{formatCount(online)} online</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Description */}
        <p className="text-[11px] text-[#949ba4] leading-relaxed line-clamp-2">{server.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {server.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] font-medium"
              style={{ background: "rgba(255,255,255,0.07)", color: "#b5bac1", border: "1px solid rgba(255,255,255,0.08)" }}>
              {tag}
            </span>
          ))}
          {server.tags.length > 4 && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium"
              style={{ background: "rgba(255,255,255,0.05)", color: "#5e6068", border: "1px solid rgba(255,255,255,0.06)" }}>
              +{server.tags.length - 4}
            </span>
          )}
        </div>

        {/* Join button */}
        <a
          href={server.inviteCode ? `https://discord.gg/${server.inviteCode}` : undefined}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 rounded-md text-[13px] font-semibold text-white transition-all hover:brightness-110 flex items-center justify-center gap-1.5 mt-1"
          style={{ background: `linear-gradient(135deg, #1a1a2e, ${server.accentColor})` }}
        >
          Join Server <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

const allServers = [
  {
    id: 10,
    name: "Blox Fruits Trading & Values & Stock",
    members: "100K+",
    logoUrl: "https://cdn.discordapp.com/icons/1313625670026530866/a_7343ae11d606e8f1bf0d93e4f455dec6.gif?size=128",
    inviteCode: "bloxfruits",
  },
  { id: 11, name: "Minecraft Hub", members: "128K", icon: "⛏️" },
  { id: 12, name: "Fortnite HQ", members: "94K", icon: "🎯" },
  { id: 13, name: "Valorant Zone", members: "210K", icon: "🔫" },
  { id: 14, name: "Among Us Official", members: "55K", icon: "🕵️" },
];

export default function ServerBotPage() {
  const [activeTab, setActiveTab] = useState<"join" | "all">("join");
  const [sortBy, setSortBy] = useState<SortOption>("Top Rating");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  return (
    <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden relative" style={{ backgroundColor: "#0a1220" }}>
      {/* Header */}
      <div className="h-12 shrink-0 flex items-center px-4 gap-6" style={{ borderBottom: "1px solid rgba(0,0,0,0.3)", backgroundColor: "#0a1220" }}>
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-[#949ba4]" />
          <span className="text-[#f2f3f5] font-semibold text-[16px]">Servers</span>
        </div>
        <div className="w-px h-5 bg-white/10" />
        <div className="flex items-center gap-1">
          <TabBtn label="Join Servers" isActive={activeTab === "join"} onClick={() => setActiveTab("join")} />
          <TabBtn label="All Servers" isActive={activeTab === "all"} onClick={() => setActiveTab("all")} />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto discord-scrollbar px-5 py-4">
        {activeTab === "join" ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-bold text-[#f2f3f5]">Available Servers</h2>
              <div className="flex items-center gap-2">
                <SortDropdown value={sortBy} onChange={setSortBy} />
                <TagsDropdown selected={selectedTags} onChange={setSelectedTags} />
              </div>
            </div>

            {selectedTags.size > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {[...selectedTags].map((tag) => (
                  <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium text-white" style={{ background: "#5865f2" }}>
                    {tag}
                    <button onClick={() => { const n = new Set(selectedTags); n.delete(tag); setSelectedTags(n); }} className="hover:opacity-70 transition-opacity">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pb-4">
              {SERVERS.map((server, i) => (
                <div key={server.id} className="animate-fade-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <ServerCard server={server} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-[18px] font-bold text-[#f2f3f5] mb-4">All Servers</h2>
            <div className="flex flex-col gap-2">
              {allServers.map((s) => (
                <div key={s.id} className="flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-colors hover:bg-white/5"
                  style={{ backgroundColor: "#060b14", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #1a1f3a, #2a2f5a)" }}>
                    {"logoUrl" in s && s.logoUrl ? (
                      <img src={s.logoUrl} alt={s.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[20px]">{"icon" in s ? s.icon : "🌐"}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-[#f2f3f5] truncate">{s.name}</div>
                    <div className="text-[12px] text-[#949ba4]">{s.members} members</div>
                  </div>
                  {"inviteCode" in s && s.inviteCode ? (
                    <a
                      href={`https://discord.gg/${s.inviteCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-md text-[12px] font-semibold text-white transition-all hover:brightness-110 shrink-0 flex items-center gap-1"
                      style={{ background: "linear-gradient(135deg, #5865f2, #4752c4)" }}
                    >
                      Join <ArrowUpRight className="w-3 h-3" />
                    </a>
                  ) : (
                    <button className="px-3 py-1.5 rounded-md text-[12px] font-semibold text-white transition-all hover:brightness-110 shrink-0"
                      style={{ background: "linear-gradient(135deg, #5865f2, #4752c4)" }}>
                      Join
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TabBtn({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={cn(
        "px-3 py-[7px] text-[15px] font-medium transition-colors rounded-[4px]",
        isActive ? "text-[#f2f3f5] border-b-2 border-white rounded-none" : "text-[#949ba4] hover:text-[#dbdee1] hover:bg-white/5"
      )}>
      {label}
    </button>
  );
}
