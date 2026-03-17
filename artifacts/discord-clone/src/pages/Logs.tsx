import { useState, useRef, useEffect, useMemo } from "react";
import { Search, Trash2, Download, RefreshCw, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

interface LogEntry {
  id: number;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
}

const initialLogs: LogEntry[] = [
  { id: 1,  timestamp: "2026-03-17 09:41:02.341", level: "INFO",  source: "gateway",  message: "User nova_storm connected from 192.168.1.42" },
  { id: 2,  timestamp: "2026-03-17 09:41:18.012", level: "INFO",  source: "channels", message: "Channel #general created by velvetsky" },
  { id: 3,  timestamp: "2026-03-17 09:42:05.887", level: "WARN",  source: "api",      message: "Rate limit reached for endpoint /messages (429)" },
  { id: 4,  timestamp: "2026-03-17 09:43:11.224", level: "DEBUG", source: "presence", message: "pixelwitch activity updated → playing Valorant" },
  { id: 5,  timestamp: "2026-03-17 09:44:30.563", level: "ERROR", source: "sync",     message: "Failed to sync roles: connection timeout after 5000ms" },
  { id: 6,  timestamp: "2026-03-17 09:45:00.001", level: "INFO",  source: "presence", message: "driftwood status changed → idle" },
  { id: 7,  timestamp: "2026-03-17 09:46:17.445", level: "INFO",  source: "messages", message: "Message #89234 deleted in #general by moderator" },
  { id: 8,  timestamp: "2026-03-17 09:47:03.778", level: "WARN",  source: "system",   message: "High memory usage detected: 82% (threshold: 80%)" },
  { id: 9,  timestamp: "2026-03-17 09:48:44.213", level: "DEBUG", source: "presence", message: "ghostline status changed → dnd" },
  { id: 10, timestamp: "2026-03-17 09:49:55.990", level: "INFO",  source: "backup",   message: "Automated backup completed — 1.2 GB written to cold storage" },
  { id: 11, timestamp: "2026-03-17 09:51:02.114", level: "ERROR", source: "gateway",  message: "WebSocket connection dropped (code: 1006, reason: abnormal closure)" },
  { id: 12, timestamp: "2026-03-17 09:51:04.220", level: "INFO",  source: "gateway",  message: "WebSocket reconnected — session resumed" },
  { id: 13, timestamp: "2026-03-17 09:52:15.667", level: "DEBUG", source: "cache",    message: "Cache eviction triggered — freed 128 MB" },
  { id: 14, timestamp: "2026-03-17 09:53:08.442", level: "INFO",  source: "auth",     message: "Token refreshed for velvetsky (expires in 24h)" },
  { id: 15, timestamp: "2026-03-17 09:54:30.001", level: "WARN",  source: "cdn",      message: "CDN latency spike detected: p99=840ms (normal: <150ms)" },
  { id: 16, timestamp: "2026-03-17 09:55:17.339", level: "INFO",  source: "api",      message: "Bulk member fetch completed — 248 members loaded" },
  { id: 17, timestamp: "2026-03-17 09:56:44.881", level: "ERROR", source: "db",       message: "Query timeout on users table after 3000ms — retrying" },
  { id: 18, timestamp: "2026-03-17 09:56:45.102", level: "INFO",  source: "db",       message: "Query retry succeeded on attempt 2" },
  { id: 19, timestamp: "2026-03-17 09:58:00.000", level: "INFO",  source: "cron",     message: "Scheduled cleanup job started — purging stale sessions" },
  { id: 20, timestamp: "2026-03-17 09:58:02.341", level: "INFO",  source: "cron",     message: "Cleanup complete — 1,402 stale sessions removed" },
];

let nextId = 21;

function makeNewLog(): LogEntry {
  const pool: Omit<LogEntry, "id" | "timestamp">[] = [
    { level: "INFO",  source: "gateway",  message: "Heartbeat acknowledged from nova_storm" },
    { level: "DEBUG", source: "presence", message: "Presence batch update dispatched (12 users)" },
    { level: "WARN",  source: "api",      message: "Slow response on /channels endpoint: 1.2s" },
    { level: "INFO",  source: "messages", message: "New message in #general by pixelwitch" },
    { level: "ERROR", source: "gateway",  message: "Shard 2 reconnect failed — retrying in 5s" },
    { level: "INFO",  source: "auth",     message: "New login from velvetsky (IP: 10.0.0.5)" },
    { level: "DEBUG", source: "cache",    message: "Cache hit ratio: 94.2%" },
  ];
  const entry = pool[Math.floor(Math.random() * pool.length)];
  const now = new Date();
  const ts = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}.${String(now.getMilliseconds()).padStart(3,"0")}`;
  return { id: nextId++, timestamp: ts, ...entry };
}

const levelMeta: Record<LogLevel, { color: string; bg: string; border: string; dot: string }> = {
  INFO:  { color: "#87898c", bg: "transparent",           border: "transparent",         dot: "#5e6068" },
  DEBUG: { color: "#7289da", bg: "rgba(114,137,218,0.06)", border: "rgba(114,137,218,0.15)", dot: "#7289da" },
  WARN:  { color: "#f0b232", bg: "rgba(240,178,50,0.06)",  border: "rgba(240,178,50,0.15)",  dot: "#f0b232" },
  ERROR: { color: "#f23f43", bg: "rgba(242,63,67,0.07)",   border: "rgba(242,63,67,0.15)",   dot: "#f23f43" },
};

const levels: LogLevel[] = ["INFO", "WARN", "ERROR", "DEBUG"];

export default function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [search, setSearch] = useState("");
  const [activeLevel, setActiveLevel] = useState<LogLevel | "ALL">("ALL");
  const [autoScroll, setAutoScroll] = useState(true);
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const newestIdRef = useRef<number | null>(null);

  const filtered = useMemo(() => logs.filter((l) => {
    const matchLevel = activeLevel === "ALL" || l.level === activeLevel;
    const matchSearch =
      search === "" ||
      l.message.toLowerCase().includes(search.toLowerCase()) ||
      l.source.toLowerCase().includes(search.toLowerCase());
    return matchLevel && matchSearch;
  }), [logs, activeLevel, search]);

  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoScroll]);

  const toggleStream = () => {
    if (streaming) {
      if (streamRef.current) clearInterval(streamRef.current);
      streamRef.current = null;
      setStreaming(false);
    } else {
      setStreaming(true);
      streamRef.current = setInterval(() => {
        const entry = makeNewLog();
        newestIdRef.current = entry.id;
        setLogs((prev) => [...prev.slice(-200), entry]);
      }, 1400);
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) clearInterval(streamRef.current);
    };
  }, []);

  const counts = useMemo(() => ({
    ALL: logs.length,
    INFO: logs.filter((l) => l.level === "INFO").length,
    WARN: logs.filter((l) => l.level === "WARN").length,
    ERROR: logs.filter((l) => l.level === "ERROR").length,
    DEBUG: logs.filter((l) => l.level === "DEBUG").length,
  }), [logs]);

  return (
    <div className="flex-1 h-full flex flex-col min-w-0" style={{ backgroundColor: "#0a1220" }}>
      {/* Header */}
      <div
        className="h-12 shrink-0 flex items-center px-4 gap-3"
        style={{
          borderBottom: "1px solid rgba(0,0,0,0.28)",
          background: "linear-gradient(180deg, #0c1530 0%, #0a1220 100%)",
        }}
      >
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", streaming ? "online-pulse bg-[#23a55a]" : "bg-[#5e6068]")} />
          <span className="text-[#f2f3f5] font-semibold text-[15px] tracking-[-0.01em]">Logs</span>
        </div>

        <div className="w-px h-5 bg-white/10 mx-1" />

        {/* Level filter tabs */}
        <div className="flex items-center gap-1">
          {(["ALL", ...levels] as (LogLevel | "ALL")[]).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setActiveLevel(lvl)}
              className={cn(
                "px-2.5 py-[3px] text-[11px] font-bold rounded-[4px] transition-all duration-150 tracking-wider",
                activeLevel === lvl
                  ? lvl === "ALL"
                    ? "bg-[#152438] text-[#f2f3f5]"
                    : lvl === "ERROR"
                    ? "bg-[#f23f43]/20 text-[#f23f43]"
                    : lvl === "WARN"
                    ? "bg-[#f0b232]/20 text-[#f0b232]"
                    : lvl === "DEBUG"
                    ? "bg-[#7289da]/20 text-[#7289da]"
                    : "bg-[#152438] text-[#87898c]"
                  : "text-[#5e6068] hover:text-[#87898c] hover:bg-white/5"
              )}
            >
              {lvl}
              {lvl !== "ALL" && <span className="ml-1 opacity-60">{counts[lvl]}</span>}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[180px] text-[#dbdee1] placeholder:text-[#5e6068] text-[12px] py-[5px] pl-3 pr-8 rounded-[5px] outline-none transition-all focus:w-[240px] focus:ring-1 focus:ring-white/10"
            style={{ backgroundColor: "#060b14" }}
          />
          <Search className="absolute right-2.5 top-[6px] w-3.5 h-3.5 text-[#5e6068]" />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 ml-1">
          <button
            onClick={toggleStream}
            title={streaming ? "Stop live stream" : "Start live stream"}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-[4px] text-[11px] font-semibold rounded-[5px] transition-all",
              streaming
                ? "bg-[#23a55a]/20 text-[#23a55a] hover:bg-[#23a55a]/30"
                : "bg-[#152438] text-[#87898c] hover:text-[#dbdee1] hover:bg-[#1a3050]"
            )}
          >
            <RefreshCw className={cn("w-3 h-3", streaming && "animate-spin")} />
            {streaming ? "Live" : "Stream"}
          </button>
          <button
            onClick={() => setAutoScroll((v) => !v)}
            title="Toggle auto-scroll"
            className={cn(
              "p-1.5 rounded-[5px] transition-colors",
              autoScroll ? "text-[#5865f2] bg-[#5865f2]/15" : "text-[#5e6068] hover:bg-white/5 hover:text-[#87898c]"
            )}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLogs([])}
            title="Clear logs"
            className="p-1.5 rounded-[5px] text-[#5e6068] hover:text-[#f23f43] hover:bg-[#f23f43]/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            title="Export logs"
            onClick={() => {
              const blob = new Blob([filtered.map((l) => `[${l.timestamp}] [${l.level}] [${l.source}] ${l.message}`).join("\n")], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url; a.download = "logs.txt"; a.click();
              URL.revokeObjectURL(url);
            }}
            className="p-1.5 rounded-[5px] text-[#5e6068] hover:text-[#dbdee1] hover:bg-white/5 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Log frame */}
      <div className="flex-1 overflow-hidden p-3">
        <div
          className="h-full rounded-[8px] overflow-hidden flex flex-col"
          style={{
            background: "#18191c",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "inset 0 2px 16px rgba(0,0,0,0.5)",
          }}
        >
          {/* Title bar */}
          <div
            className="flex items-center gap-1.5 px-4 py-2.5 shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#f23f43]/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#f0b232]/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#23a55a]/70" />
            <span className="ml-2 text-[10px] text-[#3e4147] font-mono tracking-widest">
              system.log — {filtered.length} entries
            </span>
            {streaming && (
              <span className="ml-auto text-[10px] text-[#23a55a] font-mono animate-pulse tracking-wider">
                ● LIVE
              </span>
            )}
          </div>

          {/* Column headers */}
          <div
            className="grid px-4 py-1.5 shrink-0"
            style={{
              gridTemplateColumns: "200px 56px 80px 1fr",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <span className="text-[9px] font-bold text-[#3e4147] uppercase tracking-widest">Timestamp</span>
            <span className="text-[9px] font-bold text-[#3e4147] uppercase tracking-widest">Level</span>
            <span className="text-[9px] font-bold text-[#3e4147] uppercase tracking-widest">Source</span>
            <span className="text-[9px] font-bold text-[#3e4147] uppercase tracking-widest">Message</span>
          </div>

          {/* Entries */}
          <div className="flex-1 overflow-y-auto discord-scrollbar font-mono">
            {filtered.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-[#3e4147] text-[13px]">No log entries match your filter.</p>
              </div>
            ) : (
              filtered.map((log) => {
                const m = levelMeta[log.level];
                const isNew = streaming && log.id === newestIdRef.current;
                return (
                  <div
                    key={log.id}
                    className={cn("grid px-4 py-[5px] transition-colors duration-75 hover:bg-white/[0.025] group cursor-default", isNew && "animate-log-entry")}
                    style={{
                      gridTemplateColumns: "200px 56px 80px 1fr",
                      background: m.bg,
                      borderLeft: `2px solid ${activeLevel === log.level ? m.border : "transparent"}`,
                    }}
                  >
                    <span className="text-[10px] text-[#3e4147] tabular-nums truncate pr-2 group-hover:text-[#5e6068] transition-colors">
                      {log.timestamp}
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: m.dot }} />
                      <span className="text-[10px] font-bold tracking-wide" style={{ color: m.color }}>
                        {log.level}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#1a3050] truncate pr-2 group-hover:text-[#5e6068] transition-colors">
                      [{log.source}]
                    </span>
                    <span className="text-[11px] truncate" style={{ color: m.color === "#87898c" ? "#6d6f76" : m.color }}>
                      {log.message}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          {/* Footer cursor */}
          <div
            className="px-4 py-2 shrink-0 flex items-center gap-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
          >
            <span className="text-[11px] text-[#23a55a] font-mono">›</span>
            <span className="text-[10px] text-[#060b14] font-mono animate-pulse">_</span>
            <span className="ml-auto text-[9px] text-[#060b14] font-mono tabular-nums">
              {counts.ERROR > 0 && <span className="text-[#f23f43] mr-2">{counts.ERROR} error{counts.ERROR !== 1 ? "s" : ""}</span>}
              {counts.WARN > 0 && <span className="text-[#f0b232] mr-2">{counts.WARN} warning{counts.WARN !== 1 ? "s" : ""}</span>}
              {logs.length} total
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
