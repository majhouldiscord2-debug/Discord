import { InProgressClock } from "./InProgress";

export function ActiveNow() {
  return (
    <div
      className="w-[340px] h-full hidden lg:flex flex-col shrink-0"
      style={{
        background: "#000000",
        borderLeft: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="h-12 shrink-0 flex items-center px-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span className="text-[15px] font-semibold text-[#f2f3f5]">Active Now</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-5 animate-fade-slide-up">
        <InProgressClock size={72} float />
        <div className="flex flex-col gap-2">
          <p className="text-[15px] font-semibold text-[#f2f3f5]">In Progress</p>
          <p className="text-[13px] text-[#87898c] leading-snug">
            The Active Now panel is being built. When a friend starts an activity, it'll show up here!
          </p>
        </div>
        <div
          className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest"
          style={{ background: "rgba(200,0,0,0.12)", color: "#ff6060", border: "1px solid rgba(200,0,0,0.3)" }}
        >
          Coming Soon
        </div>
      </div>
    </div>
  );
}
