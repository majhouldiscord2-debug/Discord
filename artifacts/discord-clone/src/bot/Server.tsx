import { useState, useRef, useEffect } from "react";
import { ChevronDown, Server, ArrowUpRight, X, Users, ExternalLink } from "lucide-react";
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

export const SERVERS: DiscordServer[] = [
  {
    id: 1,
    guildId: "1313625670026530866",
    name: "Blox Fruits Trading & Values & Stock",
    description: "Welcome to Blox Fruits Trading Server! We host legitimate giveaways & active traders with a community prioritized server",
    logoUrl: "https://cdn.discordapp.com/icons/1313625670026530866/a_7343ae11d606e8f1bf0d93e4f455dec6.gif?size=2048",
    bannerUrl: "https://cdn.discordapp.com/discovery-splashes/1313625670026530866/3aea8efe6a269342e8f5b90accb9f542.jpg?size=2048",
    tags: ["Blox Fruits", "Trading", "Roblox", "Giveaways", "Community", "Values"],
    accentColor: "#f97316",
    inviteCode: "bloxfruits",
  },
  {
    id: 2,
    guildId: "1027544757037187163",
    name: "Steal a Brainrot ・MM2・ Blox Fruits ・Grow A Garden・RELL Seas | Bloxzy",
    description: "Steal a Brainrot Trading – Plants vs. Brainrots | 24/7 Stocks. Discord's Top Steal a Brainrot Server",
    logoUrl: "https://cdn.discordapp.com/icons/1027544757037187163/a_834fcd58857a954c7174b568b3aef3ee.gif?size=1024",
    bannerUrl: "https://cdn.discordapp.com/discovery-splashes/1027544757037187163/696d6c009213a2a8627a86c20440014e.jpg?size=2048",
    tags: ["Blox Fruits", "Grow a Garden", "MM2", "Rell Seas", "Trading", "Roblox", "Giveaways"],
    accentColor: "#f43f5e",
    inviteCode: "bloxzy",
  },
  {
    id: 3,
    guildId: "832747824209985627",
    name: "Kitt Gaming",
    description: "The official Blox Fruits based Discord server for Kitt Gaming. There's 24/7 traders with an active community!",
    logoUrl: "https://cdn.discordapp.com/icons/832747824209985627/a_059629254114b7902dac38a7dbf6cebb.gif?size=2048",
    bannerUrl: "https://cdn.discordapp.com/discovery-splashes/832747824209985627/08857be2502da29471ff4221d585893a.jpg?size=2048",
    tags: ["Blox Fruits", "Trading", "Roblox", "Giveaways", "Community"],
    accentColor: "#38bdf8",
    inviteCode: "kitt",
  },
  {
    id: 4,
    guildId: "1038285058299154442",
    name: "Eclipse | Blox Fruits Trading Server",
    description: "Blox Fruits Trading Server, the most active 24/7 Blox Fruits trading Discord server with live stock updates, active traders, and legitimate giveaways!",
    logoUrl: "https://cdn.discordapp.com/icons/1038285058299154442/a_83a67a2e419e7b8d9f11c6e5064df211.gif?size=2048",
    bannerUrl: "https://cdn.discordapp.com/discovery-splashes/1038285058299154442/f55081c6ed964cf7fd96b0a1d0b00b50.jpg?size=2048",
    tags: ["Blox Fruits", "Trading", "Roblox", "Giveaways", "Community", "Stock Notifier"],
    accentColor: "#c026d3",
    inviteCode: "tradings",
  },
  {
    id: 5,
    guildId: "1319086573077270639",
    name: "Blox Fruits Community Server",
    description: "Welcome to Blox Fruits Community Server and Blox Fruits Trading, the most active 24/7 trading server! Best community server with live stock updates, helping system & free giveaways!",
    logoUrl: "https://cdn.discordapp.com/icons/1319086573077270639/a_52b594a4f04977dca786fa11f80bb485.gif?size=2048",
    bannerUrl: "https://cdn.discordapp.com/discovery-splashes/1319086573077270639/56ccf77fc2aa7d20f874ac5ae10b4731.jpg?size=2048",
    tags: ["Blox Fruits", "Trading", "Roblox", "Giveaways", "Community"],
    accentColor: "#10b981",
    inviteCode: "bfcs",
  },
  {
    id: 6,
    guildId: "970643838047760384",
    name: "BloxTrade | #1 Blox Fruits Trading Server",
    description: "BloxTrade the best Blox Fruits Trading Server! With 24/7 traders, non-stop trading, and exciting daily giveaways!",
    logoUrl: "https://cdn.discordapp.com/icons/970643838047760384/a_dfde37bbeea4619613be9f22e40a7044.gif?size=2048",
    bannerUrl: "https://cdn.discordapp.com/discovery-splashes/970643838047760384/28ac611e27ebeb9dc2f53be25fa11ba1.jpg?size=2048",
    tags: ["Blox Fruits", "Trading", "Roblox", "Giveaways", "Community"],
    accentColor: "#e11d48",
    inviteCode: "bloxtrade",
  },
  {
    id: 7,
    guildId: "586704051148816385",
    name: "Blox Fruits",
    description: "The official community for the popular Roblox game known as Blox Fruits.",
    logoUrl: "https://cdn.discordapp.com/icons/586704051148816385/c15726a644529ca99c2052ee4117be73.png?size=2048",
    bannerUrl: "https://cdn.discordapp.com/discovery-splashes/586704051148816385/8d9f4e10f9394ee7d8ba90bec94ef2a0.jpg?size=2048",
    tags: ["Blox Fruits", "Official", "Roblox", "Community"],
    accentColor: "#4ade80",
    inviteCode: "bloxfruits",
  },
  {
    id: 8,
    guildId: "992282055494881411",
    name: "Dragon Talon Academy",
    description: "Embark on your journey as a warrior, and join our dojo! Here, you shall learn the ancient ways of the Dragon Talon!",
    logoUrl: "https://cdn.discordapp.com/icons/992282055494881411/20171f8b7fb7fd9897992e223196f93d.png?size=2048",
    bannerUrl: "https://cdn.discordapp.com/discovery-splashes/992282055494881411/64094f68f1a456552bc030bd00726fd8.jpg?size=2048",
    tags: ["Blox Fruits", "Dragon Talon", "Roblox", "Trading", "Community"],
    accentColor: "#fb923c",
    inviteCode: "uzoth",
  },
  {
    id: 9,
    guildId: "1137103140496351352",
    name: "Blox Fruits Trading Server",
    description: "Welcome to Blox Fruits Trading, the most active 24/7 trading server! With live stock updates and legitimate giveaways!",
    logoUrl: "https://cdn.discordapp.com/icons/1137103140496351352/a_2b45cdec63ebc7fc87fbb13e81073aa2.gif?size=2048",
    bannerUrl: "https://cdn.discordapp.com/discovery-splashes/1137103140496351352/4d3cabe3b74368e6b2c9d1a2b85b8407.jpg?size=2048",
    tags: ["Blox Fruits", "Trading", "Roblox", "Giveaways", "Community"],
    accentColor: "#6366f1",
    inviteCode: "bloxfruit",
  },
  {
    id: 10,
    guildId: "1320917906346868876",
    name: "Blox Fruits Trading Server",
    description: "Join the #1 Blox Fruits Trading Server! Trade fruits, gamepasses, and more with a safe & active community!",
    logoUrl: "https://cdn.discordapp.com/icons/1320917906346868876/a_204d5b403207b4a8fe13b5ba628c86f8.gif?size=2048",
    bannerUrl: "https://cdn.discordapp.com/discovery-splashes/1320917906346868876/a66ca1e82885abaa3b9866d8b0ea4f38.jpg?size=2048",
    tags: ["Blox Fruits", "Trading", "Roblox", "Giveaways", "Community"],
    accentColor: "#f97316",
    inviteCode: "legacytrading",
  },
  {
    id: 11,
    guildId: "1320854419532812431",
    name: "Blox Fruits Trading Server",
    description: "Blox Fruits Trading Server | Roblox Discord with Live Stock Notifier, 24/7 Trading, Giveaways, Tips & Community Prioritized",
    logoUrl: "https://cdn.discordapp.com/icons/1320854419532812431/a_4113fa484c36bab0bd7df1224d9365c4.gif?size=2048",
    bannerUrl: "https://cdn.discordapp.com/discovery-splashes/1320854419532812431/1a871c018f74badb2c4112a2fab1c0fb.jpg?size=2048",
    tags: ["Blox Fruits", "Trading", "Roblox", "Giveaways", "Community"],
    accentColor: "#eab308",
    inviteCode: "blox-fruit",
  },
  {
    id: 12,
    guildId: "1165018533349044315",
    name: "Blox Fruits Trading Server | Stock Notifier",
    description: "Blox Fruits Trading Server | Stock Notifier Roblox Discord 24/7 Active Trading, Live Stock Notifications, Giveaways, Tips",
    logoUrl: "https://cdn.discordapp.com/icons/1320917906346868876/a_204d5b403207b4a8fe13b5ba628c86f8.gif?size=2048",
    bannerUrl: "https://cdn.discordapp.com/discovery-splashes/1165018533349044315/bdf3ce43883c4a589b07c942a319000f.jpg?size=2048",
    tags: ["Blox Fruits", "Trading", "Roblox", "Giveaways", "Community", "Stock Notifier"],
    accentColor: "#d97706",
    inviteCode: "bfts",
  },
  {
    id: 13,
    guildId: "1218556281539788840",
    name: "Blox Fruits Trading Server",
    description: "Welcome to Blox Fruits Trading Server! We host legitimate giveaways & active traders with a community prioritized server",
    logoUrl: "https://cdn.discordapp.com/icons/1218556281539788840/6850a0401154036ae4d319e0396fbf8e.png?size=2048",
    bannerUrl: "https://cdn.discordapp.com/discovery-splashes/1218556281539788840/abeb49f151efb383f8986a90168be60c.jpg?size=2048",
    tags: ["Blox Fruits", "Trading", "Roblox", "Giveaways", "Community"],
    accentColor: "#22c55e",
    inviteCode: "bloxfruitstrading",
  },
  {
    id: 14,
    guildId: "888721743601094678",
    name: "ScammerAlert!",
    description: "A Scam Prevention Service.",
    logoUrl: "https://cdn.discordapp.com/icons/888721743601094678/a_96b48c1c030b62740af6ca673eeea8d7.gif?size=2048",
    bannerUrl: "https://cdn.discordapp.com/discovery-splashes/888721743601094678/5acea98ed2bc69012e47efc0a61768bb.jpg?size=2048",
    tags: ["Security", "Scam Prevention", "Alerts", "Community", "Moderation"],
    accentColor: "#ef4444",
    inviteCode: "scammeralert",
  },
];

const DEFAULT_BANNER = "linear-gradient(135deg, #1a0505, #1a0505)";

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

    async function fetchData() {
      try {
        const res = await fetch(`/api/discord/guild-counts/${guildId}`);
        if (res.ok) {
          const data = await res.json() as { onlineCount: number | null; memberCount: number | null };
          if (data.onlineCount !== null) setOnlineCount(data.onlineCount);
          if (data.memberCount !== null) setMemberCount(data.memberCount);
        }
      } catch {}
      setLoading(false);
    }

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
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
        style={{ backgroundColor: "#060000", border: "1px solid rgba(255,255,255,0.1)" }}
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
                value === opt ? "text-[#cc0000] bg-[#cc0000]/10" : "text-[#dbdee1] hover:bg-white/8")}>
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
        style={{ backgroundColor: "#060000", border: "1px solid rgba(255,255,255,0.1)" }}>
        <span>Tags</span>
        {selected.size > 0 && (
          <span className="flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold text-white" style={{ background: "#cc0000" }}>
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
                  style={{ background: active ? "#cc0000" : "rgba(255,255,255,0.07)", color: active ? "#fff" : "#949ba4", border: `1px solid ${active ? "#cc0000" : "rgba(255,255,255,0.1)"}` }}>
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
      className="rounded-xl flex flex-col transition-all duration-200"
      style={{
        background: `linear-gradient(180deg, ${server.accentColor}18 0%, #060000 55%)`,
        border: `1px solid ${server.accentColor}35`,
        boxShadow: `0 2px 20px rgba(0,0,0,0.4), 0 0 30px ${server.accentColor}0a`,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(-3px)";
        el.style.boxShadow = `0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px ${server.accentColor}55, 0 0 40px ${server.accentColor}15`;
        el.style.borderColor = `${server.accentColor}60`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "";
        el.style.boxShadow = `0 2px 20px rgba(0,0,0,0.4), 0 0 30px ${server.accentColor}0a`;
        el.style.borderColor = `${server.accentColor}35`;
      }}
    >
      {/* Banner */}
      <div className="relative rounded-t-xl overflow-hidden shrink-0" style={{ height: 150 }}>
        {hasBanner ? (
          <img src={server.bannerUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ background: DEFAULT_BANNER }} />
        )}
        {/* seamless fade from banner into the tinted card body */}
        <div className="absolute inset-0"
          style={{ background: `linear-gradient(to bottom, transparent 35%, ${server.accentColor}30 75%, ${server.accentColor}18 100%)` }} />
      </div>

      {/* Icon + Content — icon floats up over banner */}
      <div className="px-3 pb-3 flex flex-col gap-2" style={{ marginTop: -28, position: "relative", zIndex: 1 }}>
        {/* Icon row */}
        <div className="flex items-end gap-2 mb-1">
          {hasLogo ? (
            <img
              src={server.logoUrl}
              alt={server.name}
              className="rounded-xl object-cover shrink-0"
              style={{
                width: 56, height: 56,
                border: `3px solid #060000`,
                boxShadow: `0 4px 20px rgba(0,0,0,0.8), 0 0 0 1px ${server.accentColor}60`,
                position: "relative",
                zIndex: 2,
              }}
            />
          ) : (
            <div
              className="shrink-0 rounded-xl flex items-center justify-center text-white font-bold text-[20px]"
              style={{
                width: 56, height: 56,
                background: `linear-gradient(135deg, #1a1a2e, ${server.accentColor})`,
                border: "3px solid #060000",
                boxShadow: `0 4px 20px rgba(0,0,0,0.8), 0 0 0 1px ${server.accentColor}60`,
                position: "relative",
                zIndex: 2,
              }}
            >
              {server.name[0]}
            </div>
          )}
        </div>

        {/* Server name */}
        <p className="text-[13px] font-bold text-[#f2f3f5] leading-snug line-clamp-1">{server.name}</p>

        {/* Online count */}
        <div className="flex items-center gap-2 min-h-[14px]">
          {loading && server.guildId ? (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#4e5058] animate-pulse" />
              <span className="text-[10px] text-[#4e5058]">Loading…</span>
            </div>
          ) : online !== null ? (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#23a55a]" style={{ boxShadow: "0 0 5px #23a55a" }} />
              <span className="text-[11px] font-semibold text-[#23a55a]">{formatCount(online)} online</span>
            </div>
          ) : members !== null ? (
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-[#949ba4]" />
              <span className="text-[11px] font-semibold text-[#949ba4]">{formatCount(members)} members</span>
            </div>
          ) : null}
        </div>

        {/* Description */}
        <p className="text-[11px] text-[#949ba4] leading-relaxed line-clamp-2">{server.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {server.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-1.5 py-0.5 rounded text-[9px] font-medium"
              style={{ background: `${server.accentColor}18`, color: server.accentColor, border: `1px solid ${server.accentColor}28` }}>
              {tag}
            </span>
          ))}
          {server.tags.length > 3 && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-medium"
              style={{ background: "rgba(255,255,255,0.05)", color: "#5e6068", border: "1px solid rgba(255,255,255,0.06)" }}>
              +{server.tags.length - 3}
            </span>
          )}
        </div>

        {/* Join button — full accent color */}
        <a
          href={server.inviteCode ? `https://discord.gg/${server.inviteCode}` : undefined}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 rounded-lg text-[12px] font-bold text-white transition-all hover:brightness-110 hover:scale-[1.01] flex items-center justify-center gap-1.5 mt-1 active:scale-[0.98]"
          style={{
            background: server.accentColor,
            boxShadow: `0 4px 18px ${server.accentColor}50`,
          }}
        >
          Join Server <ExternalLink className="w-3 h-3" />
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
    <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden relative" style={{ backgroundColor: "#0a0000" }}>
      {/* Header */}
      <div className="h-12 shrink-0 flex items-center px-4 gap-6" style={{ borderBottom: "1px solid rgba(0,0,0,0.3)", backgroundColor: "#0a0000" }}>
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
                  <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium text-white" style={{ background: "#cc0000" }}>
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
                  style={{ backgroundColor: "#060000", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #1a0505, #1a0505)" }}>
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
                      style={{ background: "linear-gradient(135deg, #cc0000, #8b0000)" }}
                    >
                      Join <ArrowUpRight className="w-3 h-3" />
                    </a>
                  ) : (
                    <button className="px-3 py-1.5 rounded-md text-[12px] font-semibold text-white transition-all hover:brightness-110 shrink-0"
                      style={{ background: "linear-gradient(135deg, #cc0000, #8b0000)" }}>
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
