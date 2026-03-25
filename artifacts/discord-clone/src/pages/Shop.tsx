import { useState } from "react";
import { Search, Heart, ChevronDown, ArrowRight, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

function OrbsIcon({ size = 16 }: { size?: number }) {
  return (
    <div className="rounded-full flex items-center justify-center shrink-0" style={{ width: size, height: size, background: "linear-gradient(135deg, #cc0000 0%, #8b0000 100%)" }}>
      <div className="rounded-full bg-white/70" style={{ width: size * 0.4, height: size * 0.4 }} />
    </div>
  );
}

const BROWSE_ITEMS = ["Profile Effects", "Avatar Decorations", "Themes", "Sound Packs", "Sticker Packs"];

const FEATURED_ITEMS = [
  { name: "Lucky Bunny Bundle", price: "€12.99", discount: "-28%", color: "#1a3a2a" },
  { name: "Lucky Era Bundle",   price: "€12.99", discount: "-28%", color: "#1a2a3a" },
  { name: "Lucky Era",          price: "€4.99",  discount: null,   color: "#2a1a3a" },
  { name: "Lucky Bunny",        price: "€4.99",  discount: null,   color: "#3a1a2a" },
];

const LIMITED_ITEMS = [
  { name: "Checkpoint Cache Bundle", badge: "LIMITED TIME", color1: "#6b21a8", color2: "#1a0a2e" },
  { name: "Gothica Collection",      badge: "LIMITED TIME", color1: "#1a0a0a", color2: "#3a0a0a" },
];

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState<"featured" | "browse" | "orbs">("featured");
  const [browseOpen, setBrowseOpen] = useState(false);

  return (
    <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden" style={{ backgroundColor: "#0a0000" }}>
      {/* Top bar */}
      <div className="h-12 shrink-0 flex items-center px-4 gap-2" style={{ borderBottom: "1px solid rgba(0,0,0,0.3)", backgroundColor: "#0a0000" }}>
        <ShoppingBag className="w-5 h-5 text-[#949ba4]" />
        <span className="text-[#f2f3f5] font-semibold text-[16px] mr-2">Shop</span>
        <div className="w-px h-5 bg-white/10" />
        <div className="flex items-center gap-1 ml-2">
          <TabBtn label="Featured" isActive={activeTab === "featured"} onClick={() => setActiveTab("featured")} />
          <div className="relative">
            <button
              onClick={() => setBrowseOpen((v) => !v)}
              className={cn(
                "flex items-center gap-1 px-3 py-[7px] text-[15px] font-medium transition-colors rounded-[4px]",
                activeTab === "browse" ? "text-[#f2f3f5] border-b-2 border-white rounded-none" : "text-[#949ba4] hover:text-[#dbdee1] hover:bg-white/5"
              )}
            >
              Browse <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", browseOpen && "rotate-180")} />
            </button>
            {browseOpen && (
              <div className="absolute left-0 top-full mt-1 z-50 rounded-lg overflow-hidden py-1 min-w-[180px]"
                style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                {BROWSE_ITEMS.map((item) => (
                  <button key={item} onClick={() => { setActiveTab("browse"); setBrowseOpen(false); }}
                    className="w-full text-left px-4 py-2 text-[13px] font-medium text-[#dbdee1] hover:bg-white/8 transition-colors">
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
          <TabBtn label="Orbs Exclusives" isActive={activeTab === "orbs"} onClick={() => setActiveTab("orbs")} />
        </div>
        <div className="flex-1" />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4e5058]" />
          <input
            placeholder="Search the Shop"
            className="pl-9 pr-4 py-1.5 rounded-md text-[13px] text-[#dbdee1] outline-none placeholder:text-[#4e5058]"
            style={{ backgroundColor: "#060000", border: "1px solid rgba(255,255,255,0.1)", width: 200 }}
          />
        </div>
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-[#949ba4] hover:text-[#f2f3f5] hover:bg-white/10 transition-colors">
          <Heart className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-bold text-[#f2f3f5]"
          style={{ backgroundColor: "#060000", border: "1px solid rgba(255,255,255,0.1)" }}>
          <OrbsIcon size={16} />
          <span>2130</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto discord-scrollbar">
        {/* Hero Banner */}
        <div className="relative w-full overflow-hidden" style={{ minHeight: 200 }}>
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0d5c2e 0%, #1a7a40 30%, #2ecc6a 60%, #a8e6cf 100%)" }} />
          <div className="absolute inset-0 flex items-center justify-between px-12 py-8">
            <div>
              <h1 className="text-[42px] font-black text-white leading-none tracking-tight drop-shadow-lg">
                FEELING<br />LUCKY
              </h1>
              <div className="mt-4">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-bold text-white transition-all hover:brightness-110"
                  style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(8px)" }}>
                  Shop the Collection <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex gap-3 overflow-hidden">
              {FEATURED_ITEMS.map((item, i) => (
                <div key={i} className="w-[130px] shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-105"
                  style={{ backgroundColor: item.color, border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
                  <div className="h-[100px] flex items-center justify-center text-[36px]">
                    🐇
                  </div>
                  <div className="px-2.5 pb-2.5 pt-1">
                    <p className="text-[11px] font-semibold text-[#dbdee1] leading-tight truncate">{item.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[12px] font-bold text-[#f2f3f5]">{item.price}</span>
                      {item.discount && (
                        <span className="text-[10px] font-bold px-1 py-0.5 rounded" style={{ background: "#23a55a", color: "#fff" }}>{item.discount}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className="w-[40px] shrink-0 flex items-center justify-center">
                <button className="w-8 h-8 rounded-full flex items-center justify-center bg-black/40 text-white hover:bg-black/60 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Limited Time Section */}
        <div className="px-5 py-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] font-bold tracking-widest uppercase px-2 py-0.5 rounded" style={{ background: "#f59e0b", color: "#000" }}>LIMITED TIME</span>
            <span className="text-[16px] font-bold text-[#f2f3f5]">Featured Drops</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {LIMITED_ITEMS.map((item, i) => (
              <div key={i} className="rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02]"
                style={{ background: `linear-gradient(135deg, ${item.color1}, ${item.color2})`, border: "1px solid rgba(255,255,255,0.1)", height: 160 }}>
                <div className="h-full flex flex-col justify-end p-4">
                  <span className="text-[10px] font-bold tracking-widest uppercase mb-1 px-2 py-0.5 rounded self-start"
                    style={{ background: "#f59e0b", color: "#000" }}>{item.badge}</span>
                  <p className="text-[16px] font-bold text-white">{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Customization Section */}
        <div className="px-5 pb-6">
          <h2 className="text-[16px] font-bold text-[#f2f3f5] mb-4">Profile Customization</h2>
          <div className="grid grid-cols-4 gap-3">
            {["Avatar Decorations", "Profile Effects", "Themes", "Sound Packs"].map((label, i) => (
              <div key={i} className="rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-[1.03]"
                style={{ backgroundColor: ["#1a0505","#1a2a1a","#2a1a1a","#1a2a2a"][i], border: "1px solid rgba(255,255,255,0.08)", height: 100 }}>
                <div className="h-full flex flex-col items-center justify-center gap-2 p-3">
                  <span className="text-[24px]">{"🎨🌟✨🎵".split("").filter((_,j) => j === i)[0] || "🛒"}</span>
                  <p className="text-[11px] font-semibold text-[#dbdee1] text-center leading-tight">{label}</p>
                </div>
              </div>
            ))}
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
