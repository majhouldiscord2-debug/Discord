const mockLogs = [
  { id: 1, time: "09:41:02", level: "INFO",  message: "User nova_storm joined the server" },
  { id: 2, time: "09:41:18", level: "INFO",  message: "Channel #general created" },
  { id: 3, time: "09:42:05", level: "WARN",  message: "Rate limit reached for API endpoint" },
  { id: 4, time: "09:43:11", level: "INFO",  message: "pixelwitch started playing Valorant" },
  { id: 5, time: "09:44:30", level: "ERROR", message: "Failed to sync roles: timeout" },
  { id: 6, time: "09:45:00", level: "INFO",  message: "driftwood went idle" },
  { id: 7, time: "09:46:17", level: "INFO",  message: "Message deleted in #general" },
  { id: 8, time: "09:47:03", level: "WARN",  message: "High memory usage detected (82%)" },
  { id: 9, time: "09:48:44", level: "INFO",  message: "ghostline set status to Do Not Disturb" },
  { id: 10, time: "09:49:55", level: "INFO", message: "Backup completed successfully" },
  { id: 11, time: "09:51:02", level: "ERROR", message: "WebSocket connection dropped" },
  { id: 12, time: "09:51:04", level: "INFO", message: "WebSocket reconnected" },
];

const levelStyle: Record<string, { color: string; bg: string; label: string }> = {
  INFO:  { color: "#7d8188",  bg: "rgba(255,255,255,0.04)", label: "INFO" },
  WARN:  { color: "#f0b232",  bg: "rgba(240,178,50,0.08)",  label: "WARN" },
  ERROR: { color: "#f23f43",  bg: "rgba(242,63,67,0.08)",   label: "ERR " },
};

export function ActiveNow() {
  return (
    <div
      className="w-[340px] h-full hidden lg:flex flex-col shrink-0"
      style={{
        background: "linear-gradient(180deg, #2c2e33 0%, #2b2d31 100%)",
        borderLeft: "1px solid rgba(0,0,0,0.28)",
      }}
    >
      {/* Header */}
      <div
        className="h-12 shrink-0 flex items-center justify-between px-4"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.28)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#23a55a] online-pulse" />
          <span className="text-[11px] font-bold text-[#87898c] uppercase tracking-widest">
            Logs
          </span>
        </div>
        <span className="text-[10px] text-[#4e5058] font-medium tabular-nums">
          {mockLogs.length} entries
        </span>
      </div>

      {/* Log Frame */}
      <div className="flex-1 overflow-hidden p-3">
        <div
          className="h-full rounded-[8px] overflow-hidden flex flex-col"
          style={{
            background: "#18191c",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "inset 0 2px 12px rgba(0,0,0,0.4)",
          }}
        >
          {/* Frame title bar */}
          <div
            className="flex items-center gap-1.5 px-3 py-2 shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#f23f43]/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#f0b232]/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#23a55a]/70" />
            <span className="ml-2 text-[10px] text-[#3e4147] font-medium tracking-wider">
              system.log
            </span>
          </div>

          {/* Log entries */}
          <div className="flex-1 overflow-y-auto discord-scrollbar py-1">
            {mockLogs.map((log, i) => {
              const s = levelStyle[log.level];
              return (
                <div
                  key={log.id}
                  className="flex items-start gap-2 px-3 py-[5px] hover:bg-white/[0.03] transition-colors duration-100 animate-fade-slide-up"
                  style={{ animationDelay: `${i * 35}ms`, backgroundColor: s.bg }}
                >
                  <span className="text-[10px] text-[#3e4147] font-mono tabular-nums shrink-0 mt-[1px]">
                    {log.time}
                  </span>
                  <span
                    className="text-[9px] font-bold font-mono w-[28px] shrink-0 mt-[2px] tracking-wider"
                    style={{ color: s.color }}
                  >
                    {s.label}
                  </span>
                  <span className="text-[11px] leading-[1.5] break-words min-w-0" style={{ color: s.color === "#7d8188" ? "#5e6068" : s.color }}>
                    {log.message}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Cursor blink line */}
          <div
            className="px-3 py-2 shrink-0 flex items-center gap-1"
            style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
          >
            <span className="text-[11px] text-[#23a55a] font-mono">›</span>
            <span className="text-[10px] text-[#2e3035] font-mono">_</span>
          </div>
        </div>
      </div>
    </div>
  );
}
