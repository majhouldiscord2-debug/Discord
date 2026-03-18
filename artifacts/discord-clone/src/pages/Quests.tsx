import { useState, useRef, useEffect } from "react";
import { ChevronDown, MoreHorizontal, Target, ChevronLeft, Star, Zap, Check, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Quest {
  id: number;
  game: string;
  developer: string;
  questTitle: string;
  reward: number;
  description: string;
  endsDate: string;
  status: "available" | "watching" | "completed";
  timeLeft?: string;
  bannerContent: React.ReactNode;
  questColor: string;
}

function PokemonBanner() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1a6b3c 0%, #2d8a5c 30%, #89c7e0 70%, #b8dfef 100%)" }} />
    </div>
  );
}
function EveBanner() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1a0505 0%, #3d0808 40%, #6b1010 70%, #1a0505 100%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 40%, rgba(180,20,20,0.4) 0%, transparent 60%)" }} />
    </div>
  );
}
function ArknightsBanner() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1a2540 0%, #253a6b 40%, #6b8fcc 70%, #f0d060 100%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 60% 30%, rgba(240,208,96,0.2) 0%, transparent 50%)" }} />
    </div>
  );
}
function ValheimBanner() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1a2010 0%, #2d4020 40%, #4a6030 70%, #1a3010 100%)" }} />
    </div>
  );
}
function ThunderBanner() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0a0a2a 0%, #1a1a4a 40%, #2a2a8a 70%, #0a0a2a 100%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(100,100,255,0.3) 0%, transparent 60%)" }} />
    </div>
  );
}

const INITIAL_QUESTS: Quest[] = [
  { id: 1, game: "Pokémon GO", developer: "Niantic", questTitle: "POKÉMON GO QUEST", reward: 200, description: "Watch the video to win 200 Orbs!", endsDate: "3/21", status: "available", bannerContent: <PokemonBanner />, questColor: "#ffa53e" },
  { id: 2, game: "EVE Frontier", developer: "CCP Games", questTitle: "EVE FRONTIER VIDEO QUEST", reward: 200, description: "Watch the video to win 200 Orbs!", endsDate: "3/21", status: "watching", timeLeft: "01:27", bannerContent: <EveBanner />, questColor: "#ff6b6b" },
  { id: 3, game: "Arknights: Endfield", developer: "Gryphline", questTitle: "VERSION UPDATE: TANGTANG QUEST", reward: 700, description: "Play Arknights: Endfield for 15 minutes and win 700 Orbs.", endsDate: "3/23", status: "available", bannerContent: <ArknightsBanner />, questColor: "#66aaff" },
  { id: 4, game: "Valheim", developer: "Iron Gate", questTitle: "VALHEIM ASHLANDS QUEST", reward: 500, description: "Play Valheim for 30 minutes to earn 500 Orbs!", endsDate: "3/25", status: "available", bannerContent: <ValheimBanner />, questColor: "#7dde86" },
  { id: 5, game: "War Thunder", developer: "Gaijin Entertainment", questTitle: "WAR THUNDER VIDEO QUEST", reward: 200, description: "Watch the video to win 200 Orbs!", endsDate: "3/25", status: "available", bannerContent: <ThunderBanner />, questColor: "#a78bfa" },
];

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
  "arabic","english","french","spanish","german","italian","portuguese","turkish","russian","chinese",
  "japanese","korean","global","worldwide","communityhub","hangout","meetup","friends","friendship","connect",
  "communication","discussion","forum","support","helpdesk","faq","guides","tutorials","education","learning",
];

function OrbsIcon({ size = 16 }: { size?: number }) {
  return (
    <div className="rounded-full flex items-center justify-center shrink-0" style={{ width: size, height: size, background: "linear-gradient(135deg, #1d6ef5 0%, #9b59b6 100%)" }}>
      <div className="rounded-full bg-white/70" style={{ width: size * 0.4, height: size * 0.4 }} />
    </div>
  );
}

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
        <div
          className="absolute right-0 top-full mt-1 z-50 rounded-lg overflow-hidden py-1 min-w-[160px]"
          style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
        >
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={cn(
                "w-full text-left px-4 py-2 text-[13px] font-medium transition-colors",
                value === opt ? "text-[#5865f2] bg-[#5865f2]/10" : "text-[#dbdee1] hover:bg-white/8"
              )}
            >
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
    if (next.has(tag)) next.delete(tag);
    else next.add(tag);
    onChange(next);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium text-[#dbdee1] transition-colors hover:bg-white/10"
        style={{ backgroundColor: "#060b14", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <span>Tags</span>
        {selected.size > 0 && (
          <span className="flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold text-white" style={{ background: "#5865f2" }}>
            {selected.size}
          </span>
        )}
        <ChevronDown className={cn("w-3.5 h-3.5 text-[#949ba4] transition-transform duration-150", open && "rotate-180")} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 z-50 rounded-lg overflow-hidden"
          style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", width: 280 }}
        >
          <div className="p-2 border-b border-white/[0.06]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tags…"
              className="w-full bg-transparent text-[12px] text-[#dbdee1] outline-none placeholder:text-[#4e5058] px-2 py-1"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 p-2.5 max-h-[240px] overflow-y-auto discord-scrollbar">
            {filtered.map((tag) => {
              const active = selected.has(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggle(tag)}
                  className="px-2 py-0.5 rounded-full text-[11px] font-medium transition-all"
                  style={{
                    background: active ? "#5865f2" : "rgba(255,255,255,0.07)",
                    color: active ? "#fff" : "#949ba4",
                    border: `1px solid ${active ? "#5865f2" : "rgba(255,255,255,0.1)"}`,
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
          {selected.size > 0 && (
            <div className="px-2.5 pb-2.5">
              <button
                onClick={() => onChange(new Set())}
                className="text-[11px] text-[#949ba4] hover:text-[#f2f3f5] transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface EditValues {
  questTitle: string;
  description: string;
  reward: string;
  endsDate: string;
}

function QuestDetailModal({ quest, onClose, onSave }: { quest: Quest; onClose: () => void; onSave: (id: number, values: EditValues) => void }) {
  const [editing, setEditing] = useState(false);
  const [editValues, setEditValues] = useState<EditValues>({
    questTitle: quest.questTitle,
    description: quest.description,
    reward: String(quest.reward),
    endsDate: quest.endsDate,
  });

  function handleSave() {
    onSave(quest.id, editValues);
    setEditing(false);
  }

  return (
    <div className="absolute inset-0 z-40 flex flex-col animate-modal-slide-in" style={{ backgroundColor: "#050a12" }}>
      <div className="shrink-0 flex items-center px-4 pt-4 pb-2">
        <button onClick={onClose} className="flex items-center gap-1.5 text-[#949ba4] hover:text-[#f2f3f5] transition-colors group">
          <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors group-hover:bg-white/10">
            <ChevronLeft className="w-5 h-5" />
          </div>
          <span className="text-[14px] font-medium">Back</span>
        </button>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="relative h-[240px] shrink-0 overflow-hidden">
          {quest.bannerContent}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="rounded-full opacity-20" style={{ width: 220, height: 220, border: `1px solid ${quest.questColor}`, boxShadow: `0 0 60px ${quest.questColor}40` }} />
            <div className="absolute rounded-full opacity-30" style={{ width: 140, height: 140, border: `1px solid ${quest.questColor}` }} />
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-bold" style={{ backgroundColor: "rgba(0,0,0,0.7)", border: `1px solid ${quest.questColor}44`, color: quest.questColor }}>
            <OrbsIcon size={14} />
            {quest.reward} Orbs
          </div>
          <div className="absolute top-3 right-3 text-[11px] font-bold px-2 py-1 rounded-md" style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "#949ba4" }}>
            Ends {quest.endsDate}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto discord-scrollbar px-6 py-5">
          <div className="mb-4">
            <p className="text-[11px] font-bold tracking-widest uppercase mb-1" style={{ color: quest.questColor }}>{quest.questTitle}</p>
            <h2 className="text-[22px] font-bold text-[#f2f3f5] mb-0.5">{quest.game}</h2>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map((i) => <Star key={i} className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]" />)}
              </div>
              <span className="text-[12px] text-[#949ba4]">by {quest.developer}</span>
            </div>
          </div>
          <div className="rounded-xl p-4 mb-5" style={{ backgroundColor: "#080e1a", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: quest.questColor }}>Description</p>
            <p className="text-[#dbdee1] text-[14px] leading-relaxed">{quest.description}</p>
          </div>
          {editing && (
            <div className="rounded-xl p-4 mb-5" style={{ backgroundColor: "#080e1a", border: `1px solid ${quest.questColor}33` }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: quest.questColor }}>Edit Server</p>
                <button onClick={() => setEditing(false)} className="w-6 h-6 rounded-full flex items-center justify-center text-[#949ba4] hover:text-[#f2f3f5] hover:bg-white/10 transition-all">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-[11px] text-[#949ba4] mb-1 block">Title</label>
                  <input value={editValues.questTitle} onChange={(e) => setEditValues((v) => ({ ...v, questTitle: e.target.value }))} className="w-full text-[13px] rounded-lg px-3 py-2 outline-none text-[#dbdee1]" style={{ backgroundColor: "#060b14", border: "1px solid rgba(255,255,255,0.1)" }} />
                </div>
                <div>
                  <label className="text-[11px] text-[#949ba4] mb-1 block">Description</label>
                  <textarea value={editValues.description} onChange={(e) => setEditValues((v) => ({ ...v, description: e.target.value }))} rows={3} className="w-full text-[13px] rounded-lg px-3 py-2 outline-none text-[#dbdee1] resize-none" style={{ backgroundColor: "#060b14", border: "1px solid rgba(255,255,255,0.1)" }} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-[#949ba4] mb-1 block">Reward (Orbs)</label>
                    <input type="number" value={editValues.reward} onChange={(e) => setEditValues((v) => ({ ...v, reward: e.target.value }))} className="w-full text-[13px] rounded-lg px-3 py-2 outline-none text-[#dbdee1]" style={{ backgroundColor: "#060b14", border: "1px solid rgba(255,255,255,0.1)" }} />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#949ba4] mb-1 block">Ends Date</label>
                    <input value={editValues.endsDate} onChange={(e) => setEditValues((v) => ({ ...v, endsDate: e.target.value }))} className="w-full text-[13px] rounded-lg px-3 py-2 outline-none text-[#dbdee1]" style={{ backgroundColor: "#060b14", border: "1px solid rgba(255,255,255,0.1)" }} />
                  </div>
                </div>
                <button onClick={handleSave} className="w-full py-2 rounded-lg text-[13px] font-semibold text-white transition-all hover:brightness-110 flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, #23a55a, #1a8b48)" }}>
                  <Check className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="shrink-0 px-6 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", backgroundColor: "#080e1a" }}>
          <button onClick={() => setEditing((v) => !v)} className="w-full py-2.5 rounded-lg text-[14px] font-semibold text-white transition-all hover:brightness-110 flex items-center justify-center gap-2" style={{ background: `linear-gradient(135deg, #1a1a2e, ${quest.questColor})` }}>
            <Zap className="w-4 h-4" />
            {editing ? "Cancel Edit" : "Edit"}
          </button>
        </div>
      </div>
    </div>
  );
}

function QuestCard({ quest, onOpen }: { quest: Quest; onOpen: () => void }) {
  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col transition-all duration-200"
      style={{ backgroundColor: "#060b14", border: "1px solid rgba(255,255,255,0.08)", willChange: "transform" }}
      onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 6px 24px rgba(0,0,0,0.4)"; }}
      onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = ""; el.style.boxShadow = ""; }}
    >
      {/* Banner */}
      <div className="relative h-[150px]" onClick={onOpen} style={{ cursor: "pointer" }}>
        {quest.bannerContent}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold" style={{ backgroundColor: "rgba(0,0,0,0.7)", border: `1px solid ${quest.questColor}44`, color: quest.questColor }}>
          <OrbsIcon size={11} />
          {quest.reward} Orbs
        </div>
        <div className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "#949ba4" }}>
          Ends {quest.endsDate}
        </div>
        <button onClick={(e) => { e.stopPropagation(); onOpen(); }} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
        {quest.status === "watching" && quest.timeLeft && (
          <div className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: "rgba(0,0,0,0.75)", color: quest.questColor }}>
            ▶ {quest.timeLeft}
          </div>
        )}
      </div>
      {/* Button only — no text */}
      <div className="px-3 py-3">
        <button
          onClick={onOpen}
          className="w-full py-2 rounded-md text-[13px] font-semibold text-white transition-all hover:brightness-110 flex items-center justify-center gap-1.5"
          style={{ background: `linear-gradient(135deg, #1a1a2e, ${quest.questColor})` }}
        >
          More
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

const allServers = [
  { id: 10, name: "Minecraft Hub", members: "128K", icon: "⛏️" },
  { id: 11, name: "Fortnite HQ", members: "94K", icon: "🎯" },
  { id: 12, name: "Rocket League Pro", members: "67K", icon: "🚀" },
  { id: 13, name: "Valorant Zone", members: "210K", icon: "🔫" },
  { id: 14, name: "Among Us Official", members: "55K", icon: "🕵️" },
];

export default function Quests() {
  const [activeTab, setActiveTab] = useState<"join" | "all">("join");
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [selectedQuestId, setSelectedQuestId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("Top Rating");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const selectedQuest = quests.find((q) => q.id === selectedQuestId) ?? null;

  function handleSave(id: number, values: EditValues) {
    setQuests((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, questTitle: values.questTitle, description: values.description, reward: Number(values.reward) || q.reward, endsDate: values.endsDate }
          : q
      )
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden relative" style={{ backgroundColor: "#0a1220" }}>
      {selectedQuest && (
        <QuestDetailModal quest={selectedQuest} onClose={() => setSelectedQuestId(null)} onSave={handleSave} />
      )}

      {/* Header */}
      <div className="h-12 shrink-0 flex items-center px-4 gap-6" style={{ borderBottom: "1px solid rgba(0,0,0,0.3)", backgroundColor: "#0a1220" }}>
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-[#949ba4]" />
          <span className="text-[#f2f3f5] font-semibold text-[16px]">Servers</span>
        </div>
        <div className="w-px h-5 bg-white/10" />
        <div className="flex items-center gap-1">
          <TabBtn label="Join Servers" isActive={activeTab === "join"} onClick={() => setActiveTab("join")} />
          <TabBtn label="All Servers" isActive={activeTab === "all"} onClick={() => setActiveTab("all")} />
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-[13px] font-bold text-[#f2f3f5]" style={{ backgroundColor: "#060b14", border: "1px solid rgba(255,255,255,0.1)" }}>
          <OrbsIcon size={16} />
          <span>2130</span>
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

            {/* Active tag pills */}
            {selectedTags.size > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {[...selectedTags].map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium text-white"
                    style={{ background: "#5865f2" }}
                  >
                    {tag}
                    <button onClick={() => { const n = new Set(selectedTags); n.delete(tag); setSelectedTags(n); }} className="hover:opacity-70 transition-opacity">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pb-4">
              {quests.map((quest, i) => (
                <div key={quest.id} className="animate-fade-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <QuestCard quest={quest} onOpen={() => setSelectedQuestId(quest.id)} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-[18px] font-bold text-[#f2f3f5] mb-4">All Servers</h2>
            <div className="flex flex-col gap-2">
              {allServers.map((s) => (
                <div key={s.id} className="flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-colors hover:bg-white/5" style={{ backgroundColor: "#060b14", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-[20px]" style={{ background: "linear-gradient(135deg, #1a1f3a, #2a2f5a)" }}>
                    {s.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-[#f2f3f5]">{s.name}</div>
                    <div className="text-[12px] text-[#949ba4]">{s.members} members</div>
                  </div>
                  <button className="px-3 py-1.5 rounded-md text-[12px] font-semibold text-white transition-all hover:brightness-110" style={{ background: "linear-gradient(135deg, #5865f2, #4752c4)" }}>
                    Join
                  </button>
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
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-[7px] text-[15px] font-medium transition-colors rounded-[4px]",
        isActive ? "text-[#f2f3f5] border-b-2 border-white rounded-none" : "text-[#949ba4] hover:text-[#dbdee1] hover:bg-white/5"
      )}
    >
      {label}
    </button>
  );
}
