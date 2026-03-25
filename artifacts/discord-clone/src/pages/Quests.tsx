import { useState } from "react";
import { Gift, Clock, CheckCircle2, ChevronRight, Star, Zap, Trophy, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Quest {
  id: number;
  game: string;
  gameLogo: string;
  title: string;
  description: string;
  reward: string;
  rewardIcon: string;
  progress: number;
  total: number;
  daysLeft: number;
  status: "active" | "completed" | "claimed";
  accentColor: string;
  category: "gaming" | "nitro" | "boost";
}

const QUESTS: Quest[] = [
  {
    id: 1,
    game: "Fortnite",
    gameLogo: "https://cdn2.unrealengine.com/fortnite-logo-760x760-a2a0c8f1b1b6.png",
    title: "Play Fortnite on Discord",
    description: "Join a Fortnite party through Discord Activity Launch and play 2 matches with friends.",
    reward: "1 Month Nitro Basic",
    rewardIcon: "🎮",
    progress: 1,
    total: 2,
    daysLeft: 12,
    status: "active",
    accentColor: "#00d4ff",
    category: "gaming",
  },
  {
    id: 2,
    game: "Midjourney",
    gameLogo: "",
    title: "Generate your first image",
    description: "Use Midjourney Bot in any Discord server to generate an AI image.",
    reward: "Discord Avatar Decoration",
    rewardIcon: "🖼️",
    progress: 1,
    total: 1,
    daysLeft: 0,
    status: "completed",
    accentColor: "#a855f7",
    category: "nitro",
  },
  {
    id: 3,
    game: "Valorant",
    gameLogo: "",
    title: "Link & Play Valorant",
    description: "Connect your Riot account and play 3 Valorant matches with your friends list.",
    reward: "Valorant Gun Buddy",
    rewardIcon: "🔫",
    progress: 0,
    total: 3,
    daysLeft: 21,
    status: "active",
    accentColor: "#ff4655",
    category: "gaming",
  },
  {
    id: 4,
    game: "Discord Nitro",
    gameLogo: "",
    title: "Boost a Server",
    description: "Boost any Discord server to help it unlock perks and earn exclusive profile rewards.",
    reward: "Animated Avatar Border",
    rewardIcon: "⚡",
    progress: 0,
    total: 1,
    daysLeft: 30,
    status: "active",
    accentColor: "#f59e0b",
    category: "boost",
  },
  {
    id: 5,
    game: "League of Legends",
    gameLogo: "",
    title: "Play with friends via Discord",
    description: "Start a League of Legends session via Discord's activity launcher and win 1 match.",
    reward: "Profile Badge",
    rewardIcon: "🏆",
    progress: 1,
    total: 1,
    daysLeft: 0,
    status: "claimed",
    accentColor: "#c89b3c",
    category: "gaming",
  },
];

const CATEGORY_ICONS: Record<Quest["category"], React.ReactNode> = {
  gaming: <Gamepad2 className="w-3 h-3" />,
  nitro: <Zap className="w-3 h-3" />,
  boost: <Star className="w-3 h-3" />,
};

const CATEGORY_COLORS: Record<Quest["category"], string> = {
  gaming: "#cc0000",
  nitro: "#f59e0b",
  boost: "#23a55a",
};

function QuestCard({ quest }: { quest: Quest }) {
  const pct = Math.min(100, Math.round((quest.progress / quest.total) * 100));
  const isCompleted = quest.status === "completed" || quest.status === "claimed";
  const isClaimed = quest.status === "claimed";

  return (
    <div
      className="rounded-[14px] flex flex-col overflow-hidden transition-all duration-200 group"
      style={{
        background: isClaimed
          ? "linear-gradient(135deg, #0a0000 0%, #0a0000 100%)"
          : `linear-gradient(135deg, ${quest.accentColor}12 0%, #0a0000 70%)`,
        border: `1px solid ${isClaimed ? "rgba(255,255,255,0.04)" : quest.accentColor + "30"}`,
        opacity: isClaimed ? 0.65 : 1,
      }}
      onMouseEnter={(e) => {
        if (!isClaimed) {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${quest.accentColor}22`;
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "";
      }}
    >
      <div className="px-4 pt-4 pb-3 flex flex-col gap-3">
        {/* Header row */}
        <div className="flex items-start gap-3">
          {/* Game logo / fallback */}
          <div
            className="w-12 h-12 rounded-[12px] flex items-center justify-center shrink-0 text-[22px] overflow-hidden"
            style={{ background: `${quest.accentColor}22`, border: `1px solid ${quest.accentColor}35` }}
          >
            {quest.gameLogo ? (
              <img src={quest.gameLogo} alt={quest.game} className="w-full h-full object-cover" />
            ) : (
              <span>{quest.rewardIcon}</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-[#f2f3f5] truncate">{quest.game}</span>
              <span
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide shrink-0"
                style={{ background: `${CATEGORY_COLORS[quest.category]}22`, color: CATEGORY_COLORS[quest.category], border: `1px solid ${CATEGORY_COLORS[quest.category]}35` }}
              >
                {CATEGORY_ICONS[quest.category]}
                {quest.category}
              </span>
            </div>
            <p className="text-[13px] font-bold text-[#f2f3f5] mt-0.5 leading-tight">{quest.title}</p>
          </div>

          {/* Status badge */}
          {isClaimed ? (
            <div className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: "#23a55a22", border: "1px solid #23a55a35" }}>
              <CheckCircle2 className="w-3 h-3 text-[#23a55a]" />
              <span className="text-[9px] font-bold text-[#23a55a] uppercase tracking-wide">Claimed</span>
            </div>
          ) : isCompleted ? (
            <button
              className="shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white transition-all hover:brightness-110 active:scale-95"
              style={{ background: `linear-gradient(135deg, ${quest.accentColor}cc, ${quest.accentColor})`, boxShadow: `0 4px 12px ${quest.accentColor}44` }}
            >
              Claim
            </button>
          ) : quest.daysLeft > 0 ? (
            <div className="shrink-0 flex items-center gap-1 text-[#5e6068]">
              <Clock className="w-3 h-3" />
              <span className="text-[10px] font-medium">{quest.daysLeft}d left</span>
            </div>
          ) : null}
        </div>

        {/* Description */}
        <p className="text-[11px] text-[#949ba4] leading-relaxed">{quest.description}</p>

        {/* Progress */}
        {!isClaimed && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-[#949ba4]">
                {quest.progress} / {quest.total} {quest.total === 1 ? "task" : "tasks"}
              </span>
              <span className="text-[10px] font-bold" style={{ color: isCompleted ? "#23a55a" : quest.accentColor }}>
                {pct}%
              </span>
            </div>
            <div className="h-[5px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: isCompleted
                    ? "#23a55a"
                    : `linear-gradient(90deg, ${quest.accentColor}99, ${quest.accentColor})`,
                  boxShadow: pct > 0 ? `0 0 6px ${quest.accentColor}66` : "none",
                }}
              />
            </div>
          </div>
        )}

        {/* Reward row */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-[8px] mt-1"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Gift className="w-3.5 h-3.5 shrink-0" style={{ color: quest.accentColor }} />
          <span className="text-[11px] font-medium text-[#b5bac1]">Reward:</span>
          <span className="text-[11px] font-bold text-[#f2f3f5] truncate">{quest.reward}</span>
          {!isClaimed && <ChevronRight className="w-3 h-3 text-[#4e5058] ml-auto shrink-0" />}
        </div>
      </div>
    </div>
  );
}

type FilterTab = "all" | "active" | "completed";

export default function Quests() {
  const [filter, setFilter] = useState<FilterTab>("all");

  const filtered = QUESTS.filter((q) => {
    if (filter === "active") return q.status === "active";
    if (filter === "completed") return q.status === "completed" || q.status === "claimed";
    return true;
  });

  const activeCount = QUESTS.filter((q) => q.status === "active").length;
  const completedCount = QUESTS.filter((q) => q.status === "completed" || q.status === "claimed").length;

  return (
    <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden" style={{ backgroundColor: "#0a0000" }}>
      {/* Header */}
      <div className="h-12 shrink-0 flex items-center px-4 gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", backgroundColor: "#0a0000" }}>
        <Trophy className="w-[18px] h-[18px] text-[#f59e0b]" />
        <span className="text-[#f2f3f5] font-semibold text-[16px]">Quests</span>
        {activeCount > 0 && (
          <span className="flex items-center justify-center min-w-[18px] h-[18px] rounded-full px-1 text-[10px] font-bold text-white" style={{ background: "#cc0000" }}>
            {activeCount}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto discord-scrollbar px-4 py-4">
        {/* Intro banner */}
        <div
          className="rounded-[16px] p-4 mb-5 flex items-center gap-4 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1e0a6e 0%, #0d1a55 50%, #080000 100%)", border: "1px solid rgba(88,101,242,0.25)" }}
        >
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 10% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 90% 30%, #fff 1px, transparent 1px)", backgroundSize: "35px 35px" }} />
          <div className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 relative" style={{ background: "linear-gradient(135deg, #cc0000, #8b0000)", boxShadow: "0 4px 20px #cc000044" }}>
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div className="relative min-w-0">
            <p className="text-[14px] font-bold text-[#f2f3f5]">Complete quests, earn rewards</p>
            <p className="text-[11px] text-[#949ba4] mt-0.5">Finish tasks to unlock exclusive Discord rewards, game items, and more.</p>
          </div>
          <div className="shrink-0 relative text-right">
            <p className="text-[22px] font-extrabold text-[#cc0000] leading-none">{completedCount}</p>
            <p className="text-[10px] text-[#4e5058] font-medium mt-0.5">completed</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 mb-4">
          {(["all", "active", "completed"] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                "px-3 py-1.5 rounded-md text-[12px] font-semibold capitalize transition-all",
                filter === tab
                  ? "text-[#f2f3f5] bg-white/10"
                  : "text-[#949ba4] hover:text-[#dbdee1] hover:bg-white/5"
              )}
            >
              {tab}
              {tab === "active" && activeCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold text-white" style={{ background: "#cc0000" }}>
                  {activeCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Quest list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-14 h-14 rounded-[16px] flex items-center justify-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <Trophy className="w-7 h-7 text-[#4e5058]" />
            </div>
            <p className="text-[14px] font-semibold text-[#87898c]">No quests here</p>
            <p className="text-[12px] text-[#5e6068]">Check back later for new rewards.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pb-4">
            {filtered.map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
