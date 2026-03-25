import { useState } from "react";
import { Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { InProgressPage } from "@/components/InProgress";

function NitroIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="12" rx="11" ry="5" stroke="white" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.5" fill="white" />
    </svg>
  );
}

const tabs = ["Home", "What's New", "Best of Nitro", "Plans", "Compare"] as const;
type Tab = typeof tabs[number];

export default function NitroPage() {
  const [tab, setTab] = useState<Tab>("Home");

  return (
    <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden" style={{ backgroundColor: "#000000" }}>
      <div
        className="h-12 shrink-0 flex items-center px-4 gap-0 relative overflow-hidden"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "linear-gradient(90deg, #8b44f0 0%, #c44aff 40%, #ff44cc 80%, #ff6b9d 100%)",
        }}
      >
        <div className="flex items-center gap-2 mr-4 shrink-0">
          <NitroIcon />
        </div>
        <div className="flex items-center gap-0 flex-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "relative px-3 py-[14px] text-[14px] font-medium transition-all duration-150 whitespace-nowrap",
                tab === t ? "text-white" : "text-white/60 hover:text-white/90"
              )}
            >
              {t}
              {tab === t && (
                <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-t-full bg-white" />
              )}
            </button>
          ))}
        </div>
        <button
          className="flex items-center gap-2 px-4 py-1.5 rounded-[6px] text-[13px] font-bold transition-all duration-150 shrink-0 hover:opacity-90 active:scale-95"
          style={{
            background: "rgba(0,0,0,0.25)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.2)",
            backdropFilter: "blur(4px)",
          }}
        >
          <Gift className="w-4 h-4" />
          Gift Nitro
        </button>
      </div>
      <InProgressPage
        title="Nitro"
        subtitle="Unlock premium Discord features with Nitro. Bigger uploads, custom emojis, HD streaming, and more. Coming soon!"
      />
    </div>
  );
}
