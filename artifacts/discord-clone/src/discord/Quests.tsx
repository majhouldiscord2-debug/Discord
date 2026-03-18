import { useState } from "react";
import { Target, ChevronDown, MoreHorizontal, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

function FloatingOrb({ x, y, size, opacity, delay }: { x: number; y: number; size: number; opacity: number; delay: number }) {
  return (
    <div className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`, top: `${y}%`, width: size, height: size, opacity,
        background: "linear-gradient(135deg, #5865f2, #9b59b6, #1d6ef5)",
        boxShadow: `0 0 ${size * 1.5}px rgba(88,101,242,0.4)`,
        animation: `float-orb ${2.5 + delay}s ease-in-out infinite alternate`,
        animationDelay: `${delay * 0.5}s`,
      }} />
  );
}

interface QuestItem {
  id: number;
  game: string;
  developer: string;
  questTitle: string;
  reward: number;
  description: string;
  banner: React.ReactNode;
  accentColor: string;
}

function PokeBanner() {
  return <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1a6b3c 0%, #2d8a5c 40%, #89c7e0 100%)" }} />;
}
function EveBanner() {
  return (
    <>
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1a0505 0%, #3d0808 50%, #6b1010 100%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 40%, rgba(180,20,20,0.4) 0%, transparent 60%)" }} />
    </>
  );
}
function ArkBanner() {
  return (
    <>
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1a2540 0%, #253a6b 50%, #6b8fcc 100%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 60% 30%, rgba(240,208,96,0.25) 0%, transparent 50%)" }} />
    </>
  );
}
function ValBanner() {
  return <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1a2010 0%, #2d4020 50%, #4a6030 100%)" }} />;
}

const QUESTS: QuestItem[] = [
  { id: 1, game: "Pokémon GO", developer: "Niantic", questTitle: "POKÉMON GO QUEST", reward: 200, description: "Watch the video to win 200 Orbs!", banner: <PokeBanner />, accentColor: "#ffa53e" },
  { id: 2, game: "EVE Frontier", developer: "CCP Games", questTitle: "EVE FRONTIER VIDEO QUEST", reward: 200, description: "Watch the video to win 200 Orbs!", banner: <EveBanner />, accentColor: "#ff6b6b" },
  { id: 3, game: "Arknights: Endfield", developer: "Gryphline", questTitle: "VERSION UPDATE: TANGTANG", reward: 700, description: "Play Arknights: Endfield for 15 minutes to win 700 Orbs.", banner: <ArkBanner />, accentColor: "#66aaff" },
  { id: 4, game: "Valheim", developer: "Iron Gate", questTitle: "VALHEIM ASHLANDS QUEST", reward: 500, description: "Play Valheim for 30 minutes to earn 500 Orbs!", banner: <ValBanner />, accentColor: "#7dde86" },
];

const SUGGEST_OPTIONS = ["Suggested", "New", "High Reward"];

function OrbsIcon({ size = 14 }: { size?: number }) {
  return (
    <div className="rounded-full flex items-center justify-center shrink-0" style={{ width: size, height: size, background: "linear-gradient(135deg, #1d6ef5 0%, #9b59b6 100%)" }}>
      <div className="rounded-full bg-white/70" style={{ width: size * 0.4, height: size * 0.4 }} />
    </div>
  );
}

export default function QuestsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "claimed">("all");
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggest, setSuggest] = useState("Suggested");

  return (
    <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden" style={{ backgroundColor: "#0a1220" }}>
      {/* Header */}
      <div className="h-12 shrink-0 flex items-center px-4 gap-2" style={{ borderBottom: "1px solid rgba(0,0,0,0.3)", backgroundColor: "#0a1220" }}>
        <Target className="w-5 h-5 text-[#949ba4]" />
        <span className="text-[#f2f3f5] font-semibold text-[16px] mr-2">Quests</span>
        <div className="w-px h-5 bg-white/10" />
        <div className="flex items-center gap-1 ml-2">
          <TabBtn label="All Quests" isActive={activeTab === "all"} onClick={() => setActiveTab("all")} />
          <TabBtn label="Claimed Quests" isActive={activeTab === "claimed"} onClick={() => setActiveTab("claimed")} />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto discord-scrollbar">
        {activeTab === "all" ? (
          <>
            {/* Hero Banner */}
            <div className="relative w-full overflow-hidden" style={{ minHeight: 220 }}>
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 40% 50%, #1a0a2e 0%, #0a0a1a 50%, #060b14 100%)" }} />
              <FloatingOrb x={60} y={10} size={80} opacity={0.7} delay={0} />
              <FloatingOrb x={75} y={50} size={120} opacity={0.5} delay={1} />
              <FloatingOrb x={85} y={20} size={50} opacity={0.6} delay={0.5} />
              <FloatingOrb x={55} y={60} size={35} opacity={0.5} delay={1.5} />
              <FloatingOrb x={90} y={70} size={65} opacity={0.4} delay={0.8} />

              <div className="relative z-10 px-10 py-10">
                <h1 className="text-[36px] font-black text-white leading-tight tracking-tight mb-2">
                  INTRODUCING DISCORD<br />ORBS
                </h1>
                <p className="text-[15px] text-[#b5bac1] mb-6">Reward Your Play. Earn through Quests. Spend in the Shop.</p>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 rounded-md text-[14px] font-semibold text-white transition-all hover:bg-white/20"
                    style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(8px)" }}>
                    Explore Quests
                  </button>
                  <button className="px-4 py-2 rounded-md text-[14px] font-semibold text-[#dbdee1] transition-all hover:bg-white/10"
                    style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)" }}>
                    Discord Orbs Terms
                  </button>
                </div>
              </div>
            </div>

            {/* Available Quests */}
            <div className="px-5 py-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[18px] font-bold text-[#f2f3f5]">Available Quests</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button onClick={() => setSuggestOpen((v) => !v)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium text-[#dbdee1] transition-colors hover:bg-white/10"
                      style={{ backgroundColor: "#060b14", border: "1px solid rgba(255,255,255,0.1)" }}>
                      {suggest}
                      <ChevronDown className={cn("w-3.5 h-3.5 text-[#949ba4] transition-transform", suggestOpen && "rotate-180")} />
                    </button>
                    {suggestOpen && (
                      <div className="absolute right-0 top-full mt-1 z-50 rounded-lg overflow-hidden py-1 min-w-[150px]"
                        style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                        {SUGGEST_OPTIONS.map((opt) => (
                          <button key={opt} onClick={() => { setSuggest(opt); setSuggestOpen(false); }}
                            className={cn("w-full text-left px-4 py-2 text-[13px] font-medium transition-colors",
                              suggest === opt ? "text-[#5865f2] bg-[#5865f2]/10" : "text-[#dbdee1] hover:bg-white/8")}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium text-[#dbdee1] transition-colors hover:bg-white/10"
                    style={{ backgroundColor: "#060b14", border: "1px solid rgba(255,255,255,0.1)" }}>
                    Filters <SlidersHorizontal className="w-3.5 h-3.5 text-[#949ba4]" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-4">
                {QUESTS.map((q) => (
                  <QuestCard key={q.id} quest={q} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-20 gap-3">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2" style={{ background: "rgba(88,101,242,0.15)", border: "1px solid rgba(88,101,242,0.3)" }}>
              <Target className="w-7 h-7 text-[#5865f2]" />
            </div>
            <p className="text-[#f2f3f5] text-[16px] font-bold">No Claimed Quests Yet</p>
            <p className="text-[#949ba4] text-[13px]">Complete quests to earn Discord Orbs!</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float-orb {
          from { transform: translateY(0px) scale(1); }
          to   { transform: translateY(-12px) scale(1.05); }
        }
      `}</style>
    </div>
  );
}

function QuestCard({ quest }: { quest: QuestItem }) {
  return (
    <div className="rounded-xl overflow-hidden transition-all duration-200 cursor-pointer"
      style={{ backgroundColor: "#060b14", border: "1px solid rgba(255,255,255,0.08)" }}
      onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 6px 24px rgba(0,0,0,0.4)"; }}
      onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = ""; el.style.boxShadow = ""; }}>
      {/* Banner */}
      <div className="relative h-[130px] overflow-hidden">
        {quest.banner}
        <button className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      {/* Info */}
      <div className="px-3 pt-3 pb-3">
        <div className="flex items-center gap-1 mb-1">
          <div className="w-3 h-3 rounded-full shrink-0" style={{ background: "linear-gradient(135deg, #23a55a, #1a8b48)" }} />
          <span className="text-[11px] text-[#949ba4]">Promoted by <span className="text-[#23a55a] font-semibold">{quest.developer}</span></span>
        </div>
        <div className="flex items-center gap-2 mt-1.5 mb-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, #1a1a2e, ${quest.accentColor})` }}>
            <OrbsIcon size={14} />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase leading-tight" style={{ color: quest.accentColor }}>{quest.questTitle}</p>
            <div className="text-[12px] font-bold text-white flex items-center gap-1">
              Claim <OrbsIcon size={10} /> {quest.reward} Discord Orbs
            </div>
            <p className="text-[11px] text-[#949ba4]">{quest.description}</p>
          </div>
        </div>
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
