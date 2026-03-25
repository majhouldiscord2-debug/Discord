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
  const iconSize = size === "sm" ? 40 : size === "lg" ? 80 : 56;
  const titleSize = size === "sm" ? "text-[13px]" : size === "lg" ? "text-[18px]" : "text-[15px]";
  const descSize = size === "sm" ? "text-[11px]" : "text-[12px]";

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6 select-none">
      <img
        src="/in-progress.png"
        alt="In Progress"
        style={{ width: iconSize, height: iconSize, opacity: 0.85 }}
      />
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
    <div className="flex-1 h-full flex flex-col items-center justify-center gap-5 select-none" style={{ backgroundColor: "#0a1220" }}>
      <img
        src="/in-progress.png"
        alt="In Progress"
        style={{ width: 90, height: 90, opacity: 0.9 }}
      />
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
