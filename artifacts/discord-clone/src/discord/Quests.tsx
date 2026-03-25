import { useState } from "react";
import { cn } from "@/lib/utils";
import { InProgressPage } from "@/components/InProgress";

function QuestsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="#949ba4" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="#949ba4" />
      <circle cx="12" cy="4" r="1.5" fill="#949ba4" />
      <circle cx="12" cy="20" r="1.5" fill="#949ba4" />
      <circle cx="4" cy="12" r="1.5" fill="#949ba4" />
      <circle cx="20" cy="12" r="1.5" fill="#949ba4" />
    </svg>
  );
}

export default function QuestsPage() {
  const [tab, setTab] = useState<"all" | "claimed">("all");

  return (
    <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden" style={{ backgroundColor: "#000000" }}>
      <div
        className="h-12 shrink-0 flex items-center px-4 gap-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", backgroundColor: "#000000" }}
      >
        <div className="flex items-center gap-2 mr-3">
          <QuestsIcon />
        </div>
        <div className="flex items-center gap-0 flex-1">
          {(["all", "claimed"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "relative px-3 py-[14px] text-[14px] font-medium transition-all duration-150",
                tab === t ? "text-[#f2f3f5]" : "text-[#87898c] hover:text-[#dbdee1]"
              )}
            >
              {t === "all" ? "All Quests" : "Claimed Quests"}
              {tab === t && (
                <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-t-full" style={{ backgroundColor: "#5865f2" }} />
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] text-[13px] font-semibold transition-colors"
            style={{ backgroundColor: "#111111", color: "#87898c", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>
            0
          </button>
        </div>
      </div>
      <InProgressPage
        title="Quests"
        subtitle="Complete challenges to earn exclusive rewards and Discord credits. Quests are coming soon!"
      />
    </div>
  );
}
