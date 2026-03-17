import { useState } from "react";
import { SlidersHorizontal, ChevronDown, MoreHorizontal, ArrowUpRight, Target } from "lucide-react";
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
  bannerBg: string;
  bannerContent: React.ReactNode;
  questColor: string;
}

function PokemonBanner() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, #1a6b3c 0%, #2d8a5c 30%, #89c7e0 70%, #b8dfef 100%)" }}
      />
    </div>
  );
}

function EveBanner() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, #1a0505 0%, #3d0808 40%, #6b1010 70%, #1a0505 100%)" }}
      />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 40%, rgba(180,20,20,0.4) 0%, transparent 60%)" }} />
    </div>
  );
}

function ArknightsBanner() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, #1a2540 0%, #253a6b 40%, #6b8fcc 70%, #f0d060 100%)" }}
      />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 60% 30%, rgba(240,208,96,0.2) 0%, transparent 50%)" }} />
    </div>
  );
}

function WweBanner() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a0505 30%, #2d0505 60%, #1a0a0a 100%)" }}
      />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(180,10,10,0.3) 0%, transparent 60%)" }} />
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

const quests: Quest[] = [
  {
    id: 1,
    game: "Pokémon GO",
    developer: "Niantic",
    questTitle: "POKÉMON GO QUEST",
    reward: 200,
    description: "Watch the video to win 200 Orbs!",
    endsDate: "3/21",
    status: "available",
    bannerBg: "",
    bannerContent: <PokemonBanner />,
    questColor: "#ffa53e",
  },
  {
    id: 2,
    game: "EVE Frontier",
    developer: "CCP Games",
    questTitle: "EVE FRONTIER VIDEO QUEST",
    reward: 200,
    description: "Watch the video to win 200 Orbs!",
    endsDate: "3/21",
    status: "watching",
    timeLeft: "01:27",
    bannerBg: "",
    bannerContent: <EveBanner />,
    questColor: "#ff6b6b",
  },
  {
    id: 3,
    game: "Arknights: Endfield",
    developer: "Gryphline",
    questTitle: "VERSION UPDATE: TANGTANG QUEST",
    reward: 700,
    description: "Play Arknights: Endfield for 15 minutes and win 700 Orbs.",
    endsDate: "3/23",
    status: "available",
    bannerBg: "",
    bannerContent: <ArknightsBanner />,
    questColor: "#66aaff",
  },
  {
    id: 4,
    game: "WWE 2K26",
    developer: "WWE 2K26",
    questTitle: "WWE 2K26 QUEST",
    reward: 200,
    description: "Watch the video to win 200 Orbs!",
    endsDate: "3/23",
    status: "watching",
    timeLeft: "02:00",
    bannerBg: "",
    bannerContent: <WweBanner />,
    questColor: "#e8c800",
  },
  {
    id: 5,
    game: "Valheim",
    developer: "Iron Gate",
    questTitle: "VALHEIM ASHLANDS QUEST",
    reward: 500,
    description: "Play Valheim for 30 minutes to earn 500 Orbs!",
    endsDate: "3/25",
    status: "available",
    bannerBg: "",
    bannerContent: <ValheimBanner />,
    questColor: "#7dde86",
  },
  {
    id: 6,
    game: "War Thunder",
    developer: "Gaijin Entertainment",
    questTitle: "WAR THUNDER VIDEO QUEST",
    reward: 200,
    description: "Watch the video to win 200 Orbs!",
    endsDate: "3/25",
    status: "available",
    bannerBg: "",
    bannerContent: <ThunderBanner />,
    questColor: "#a78bfa",
  },
];

function OrbsIcon({ size = 16 }: { size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #1d6ef5 0%, #9b59b6 100%)",
      }}
    >
      <div
        className="rounded-full bg-white/70"
        style={{ width: size * 0.4, height: size * 0.4 }}
      />
    </div>
  );
}

function QuestCard({ quest }: { quest: Quest }) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col transition-all duration-200"
      style={{
        backgroundColor: "#060b14",
        border: "1px solid rgba(255,255,255,0.08)",
        willChange: "transform",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 24px rgba(0,0,0,0.4)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = ""; }}
    >
      {/* Banner */}
      <div className="relative h-[150px]">
        {quest.bannerContent}
        <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
          <button className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CTA Button */}
      <div className="p-3">
        {quest.status === "watching" ? (
          <button
            className="w-full py-2 rounded-md text-[14px] font-semibold text-white transition-all hover:brightness-110 flex items-center justify-center gap-2"
            style={{ backgroundColor: "#1db954" }}
          >
            More
            <ArrowUpRight className="w-4 h-4" />
          </button>
        ) : accepted ? (
          <button
            className="w-full py-2 rounded-md text-[14px] font-semibold transition-all flex items-center justify-center gap-2"
            style={{ backgroundColor: "#1a9e47", color: "white" }}
          >
            More
            <ArrowUpRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setAccepted(true)}
            className="w-full py-2 rounded-md text-[14px] font-semibold text-white transition-all hover:brightness-110 flex items-center justify-center gap-2"
            style={{ backgroundColor: "#23a55a" }}
          >
            More
            <ArrowUpRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

const claimedQuests = [
  { id: 10, game: "Minecraft", reward: 200, claimedDate: "3/10", questTitle: "MINECRAFT VIDEO QUEST" },
  { id: 11, game: "Fortnite", reward: 500, claimedDate: "3/08", questTitle: "FORTNITE BUILDER QUEST" },
  { id: 12, game: "Rocket League", reward: 300, claimedDate: "3/05", questTitle: "ROCKET LEAGUE QUEST" },
];

export default function Quests() {
  const [activeTab, setActiveTab] = useState<"all" | "claimed">("all");

  return (
    <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden" style={{ backgroundColor: "#0a1220" }}>
      {/* Header */}
      <div
        className="h-12 shrink-0 flex items-center px-4 gap-6"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.3)", backgroundColor: "#0a1220" }}
      >
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-[#949ba4]" />
          <span className="text-[#f2f3f5] font-semibold text-[16px]">Quests</span>
        </div>
        <div className="w-px h-5 bg-white/10" />
        <div className="flex items-center gap-1">
          <TabBtn label="All Quests" isActive={activeTab === "all"} onClick={() => setActiveTab("all")} />
          <TabBtn label="Claimed Quests" isActive={activeTab === "claimed"} onClick={() => setActiveTab("claimed")} />
        </div>
        <div className="flex-1" />
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-full text-[13px] font-bold text-[#f2f3f5]"
          style={{ backgroundColor: "#060b14", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <OrbsIcon size={16} />
          <span>2130</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto discord-scrollbar px-5 py-4">
        {activeTab === "all" ? (
          <>
            {/* Controls row */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-bold text-[#f2f3f5]">Available Quests</h2>
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium text-[#dbdee1] transition-colors hover:bg-white/10"
                  style={{ backgroundColor: "#060b14", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  Suggested
                  <ChevronDown className="w-3.5 h-3.5 text-[#949ba4]" />
                </button>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium text-[#dbdee1] transition-colors hover:bg-white/10"
                  style={{ backgroundColor: "#060b14", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filters
                </button>
              </div>
            </div>

            {/* Quest grid */}
            <div className="grid grid-cols-2 gap-3 pb-4">
              {quests.map((quest, i) => (
                <div key={quest.id} className="animate-fade-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <QuestCard quest={quest} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-[18px] font-bold text-[#f2f3f5] mb-4">Claimed Quests</h2>
            {claimedQuests.length > 0 ? (
              <div className="flex flex-col gap-2">
                {claimedQuests.map((q) => (
                  <div
                    key={q.id}
                    className="flex items-center gap-4 px-4 py-3 rounded-lg"
                    style={{ backgroundColor: "#060b14", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "linear-gradient(135deg, #1db954, #1a8b48)" }}
                    >
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold text-[#1db954] tracking-wider">{q.questTitle}</div>
                      <div className="flex items-center gap-1.5 text-[14px] font-semibold text-[#f2f3f5]">
                        <span>Claimed</span>
                        <OrbsIcon size={13} />
                        <span>{q.reward} Discord Orbs</span>
                      </div>
                    </div>
                    <div className="text-[12px] text-[#949ba4] shrink-0">Claimed on {q.claimedDate}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Target className="w-16 h-16 text-[#949ba4] opacity-30 mb-4" />
                <p className="text-[#f2f3f5] font-semibold text-lg mb-1">No claimed quests yet</p>
                <p className="text-[#949ba4] text-sm">Complete quests to earn Discord Orbs!</p>
              </div>
            )}
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
        isActive
          ? "text-[#f2f3f5] border-b-2 border-white rounded-none"
          : "text-[#949ba4] hover:text-[#dbdee1] hover:bg-white/5"
      )}
    >
      {label}
    </button>
  );
}
