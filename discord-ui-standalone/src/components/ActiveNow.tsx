export function ActiveNow() {
  return (
    <div
      className="w-[340px] h-full hidden lg:flex flex-col shrink-0 p-4"
      style={{
        backgroundColor: "#2b2d31",
        borderLeft: "1px solid rgba(0,0,0,0.25)",
      }}
    >
      <h2 className="font-semibold text-[#f2f3f5] text-[16px] mb-4">Active Now</h2>

      <div className="flex flex-col items-center justify-center text-center mt-12 px-4 gap-3">
        <p className="text-[16px] font-semibold text-[#f2f3f5]">It's quiet for now...</p>
        <p className="text-[14px] text-[#949ba4] leading-relaxed">
          When a friend starts an activity—like playing a game or hanging out on voice—we'll show it here!
        </p>
      </div>
    </div>
  );
}
