import { cn } from "@/lib/utils";

interface AvatarProps {
  initials: string;
  colorClass?: string;
  status?: "online" | "idle" | "dnd" | "offline";
  size?: "sm" | "md" | "lg";
  statusBgClass?: string; // Tailwind class for the border color around the status dot
  className?: string;
}

export function Avatar({ 
  initials, 
  colorClass = "bg-primary", 
  status, 
  size = "md", 
  statusBgClass = "border-sidebar", // Defaults to the DM sidebar background
  className 
}: AvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base"
  };

  const statusColors = {
    online: "bg-success",
    idle: "bg-warning",
    dnd: "bg-danger",
    offline: "bg-muted"
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center shrink-0", sizeClasses[size], className)}>
      <div className={cn("w-full h-full rounded-full flex items-center justify-center text-white font-medium overflow-hidden select-none", colorClass)}>
        {initials}
      </div>
      
      {status && (
        <div className={cn(
          "absolute -bottom-1 -right-1 rounded-full border-[3px] z-10 flex items-center justify-center",
          size === "lg" ? "w-5 h-5 border-[4px]" : "w-[18px] h-[18px]",
          statusBgClass,
          statusColors[status]
        )}>
          {status === "idle" && (
            <div className="w-[6px] h-[6px] bg-sidebar rounded-full -translate-x-[2px] -translate-y-[2px]" />
          )}
          {status === "dnd" && (
            <div className="w-[8px] h-[2px] bg-sidebar rounded-full" />
          )}
          {status === "offline" && (
            <div className="w-[8px] h-[8px] bg-sidebar rounded-full" />
          )}
        </div>
      )}
    </div>
  );
}
