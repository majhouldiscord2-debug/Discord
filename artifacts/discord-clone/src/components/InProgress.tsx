interface ClockProps {
  size?: number;
  float?: boolean;
}

export function InProgressClock({ size = 56, float = false }: ClockProps) {
  return (
    <div className={float ? "animate-float-clock animate-teal-glow" : "animate-teal-glow"}>
      <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g className="animate-dash-rotate">
          <circle cx="28" cy="28" r="26" stroke="#00b0f4" strokeWidth="2" strokeDasharray="5 3.5" strokeLinecap="round" opacity="0.45" />
        </g>
        <circle cx="28" cy="28" r="20" fill="#000000" stroke="#00b0f4" strokeWidth="1.5" opacity="0.9" />
        <g className="animate-clock-spin">
          <line x1="28" y1="28" x2="28" y2="13" stroke="#00b0f4" strokeWidth="2" strokeLinecap="round" />
        </g>
        <line x1="28" y1="28" x2="38.5" y2="34" stroke="#4e5058" strokeWidth="2" strokeLinecap="round" />
        <circle cx="28" cy="28" r="2.5" fill="#00b0f4" />
        <circle cx="28" cy="28" r="1.2" fill="#000000" />
      </svg>
    </div>
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
    <div className="flex flex-col items-center justify-center gap-4 py-6 select-none animate-fade-slide-up">
      <InProgressClock size={iconSize} float={size !== "sm"} />
      <div className="flex flex-col items-center gap-1 text-center">
        <span className={`${titleSize} font-semibold text-[#87898c]`}>{label}</span>
        {description && (
          <span className={`${descSize} text-[#3e4147] max-w-[200px] leading-snug`}>{description}</span>
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
    <div className="flex-1 h-full flex flex-col items-center justify-center gap-6 select-none animate-fade-in" style={{ backgroundColor: "#000000" }}>
      <InProgressClock size={96} float />
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-[22px] font-bold text-[#dbdee1] tracking-tight">{title}</span>
        <span className="text-[14px] text-[#4e5058] max-w-[320px] leading-relaxed">{subtitle}</span>
      </div>
      <div
        className="px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest animate-badge-pulse"
        style={{ background: "rgba(0,176,244,0.1)", color: "#00b0f4", border: "1px solid rgba(0,176,244,0.25)" }}
      >
        Coming Soon
      </div>
    </div>
  );
}
