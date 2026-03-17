import { useState } from "react";
import { Search, Heart, ChevronDown, Shuffle, Info, ChevronLeft, Zap, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface AutomationItem {
  id: number;
  name: string;
  gradient: string;
  glowColor: string;
  ring?: string;
  description?: string;
  icon?: string;
  darkBg?: string;
}

const automationItems: AutomationItem[] = [
  {
    id: 1,
    name: "mentionitor",
    gradient: "from-[#001a3a] via-[#004695] to-[#002855]",
    glowColor: "#1CF8FF",
    ring: "border-cyan-400",
    description: "Grow your Discord server FAST with active joins and smart @ mentions\nPerfect adversting services — start boosting your members instantly!",
    icon: "/mentionitor-icon.png",
    darkBg: "#001a3a",
  },
  { id: 2,  name: "Automation", gradient: "from-[#1a0a2e] via-[#2d0a4e] to-[#0d0d1a]", glowColor: "#7c3aed", ring: "border-purple-600" },
  { id: 3,  name: "Automation", gradient: "from-[#1a0a2e] via-[#2d0a4e] to-[#0d0d1a]", glowColor: "#7c3aed", ring: "border-purple-600" },
  { id: 4,  name: "Automation", gradient: "from-[#1a0a2e] via-[#2d0a4e] to-[#0d0d1a]", glowColor: "#7c3aed", ring: "border-purple-600" },
  { id: 5,  name: "Automation", gradient: "from-[#1a0a2e] via-[#2d0a4e] to-[#0d0d1a]", glowColor: "#7c3aed", ring: "border-purple-600" },
  { id: 6,  name: "Automation", gradient: "from-[#1a0a2e] via-[#2d0a4e] to-[#0d0d1a]", glowColor: "#7c3aed", ring: "border-purple-600" },
  { id: 7,  name: "Automation", gradient: "from-[#1a0a2e] via-[#2d0a4e] to-[#0d0d1a]", glowColor: "#7c3aed", ring: "border-purple-600" },
  { id: 8,  name: "Automation", gradient: "from-[#1a0a2e] via-[#2d0a4e] to-[#0d0d1a]", glowColor: "#7c3aed", ring: "border-purple-600" },
  { id: 9,  name: "Automation", gradient: "from-[#1a0a2e] via-[#2d0a4e] to-[#0d0d1a]", glowColor: "#7c3aed", ring: "border-purple-600" },
];

function WumpusFace({ size = "md" }: { size?: "xs" | "sm" | "md" }) {
  const s = size === "xs" ? 18 : size === "sm" ? 24 : 36;
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
      <ellipse cx="20" cy="22" rx="16" ry="14" fill="#4a4b51" />
      <ellipse cx="20" cy="20" rx="12" ry="11" fill="#36373d" />
      <ellipse cx="14" cy="16" rx="4" ry="5" fill="#5865f2" opacity="0.8" />
      <ellipse cx="26" cy="16" rx="4" ry="5" fill="#5865f2" opacity="0.8" />
      <ellipse cx="14" cy="16" rx="2" ry="2.5" fill="white" />
      <ellipse cx="26" cy="16" rx="2" ry="2.5" fill="white" />
      <path d="M16 26 Q20 29 24 26" stroke="#5865f2" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
    </svg>
  );
}

function WumpusIcon({ item }: { item: AutomationItem }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 45%, ${item.glowColor}25 0%, transparent 65%)`,
        }}
      />
      <div className="relative flex flex-col items-center gap-1">
        <div
          className="w-20 h-20 rounded-full border-4 flex items-center justify-center bg-[#1a1b1e]"
          style={{
            borderColor: item.glowColor,
            boxShadow: `0 0 20px ${item.glowColor}50`,
          }}
        >
          <WumpusFace size="md" />
        </div>
        <div className="w-16 h-2 bg-white/15 rounded-full" />
        <div className="w-12 h-1.5 bg-white/10 rounded-full" />
      </div>
    </div>
  );
}

function ItemDetailModal({ item, onClose }: { item: AutomationItem; onClose: () => void }) {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="absolute inset-0 z-40 flex flex-col animate-modal-slide-in" style={{ backgroundColor: "#0d0d10" }}>
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

      {/* Full-screen preview */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Large preview image area */}
        <div
          className="flex-1 relative flex items-center justify-center"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, ${item.glowColor}30 0%, ${item.darkBg ?? "#1a0a2e"} 45%, #0d0d10 100%)`,
          }}
        >
          {/* Outer glow rings */}
          <div
            className="absolute rounded-full opacity-10"
            style={{ width: 340, height: 340, border: `1px solid ${item.glowColor}`, boxShadow: `0 0 60px ${item.glowColor}40` }}
          />
          <div
            className="absolute rounded-full opacity-20"
            style={{ width: 240, height: 240, border: `1px solid ${item.glowColor}` }}
          />

          {/* Main avatar */}
          <div className="relative flex flex-col items-center gap-3">
            <div
              className="w-36 h-36 rounded-full border-[5px] flex items-center justify-center overflow-hidden"
              style={{
                borderColor: item.glowColor,
                backgroundColor: item.darkBg ?? "#1a1b1e",
                boxShadow: `0 0 40px ${item.glowColor}60, inset 0 0 20px ${item.glowColor}15`,
              }}
            >
              {item.icon ? (
                <img src={item.icon} alt={item.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <svg width="72" height="72" viewBox="0 0 40 40" fill="none">
                  <ellipse cx="20" cy="22" rx="16" ry="14" fill="#4a4b51" />
                  <ellipse cx="20" cy="20" rx="12" ry="11" fill="#36373d" />
                  <ellipse cx="14" cy="16" rx="4" ry="5" fill="#5865f2" opacity="0.8" />
                  <ellipse cx="26" cy="16" rx="4" ry="5" fill="#5865f2" opacity="0.8" />
                  <ellipse cx="14" cy="16" rx="2" ry="2.5" fill="white" />
                  <ellipse cx="26" cy="16" rx="2" ry="2.5" fill="white" />
                  <path d="M16 26 Q20 29 24 26" stroke="#5865f2" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
                </svg>
              )}
            </div>
            <div className="w-24 h-2.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.15)" }} />
            <div className="w-16 h-2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
          </div>
        </div>

        {/* Info panel */}
        <div className="shrink-0 px-6 py-5" style={{ backgroundColor: "#111114", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-[22px] font-bold text-[#f2f3f5] mb-0.5">{item.name}</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                  ))}
                </div>
                <span className="text-[12px] text-[#949ba4]">4.8 · 2.3k reviews</span>
              </div>
            </div>
            <button
              onClick={() => setEnabled(v => !v)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold transition-all"
              style={{
                backgroundColor: enabled ? "rgba(35,165,90,0.15)" : "rgba(237,66,69,0.15)",
                color: enabled ? "#23a55a" : "#ed4245",
                border: `1px solid ${enabled ? "rgba(35,165,90,0.3)" : "rgba(237,66,69,0.3)"}`,
              }}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: enabled ? "#23a55a" : "#ed4245" }} />
              {enabled ? "On" : "Off"}
            </button>
          </div>

          <p className="text-[#949ba4] text-[13px] leading-relaxed mb-4 whitespace-pre-line">
            {item.description ?? "A sleek animated avatar style inspired by futuristic AI companions. Comes with a glowing ring effect that reacts to your voice activity."}
          </p>

          <button
            className="w-full py-2.5 rounded-lg text-[14px] font-semibold text-white transition-all hover:brightness-110 flex items-center justify-center gap-2"
            style={{ background: `linear-gradient(135deg, ${item.darkBg ?? "#5865f2"}, ${item.glowColor})` }}
          >
            <Zap className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

function AutomationCard({ item, onOpen }: { item: AutomationItem; onOpen?: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 group ring-1 ring-white/10 hover:ring-white/25"
      style={{ backgroundColor: "#111114" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpen}
    >
      {/* Card preview area */}
      <div
        className={cn("relative h-[188px] overflow-hidden", `bg-gradient-to-br ${item.gradient}`)}
      >
        {hovered && (
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ background: `radial-gradient(ellipse at 50% 50%, ${item.glowColor}20 0%, transparent 70%)` }}
          />
        )}
        <WumpusIcon item={item} />
      </div>

      {/* Card footer */}
      <div className="px-3 py-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-semibold text-[#f2f3f5]">{item.name}</span>
        </div>
      </div>
    </div>
  );
}

const sortOptions = ["For You", "Price: Low to High", "Price: High to Low", "Newest", "Ending Soon"];
const tabs = ["Featured", "Browse", "Orbs Exclusives"];

export default function Shop() {
  const [activeTab, setActiveTab] = useState("Featured");
  const [sortBy, setSortBy] = useState("For You");
  const [showSort, setShowSort] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [wishlist, setWishlist] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AutomationItem | null>(null);

  return (
    <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden relative" style={{ backgroundColor: "#0d0d10" }}>
      {selectedItem && (
        <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
      {/* Top Navigation Bar */}
      <div
        className="shrink-0 flex items-center px-5 gap-6 h-14 border-b"
        style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "#0d0d10" }}
      >
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #5865f2, #9b59b6)" }}
          >
            <WumpusFace size="xs" />
          </div>
        </div>

        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 text-[14px] font-medium transition-colors rounded-sm",
                activeTab === tab
                  ? "text-white border-b-2 border-white rounded-none"
                  : "text-[#949ba4] hover:text-[#dbdee1]"
              )}
            >
              {tab}
              {tab === "Browse" && <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-md w-52"
          style={{ backgroundColor: "#1e1f22" }}
        >
          <Search className="w-4 h-4 text-[#949ba4] shrink-0" />
          <input
            type="text"
            placeholder="Search the Shop"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="bg-transparent text-[13px] text-[#dbdee1] placeholder:text-[#949ba4] outline-none flex-1 w-full"
          />
        </div>

        <button
          onClick={() => setWishlist(!wishlist)}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#949ba4] hover:text-[#dbdee1] hover:bg-white/10 transition-colors"
        >
          <Heart className={cn("w-5 h-5", wishlist && "fill-[#ed4245] text-[#ed4245]")} />
        </button>

        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ backgroundColor: "#1e1f22", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }}
          >
            <div className="w-2 h-2 rounded-full bg-white/70" />
          </div>
          <span className="text-[13px] font-bold text-[#f2f3f5]">2130</span>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto discord-scrollbar px-6 py-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h2 className="text-[20px] font-bold text-[#f2f3f5]">Find your style</h2>
            <button className="text-[#949ba4] hover:text-[#dbdee1] transition-colors">
              <Info className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-[#949ba4]">Sort by</span>
              <div className="relative">
                <button
                  onClick={() => setShowSort(!showSort)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[14px] font-medium text-[#f2f3f5] hover:bg-white/10 transition-colors"
                  style={{ backgroundColor: "#1e1f22", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  {sortBy}
                  <ChevronDown className="w-4 h-4 text-[#949ba4]" />
                </button>
                {showSort && (
                  <div
                    className="absolute right-0 top-full mt-1 w-48 rounded-md overflow-hidden shadow-xl z-20"
                    style={{ backgroundColor: "#1e1f22", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    {sortOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setSortBy(opt); setShowSort(false); }}
                        className={cn(
                          "w-full text-left px-3 py-2 text-[14px] transition-colors",
                          sortBy === opt ? "text-[#5865f2] bg-[#5865f2]/10" : "text-[#dbdee1] hover:bg-white/5"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              className="flex items-center gap-2 px-4 py-1.5 rounded-md text-[14px] font-semibold text-[#f2f3f5] transition-colors hover:brightness-110"
              style={{ background: "linear-gradient(135deg, #5865f2, #9b59b6)" }}
            >
              <Shuffle className="w-4 h-4" />
              Shuffle!
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-3 pb-6">
          {automationItems
            .filter((item) =>
              searchValue === "" || item.name.toLowerCase().includes(searchValue.toLowerCase())
            )
            .map((item) => (
              <AutomationCard
                key={item.id}
                item={item}
                onOpen={() => setSelectedItem(item)}
              />
            ))}
        </div>

        {automationItems.filter((item) =>
          searchValue === "" || item.name.toLowerCase().includes(searchValue.toLowerCase())
        ).length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="w-12 h-12 text-[#949ba4] mb-4 opacity-50" />
            <p className="text-[#f2f3f5] font-semibold text-lg mb-1">No results found</p>
            <p className="text-[#949ba4] text-sm">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
}
