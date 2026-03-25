import { useState } from "react";
import { MailCheck } from "lucide-react";
import { InProgressPage } from "@/components/InProgress";
import { cn } from "@/lib/utils";

export default function MessageRequestsPage() {
  const [tab, setTab] = useState<"requests" | "spam">("requests");

  return (
    <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden" style={{ backgroundColor: "#000000" }}>
      <div
        className="h-12 shrink-0 flex items-center px-4 gap-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", backgroundColor: "#000000" }}
      >
        <div className="flex items-center gap-2 mr-3">
          <MailCheck className="w-5 h-5 text-[#949ba4]" />
          <span className="text-[#f2f3f5] font-semibold text-[15px]">Message Requests</span>
        </div>
        <div className="w-px h-5 bg-white/10 mx-3" />
        <div className="flex items-center gap-1">
          <button
            onClick={() => setTab("requests")}
            className={cn(
              "px-3 py-[5px] rounded-[6px] text-[14px] font-semibold transition-all duration-150",
              tab === "requests"
                ? "bg-[#1a1a1a] text-[#f2f3f5]"
                : "text-[#87898c] hover:bg-[#111111] hover:text-[#dbdee1]"
            )}
          >
            Requests
          </button>
          <button
            onClick={() => setTab("spam")}
            className={cn(
              "px-3 py-[5px] rounded-[6px] text-[14px] font-medium transition-all duration-150 flex items-center gap-1.5",
              tab === "spam"
                ? "bg-[#1a1a1a] text-[#f2f3f5]"
                : "text-[#87898c] hover:bg-[#111111] hover:text-[#dbdee1]"
            )}
          >
            Spam
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full leading-none" style={{ backgroundColor: "#313338", color: "#87898c" }}>1</span>
          </button>
        </div>
      </div>
      <InProgressPage
        title="Message Requests"
        subtitle="Message requests from people outside your servers and friends will appear here."
      />
    </div>
  );
}
