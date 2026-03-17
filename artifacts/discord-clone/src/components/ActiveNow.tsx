export function ActiveNow() {
  return (
    <div
      className="w-[340px] h-full hidden lg:flex flex-col shrink-0 p-4"
      style={{
        background: "linear-gradient(180deg, #2c2e33 0%, #2b2d31 100%)",
        borderLeft: "1px solid rgba(0,0,0,0.28)",
      }}
    >
      <h2 className="font-semibold text-[#dbdee1] text-[14px] mb-4 uppercase tracking-widest text-[11px]">
        Active Now
      </h2>

      <div className="flex flex-col items-center justify-center text-center mt-10 px-4 gap-4">
        {/* Decorative orb */}
        <div className="relative mb-2">
          <div
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center"
            style={{
              background: "radial-gradient(circle at 40% 35%, rgba(88,101,242,0.25) 0%, rgba(88,101,242,0.05) 60%, transparent 100%)",
              border: "1px solid rgba(88,101,242,0.15)",
            }}
          >
            <div
              className="w-10 h-10 rounded-full"
              style={{
                background: "radial-gradient(circle at 40% 35%, #5865f2 0%, #4752c4 100%)",
                boxShadow: "0 4px 20px rgba(88,101,242,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
              }}
            />
          </div>
          {/* Ambient glow */}
          <div
            className="absolute inset-0 rounded-full blur-xl -z-10"
            style={{ background: "rgba(88,101,242,0.15)" }}
          />
        </div>

        <p className="text-[15px] font-semibold text-[#dbdee1] tracking-[-0.01em]">
          It's quiet for now...
        </p>
        <p className="text-[13px] text-[#6d6f76] leading-relaxed max-w-[200px]">
          When a friend starts an activity—like playing a game or hanging out on voice—we'll show it here!
        </p>
      </div>
    </div>
  );
}
