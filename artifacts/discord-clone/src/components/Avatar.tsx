import { cn } from "@/lib/utils";

type Status = "online" | "idle" | "dnd" | "offline";

interface AvatarProps {
  initials: string;
  colorClass?: string;
  color?: string;
  status?: Status;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  statusBg?: string;
  statusBgClass?: string;
}

const sizeMap = {
  xs: { avatar: "w-6 h-6 text-[10px]", dot: "w-3 h-3 border-[2px]", offset: "bottom-[-3px] right-[-3px]" },
  sm: { avatar: "w-8 h-8 text-xs", dot: "w-[14px] h-[14px] border-[2px]", offset: "bottom-[-2px] right-[-2px]" },
  md: { avatar: "w-10 h-10 text-sm", dot: "w-[16px] h-[16px] border-[3px]", offset: "bottom-[-3px] right-[-3px]" },
  lg: { avatar: "w-12 h-12 text-base", dot: "w-5 h-5 border-[3px]", offset: "bottom-[-3px] right-[-3px]" },
};

const statusBgColors: Record<Status, string> = {
  online: "#23a55a",
  idle: "#f0b232",
  dnd: "#f23f43",
  offline: "#80848e",
};

export function Avatar({
  initials,
  colorClass,
  color,
  status,
  size = "md",
  className,
  statusBg = "#2b2d31",
  statusBgClass,
}: AvatarProps) {
  const s = sizeMap[size];

  return (
    <div className={cn("relative inline-flex items-center justify-center shrink-0", className)}>
      <div
        className={cn(
          s.avatar,
          "rounded-full flex items-center justify-center font-semibold text-white select-none",
          colorClass
        )}
        style={color ? { backgroundColor: color } : undefined}
      >
        {initials}
      </div>

      {status && (
        <div
          className={cn(
            s.dot,
            "absolute rounded-full flex items-center justify-center",
            s.offset,
            statusBgClass
          )}
          style={{
            backgroundColor: statusBgColors[status],
            borderColor: statusBgClass ? undefined : statusBg,
          }}
        >
          {status === "dnd" && (
            <div className="w-[55%] h-[2px] bg-white rounded-full" />
          )}
          {status === "idle" && (
            <div
              className="absolute rounded-full bg-inherit"
              style={{
                width: "45%",
                height: "45%",
                top: "0px",
                right: "0px",
                backgroundColor: statusBgClass ? undefined : statusBg,
              }}
            />
          )}
          {status === "offline" && (
            <div className="w-[40%] h-[40%] rounded-full bg-white opacity-90" />
          )}
        </div>
      )}
    </div>
  );
}
