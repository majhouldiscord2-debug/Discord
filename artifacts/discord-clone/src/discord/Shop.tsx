import { useState } from "react";
import { ShoppingBag, Search, Heart, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { InProgressPage } from "@/components/InProgress";

export default function ShopPage() {
  const [tab, setTab] = useState<"featured" | "browse" | "orbs">("featured");
  const [search, setSearch] = useState("");

  return (
    <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden" style={{ backgroundColor: "#000000" }}>
      <div
        className="h-12 shrink-0 flex items-center px-4 gap-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", backgroundColor: "#000000" }}
      >
        <div className="flex items-center gap-2 mr-1">
          <ShoppingBag className="w-5 h-5 text-[#949ba4]" />
        </div>
        <div className="flex items-center gap-0 flex-1">
          {(["featured", "browse", "orbs"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "relative px-3 py-[14px] text-[14px] font-medium transition-all duration-150 flex items-center gap-1",
                tab === t ? "text-[#f2f3f5]" : "text-[#87898c] hover:text-[#dbdee1]"
              )}
            >
              {t === "featured" ? "Featured" : t === "browse" ? (
                <span className="flex items-center gap-0.5">Browse <ChevronDown className="w-3.5 h-3.5 mt-px" /></span>
              ) : "Orbs Exclusives"}
              {tab === t && (
                <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-t-full" style={{ backgroundColor: "#f47fff" }} />
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-[6px]"
            style={{ backgroundColor: "#111111", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Search className="w-3.5 h-3.5 text-[#5e6068]" />
            <input
              type="text"
              placeholder="Search the Shop"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[13px] text-[#dbdee1] placeholder:text-[#5e6068] outline-none w-[120px]"
            />
          </div>
          <button className="w-8 h-8 rounded-[6px] flex items-center justify-center transition-colors hover:bg-white/8" style={{ backgroundColor: "#111111", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Heart className="w-4 h-4 text-[#87898c]" />
          </button>
          <button
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] text-[13px] font-semibold"
            style={{ backgroundColor: "#111111", color: "#87898c", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            0
          </button>
        </div>
      </div>
      <InProgressPage
        title="Shop"
        subtitle="The Discord Shop is coming soon! Browse avatar decorations, profile effects, and exclusive items."
      />
    </div>
  );
}
