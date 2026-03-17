import { useState } from "react";
import { Search, Heart, ChevronDown, Shuffle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShopItem {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  daysLeft?: number;
  gradient: string;
  glowColor?: string;
  swatches?: string[];
  ring?: string;
  featured?: boolean;
  accessory?: string;
}

const shopItems: ShopItem[] = [
  {
    id: 1,
    name: "Disco",
    price: "$3.99",
    daysLeft: 2,
    gradient: "from-[#1a0a2e] via-[#2d0a4e] to-[#0d0d1a]",
    ring: "border-purple-600",
    glowColor: "#7c3aed",
    accessory: "🕶️",
  },
  {
    id: 2,
    name: "Neon Glow",
    price: "$4.99",
    gradient: "from-[#1a0020] via-[#2d0040] to-[#0d0010]",
    ring: "border-pink-500",
    glowColor: "#ec4899",
    swatches: ["#ec4899", "#8b5cf6", "#06b6d4"],
    featured: true,
  },
  {
    id: 3,
    name: "Donut",
    price: "$3.99",
    daysLeft: 2,
    gradient: "from-[#001a1a] via-[#003333] to-[#000d1a]",
    ring: "border-cyan-400",
    glowColor: "#22d3ee",
    accessory: "🍩",
  },
  {
    id: 4,
    name: "Drifting Glow",
    price: "$4.99",
    gradient: "from-[#120020] via-[#1e0040] to-[#0a0010]",
    glowColor: "#7c3aed",
    swatches: ["#a855f7", "#f97316", "#22c55e"],
  },
  {
    id: 5,
    name: "Cosmic Storm",
    price: "$4.99",
    gradient: "from-[#050520] via-[#0d1040] to-[#020215]",
    glowColor: "#3b82f6",
  },
  {
    id: 6,
    name: "Drifting Glow Bundle",
    price: "$8.99",
    originalPrice: "$11.99",
    discount: "-25%",
    gradient: "from-[#0d0020] via-[#180035] to-[#080015]",
    glowColor: "#5865f2",
    ring: "border-indigo-500",
  },
  {
    id: 7,
    name: "Synthwave",
    price: "$4.99",
    gradient: "from-[#1a0030] via-[#2d0050] to-[#0d0020]",
    ring: "border-pink-400",
    glowColor: "#f472b6",
  },
  {
    id: 8,
    name: "Pixel Mage",
    price: "$3.99",
    daysLeft: 2,
    gradient: "from-[#001020] via-[#002040] to-[#000815]",
    glowColor: "#38bdf8",
    accessory: "🪄",
  },
  {
    id: 9,
    name: "Aurora",
    price: "$5.99",
    gradient: "from-[#050a20] via-[#0a1540] to-[#030810]",
    glowColor: "#818cf8",
    swatches: ["#818cf8", "#34d399", "#f472b6"],
  },
];

function WumpusIcon({ item }: { item: ShopItem }) {
  const isBundle = item.name.includes("Bundle");

  if (isBundle) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 60% 50%, ${item.glowColor}18 0%, transparent 70%)`,
          }}
        />
        <div className="relative flex items-end gap-2">
          <div className="w-20 h-24 rounded-xl bg-[#1a1b1e] border border-white/10 shadow-xl flex flex-col items-center justify-center gap-2 -rotate-6 z-10">
            <div
              className="w-12 h-12 rounded-full border-4 flex items-center justify-center"
              style={{ borderColor: item.glowColor, boxShadow: `0 0 12px ${item.glowColor}60` }}
            >
              <WumpusFace size="sm" />
            </div>
            <div className="w-8 h-1.5 bg-white/20 rounded-full" />
            <div className="w-6 h-1 bg-white/10 rounded-full" />
          </div>
          <div className="w-16 h-20 rounded-xl bg-[#1a1b1e] border border-white/10 shadow-xl flex flex-col items-center justify-center gap-2 rotate-6">
            <div
              className="w-10 h-10 rounded-full border-4 flex items-center justify-center"
              style={{ borderColor: item.glowColor }}
            >
              <WumpusFace size="xs" />
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            borderColor: item.glowColor || "#5865f2",
            boxShadow: `0 0 20px ${item.glowColor || "#5865f2"}50`,
          }}
        >
          <WumpusFace size="md" />
          {item.accessory && (
            <span className="absolute -bottom-2 -right-2 text-xl">{item.accessory}</span>
          )}
        </div>
        <div className="w-16 h-2 bg-white/15 rounded-full" />
        <div className="w-12 h-1.5 bg-white/10 rounded-full" />
      </div>
    </div>
  );
}

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

function ShopCard({ item }: { item: ShopItem }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 group",
        item.featured
          ? "ring-2 ring-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)]"
          : "ring-1 ring-white/10 hover:ring-white/25"
      )}
      style={{ backgroundColor: "#111114" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card preview area */}
      <div
        className={cn(
          "relative h-[188px] overflow-hidden",
          `bg-gradient-to-br ${item.gradient}`
        )}
      >
        {/* Animated glow on hover */}
        {hovered && item.glowColor && (
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              background: `radial-gradient(ellipse at 50% 50%, ${item.glowColor}20 0%, transparent 70%)`,
            }}
          />
        )}

        {/* Featured border effect */}
        {item.featured && (
          <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 via-transparent to-transparent" />
        )}

        {/* Days left badge */}
        {item.daysLeft && (
          <div className="absolute top-3 left-3 z-10 bg-black/70 text-white text-[11px] font-bold px-2 py-0.5 rounded-full border border-white/20">
            {item.daysLeft} DAYS LEFT
          </div>
        )}

        {/* Item visual */}
        <WumpusIcon item={item} />
      </div>

      {/* Card footer */}
      <div className="px-3 py-2.5">
        <div className="text-[14px] font-semibold text-[#f2f3f5] mb-1">{item.name}</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <NitroIcon />
            <span className="text-[13px] font-semibold text-[#f2f3f5]">{item.price}</span>
            {item.discount && (
              <span className="text-[12px] font-bold text-[#23a55a]">{item.discount}</span>
            )}
          </div>
          {item.swatches && (
            <div className="flex items-center gap-1">
              {item.swatches.map((color, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: color }}
                />
              ))}
              <span className="text-[11px] text-[#949ba4] ml-0.5">+</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NitroIcon() {
  return (
    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#5865f2] to-[#9b59b6] flex items-center justify-center shrink-0">
      <div className="w-2 h-2 rounded-full bg-white/80" />
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

  return (
    <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden" style={{ backgroundColor: "#0d0d10" }}>
      {/* Top Navigation Bar */}
      <div
        className="shrink-0 flex items-center px-5 gap-6 h-14 border-b"
        style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "#0d0d10" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #5865f2, #9b59b6)" }}
          >
            <WumpusFace size="xs" />
          </div>
        </div>

        {/* Tabs */}
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

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
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

        {/* Wishlist */}
        <button
          onClick={() => setWishlist(!wishlist)}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#949ba4] hover:text-[#dbdee1] hover:bg-white/10 transition-colors"
        >
          <Heart className={cn("w-5 h-5", wishlist && "fill-[#ed4245] text-[#ed4245]")} />
        </button>

        {/* Orbs balance */}
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
        {/* Header row */}
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
                          sortBy === opt
                            ? "text-[#5865f2] bg-[#5865f2]/10"
                            : "text-[#dbdee1] hover:bg-white/5"
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
              style={{
                background: "linear-gradient(135deg, #5865f2, #9b59b6)",
              }}
            >
              <Shuffle className="w-4 h-4" />
              Shuffle!
            </button>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-3 gap-3 pb-6">
          {shopItems
            .filter((item) =>
              searchValue === "" || item.name.toLowerCase().includes(searchValue.toLowerCase())
            )
            .map((item) => (
              <ShopCard key={item.id} item={item} />
            ))}
        </div>

        {shopItems.filter((item) =>
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
