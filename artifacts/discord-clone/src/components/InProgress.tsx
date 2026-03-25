interface ClockProps {
  size?: number;
}

export function InProgressClock({ size = 56 }: ClockProps) {
  const r = size / 2;
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="28" r="26" stroke="#00b0f4" strokeWidth="2.5" strokeDasharray="6 4" strokeLinecap="round" opacity="0.5" />
      <circle cx="28" cy="28" r="20" fill="#1e1f22" stroke="#00b0f4" strokeWidth="1.5" opacity="0.8" />
      <line x1="28" y1="28" x2="28" y2="14" stroke="#00b0f4" strokeWidth="2" strokeLinecap="round" />
      <line x1="28" y1="28" x2="38" y2="34" stroke="#87898c" strokeWidth="2" strokeLinecap="round" />
      <circle cx="28" cy="28" r="2.5" fill="#00b0f4" />
    </svg>
  );
}

interface InProgressProps {
  label?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
}

export function InProgress({
  label = "In Progress",
  description = "This feature is coming soon.",
  size = "md",
}: InProgressProps) {
  const iconSize = size === "sm" ? 36 : size === "lg" ? 72 : 52;
  const titleSize = size === "sm" ? "text-[13px]" : size === "lg" ? "text-[17px]" : "text-[15px]";
  const descSize = size === "sm" ? "text-[11px]" : "text-[12px]";

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6 select-none">
      <InProgressClock size={iconSize} />
      <div className="flex flex-col items-center gap-1 text-center">
        <span className={`${titleSize} font-semibold text-[#87898c]`}>{label}</span>
        {description && (
          <span className={`${descSize} text-[#4e5058] max-w-[180px] leading-snug`}>{description}</span>
        )}
      </div>
    </div>
  );
}

export function InProgressPage({
  title,
  subtitle = "This page is currently being built.",
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center gap-5 select-none" style={{ backgroundColor: "#313338" }}>
      <InProgressClock size={88} />
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-[20px] font-bold text-[#dbdee1]">{title}</span>
        <span className="text-[14px] text-[#5e6068] max-w-[320px] leading-relaxed">{subtitle}</span>
      </div>
      <div
        className="px-4 py-1.5 rounded-full text-[12px] font-semibold uppercase tracking-widest"
        style={{ background: "rgba(0,176,244,0.12)", color: "#00b0f4", border: "1px solid rgba(0,176,244,0.2)" }}
      >
        Coming Soon
      </div>
    </div>
  );
}
