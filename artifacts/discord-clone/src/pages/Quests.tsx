import { useState } from "react";
import { SlidersHorizontal, ChevronDown, MoreHorizontal, Target, ChevronLeft, Star, Zap, Check, X } from "lucide-react";
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
  {
    id: 1,
    game: "Pokémon GO",
    developer: "Niantic",
    questTitle: "POKÉMON GO QUEST",
    reward: 200,
    description: "Watch the video to win 200 Orbs!",
    endsDate: "3/21",
    status: "available",
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
    bannerContent: <ArknightsBanner />,
    questColor: "#66aaff",
  },
  {
    id: 4,
    game: "Valheim",
    developer: "Iron Gate",
    questTitle: "VALHEIM ASHLANDS QUEST",
    reward: 500,
    description: "Play Valheim for 30 minutes to earn 500 Orbs!",
    endsDate: "3/25",
    status: "available",
    bannerContent: <ValheimBanner />,
    questColor: "#7dde86",
  },
  {
    id: 5,
    game: "War Thunder",
    developer: "Gaijin Entertainment",
    questTitle: "WAR THUNDER VIDEO QUEST",
    reward: 200,
    description: "Watch the video to win 200 Orbs!",
    endsDate: "3/25",
    status: "available",
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

interface EditValues {
  questTitle: string;
  description: string;
  reward: string;
  endsDate: string;
}

function QuestDetailModal({
  quest,
  onClose,
  onSave,
}: {
  quest: Quest;
  onClose: () => void;
  onSave: (id: number, values: EditValues) => void;
}) {
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
      {/* Back button */}
      <div className="shrink-0 flex items-center px-4 pt-4 pb-2">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-[#949ba4] hover:text-[#f2f3f5] transition-colors group"
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors group-hover:bg-white/10">
            <ChevronLeft className="w-5 h-5" />
          </div>
          <span className="text-[14px] font-medium">Back</span>
        </button>
      </div>

      {/* Large banner */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="relative h-[240px] shrink-0 overflow-hidden">
          {quest.bannerContent}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="rounded-full opacity-20"
              style={{ width: 220, height: 220, border: `1px solid ${quest.questColor}`, boxShadow: `0 0 60px ${quest.questColor}40` }}
            />
            <div
              className="absolute rounded-full opacity-30"
              style={{ width: 140, height: 140, border: `1px solid ${quest.questColor}` }}
            />
          </div>
          <div
            className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-bold"
            style={{ backgroundColor: "rgba(0,0,0,0.7)", border: `1px solid ${quest.questColor}44`, color: quest.questColor }}
          >
            <OrbsIcon size={14} />
            {quest.reward} Orbs
          </div>
          <div
            className="absolute top-3 right-3 text-[11px] font-bold px-2 py-1 rounded-md"
            style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "#949ba4" }}
          >
            Ends {quest.endsDate}
          </div>
        </div>

        {/* Info panel */}
        <div className="flex-1 overflow-y-auto discord-scrollbar px-6 py-5">
          <div className="mb-4">
            <p className="text-[11px] font-bold tracking-widest uppercase mb-1" style={{ color: quest.questColor }}>
              {quest.questTitle}
            </p>
            <h2 className="text-[22px] font-bold text-[#f2f3f5] mb-0.5">{quest.game}</h2>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                ))}
              </div>
              <span className="text-[12px] text-[#949ba4]">by {quest.developer}</span>
            </div>
          </div>

          {/* Description */}
          <div
            className="rounded-xl p-4 mb-5"
            style={{ backgroundColor: "#080e1a", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: quest.questColor }}>
              Description
            </p>
            <p className="text-[#dbdee1] text-[14px] leading-relaxed">{quest.description}</p>
          </div>

          {/* Edit panel */}
          {editing && (
            <div
              className="rounded-xl p-4 mb-5"
              style={{ backgroundColor: "#080e1a", border: `1px solid ${quest.questColor}33` }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: quest.questColor }}>
                  Edit Quest
                </p>
                <button
                  onClick={() => setEditing(false)}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[#949ba4] hover:text-[#f2f3f5] hover:bg-white/10 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-[11px] text-[#949ba4] mb-1 block">Quest Title</label>
                  <input
                    value={editValues.questTitle}
                    onChange={(e) => setEditValues((v) => ({ ...v, questTitle: e.target.value }))}
                    className="w-full text-[13px] rounded-lg px-3 py-2 outline-none text-[#dbdee1] focus:ring-1"
                    style={{
                      backgroundColor: "#060b14",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#949ba4] mb-1 block">Description</label>
                  <textarea
                    value={editValues.description}
                    onChange={(e) => setEditValues((v) => ({ ...v, description: e.target.value }))}
                    rows={3}
                    className="w-full text-[13px] rounded-lg px-3 py-2 outline-none text-[#dbdee1] resize-none"
                    style={{
                      backgroundColor: "#060b14",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-[#949ba4] mb-1 block">Reward (Orbs)</label>
                    <input
                      type="number"
                      value={editValues.reward}
                      onChange={(e) => setEditValues((v) => ({ ...v, reward: e.target.value }))}
                      className="w-full text-[13px] rounded-lg px-3 py-2 outline-none text-[#dbdee1]"
                      style={{
                        backgroundColor: "#060b14",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#949ba4] mb-1 block">Ends Date</label>
                    <input
                      value={editValues.endsDate}
                      onChange={(e) => setEditValues((v) => ({ ...v, endsDate: e.target.value }))}
                      className="w-full text-[13px] rounded-lg px-3 py-2 outline-none text-[#dbdee1]"
                      style={{
                        backgroundColor: "#060b14",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    />
                  </div>
                </div>
                <button
                  onClick={handleSave}
                  className="w-full py-2 rounded-lg text-[13px] font-semibold text-white transition-all hover:brightness-110 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #23a55a, #1a8b48)" }}
                >
                  <Check className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="shrink-0 px-6 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", backgroundColor: "#080e1a" }}>
          <button
            onClick={() => setEditing((v) => !v)}
            className="w-full py-2.5 rounded-lg text-[14px] font-semibold text-white transition-all hover:brightness-110 flex items-center justify-center gap-2"
            style={{ background: `linear-gradient(135deg, #1a1a2e, ${quest.questColor})` }}
          >
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
      className="rounded-xl overflow-hidden flex flex-col transition-all duration-200 cursor-pointer"
      style={{
        backgroundColor: "#060b14",
        border: "1px solid rgba(255,255,255,0.08)",
        willChange: "transform",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(-2px)";
        el.style.boxShadow = "0 6px 24px rgba(0,0,0,0.4)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "";
        el.style.boxShadow = "";
      }}
    >
      {/* Banner */}
      <div className="relative h-[130px]" onClick={onOpen}>
        {quest.bannerContent}
        {/* Reward badge on banner */}
        <div
          className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold"
          style={{ backgroundColor: "rgba(0,0,0,0.7)", border: `1px solid ${quest.questColor}44`, color: quest.questColor }}
        >
          <OrbsIcon size={11} />
          {quest.reward} Orbs
        </div>
        {/* Ends badge */}
        <div
          className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "#949ba4" }}
        >
          Ends {quest.endsDate}
        </div>
        {/* More button */}
        <button
          onClick={(e) => { e.stopPropagation(); onOpen(); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        {/* Watching indicator */}
        {quest.status === "watching" && quest.timeLeft && (
          <div className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: "rgba(0,0,0,0.75)", color: quest.questColor }}>
            ▶ {quest.timeLeft}
          </div>
        )}
      </div>

      {/* Quest info */}
      <div className="px-3 pt-2.5 pb-1">
        <p className="text-[9px] font-bold tracking-widest uppercase truncate" style={{ color: quest.questColor }}>
          {quest.questTitle}
        </p>
        <p className="text-[14px] font-bold text-[#f2f3f5] leading-tight truncate mt-0.5">{quest.game}</p>
        <p className="text-[11px] text-[#949ba4] truncate mt-0.5">by {quest.developer}</p>
      </div>

      {/* CTA button */}
      <div className="px-3 pb-3 pt-2">
        <button
          onClick={onOpen}
          className="w-full py-1.5 rounded-md text-[13px] font-semibold text-white transition-all hover:brightness-110"
          style={{ background: `linear-gradient(135deg, #1a1a2e, ${quest.questColor})` }}
        >
          {quest.status === "watching" ? "Continue" : "View Quest"}
        </button>
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
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [selectedQuestId, setSelectedQuestId] = useState<number | null>(null);

  const selectedQuest = quests.find((q) => q.id === selectedQuestId) ?? null;

  function handleSave(id: number, values: EditValues) {
    setQuests((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              questTitle: values.questTitle,
              description: values.description,
              reward: Number(values.reward) || q.reward,
              endsDate: values.endsDate,
            }
          : q
      )
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden relative" style={{ backgroundColor: "#0a1220" }}>
      {selectedQuest && (
        <QuestDetailModal
          quest={selectedQuest}
          onClose={() => setSelectedQuestId(null)}
          onSave={handleSave}
        />
      )}

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
