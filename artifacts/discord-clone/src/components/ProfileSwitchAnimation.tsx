import { useEffect, useState, useRef, useLayoutEffect } from "react";

interface Props {
  onComplete: () => void;
  targetMode: "bot" | "discord";
}

const BINARY_CHARS = "01";
const GLITCH_CHARS = "!@#$%^&*<>?/\\|[]{}~`";

function randomChar(chars: string) {
  return chars[Math.floor(Math.random() * chars.length)];
}

function useGlitchText(final: string, active: boolean) {
  const [text, setText] = useState(final);

  useEffect(() => {
    if (!active) { setText(final); return; }
    let iteration = 0;
    const interval = setInterval(() => {
      setText(
        final
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (i < iteration) return final[i];
            return randomChar(GLITCH_CHARS);
          })
          .join("")
      );
      iteration += 0.4;
      if (iteration >= final.length + 4) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [active, final]);

  return text;
}

function BinaryRain() {
  const cols = 28;
  const [columns] = useState(() =>
    Array.from({ length: cols }, (_, i) => ({
      id: i,
      chars: Array.from({ length: 18 }, () => randomChar(BINARY_CHARS)),
      delay: Math.random() * 0.8,
      speed: 0.6 + Math.random() * 0.8,
      x: (i / cols) * 100,
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      {columns.map((col) => (
        <div
          key={col.id}
          className="absolute top-0 text-[10px] font-mono leading-[14px] text-red-500"
          style={{
            left: `${col.x}%`,
            animation: `binaryFall ${col.speed}s ${col.delay}s linear infinite`,
          }}
        >
          {col.chars.map((c, i) => (
            <div key={i} style={{ opacity: 1 - i * 0.05 }}>
              {c}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function CircuitLines() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
      <line x1="0" y1="80" x2="800" y2="80" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="4 8" />
      <line x1="0" y1="520" x2="800" y2="520" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="4 8" />
      <line x1="0" y1="300" x2="260" y2="300" stroke="#ef4444" strokeWidth="0.5" />
      <line x1="540" y1="300" x2="800" y2="300" stroke="#ef4444" strokeWidth="0.5" />
      <line x1="60" y1="0" x2="60" y2="600" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="4 8" />
      <line x1="740" y1="0" x2="740" y2="600" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="4 8" />
      <polyline points="20,20 20,60 60,60" fill="none" stroke="#ef4444" strokeWidth="1.5" />
      <polyline points="780,20 780,60 740,60" fill="none" stroke="#ef4444" strokeWidth="1.5" />
      <polyline points="20,580 20,540 60,540" fill="none" stroke="#ef4444" strokeWidth="1.5" />
      <polyline points="780,580 780,540 740,540" fill="none" stroke="#ef4444" strokeWidth="1.5" />
      <circle cx="60" cy="80" r="3" fill="#ef4444" />
      <circle cx="740" cy="80" r="3" fill="#ef4444" />
      <circle cx="60" cy="520" r="3" fill="#ef4444" />
      <circle cx="740" cy="520" r="3" fill="#ef4444" />
      <circle cx="60" cy="300" r="3" fill="#ef4444" />
      <circle cx="740" cy="300" r="3" fill="#ef4444" />
      <rect x="0" y="0" width="800" height="600" fill="url(#scanlines)" />
      <defs>
        <pattern id="scanlines" width="2" height="4" patternUnits="userSpaceOnUse">
          <rect width="2" height="1" fill="rgba(0,0,0,0.3)" />
        </pattern>
      </defs>
    </svg>
  );
}

function HexData({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex gap-2 items-center font-mono text-[10px]">
      <span className="text-red-600">{label}</span>
      <span className="text-red-400">{value}</span>
    </div>
  );
}

export default function ProfileSwitchAnimation({ onComplete, targetMode }: Props) {
  const [phase, setPhase] = useState<"enter" | "main" | "exit">("enter");
  const [barWidth, setBarWidth] = useState(0);
  const [showStatic, setShowStatic] = useState(false);

  const onCompleteRef = useRef(onComplete);
  useLayoutEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  const label = targetMode === "bot" ? "BOT MANAGER" : "DISCORD";
  const mainText = useGlitchText(`SWITCHING TO ${label}`, phase === "main");
  const subText = useGlitchText("IDENTITY PROTOCOL ACTIVE", phase === "main");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("main"), 100);
    const t2 = setTimeout(() => setShowStatic(true), 1400);
    const t3 = setTimeout(() => setPhase("exit"), 1600);
    const t4 = setTimeout(() => onCompleteRef.current(), 1950);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  useEffect(() => {
    if (phase !== "main") return;
    let rafId: number;
    let start: number | null = null;
    const duration = 1200;
    let alive = true;

    function tick(ts: number) {
      if (!alive) return;
      if (!start) start = ts;
      const pct = Math.min((ts - start) / duration, 1);
      setBarWidth(pct * 100);
      if (pct < 1) rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
    };
  }, [phase]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{
        background: "#000",
        animation: phase === "enter"
          ? "psaFadeIn 0.15s ease forwards"
          : phase === "exit"
          ? "psaFadeOut 0.35s ease forwards"
          : undefined,
      }}
    >
      <style>{`
        @keyframes psaFadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes psaFadeOut { from { opacity:1 } to { opacity:0 } }
        @keyframes binaryFall { from { transform:translateY(-100%) } to { transform:translateY(200%) } }
        @keyframes psaPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes psaGlow { 0%,100%{text-shadow:0 0 8px #ef4444,0 0 20px #ef444466} 50%{text-shadow:0 0 20px #ef4444,0 0 50px #ef4444aa,0 0 80px #ef444455} }
        @keyframes psaStaticIn { 0%{opacity:0;transform:scaleY(0)} 100%{opacity:1;transform:scaleY(1)} }
        @keyframes psaSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes psaCornerFlash { 0%,100%{opacity:0.4} 50%{opacity:1} }
        @keyframes psaBarGlow { 0%,100%{box-shadow:0 0 6px #ef4444} 50%{box-shadow:0 0 18px #ef4444,0 0 40px #ef444466} }
      `}</style>

      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(239,68,68,0.12) 0%, transparent 70%)" }}
      />

      <BinaryRain />
      <CircuitLines />

      {showStatic && (
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(239,68,68,0.08) 2px, rgba(239,68,68,0.08) 4px)",
            animation: "psaStaticIn 0.1s ease forwards",
          }}
        />
      )}

      <div
        className="absolute left-0 right-0 h-[2px] pointer-events-none z-10"
        style={{
          background: "linear-gradient(90deg, transparent, #ef4444, transparent)",
          top: `${barWidth}%`,
          boxShadow: "0 0 12px #ef4444",
          opacity: 0.6,
          transition: "top 0.05s linear",
        }}
      />

      <div className="absolute top-4 left-6 right-6 flex justify-between items-start z-20">
        <div className="flex flex-col gap-1">
          <HexData label="SYS:" value="0xFF4A2D" />
          <HexData label="PID:" value={`0x${Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase()}`} />
        </div>
        <div
          className="flex items-center gap-2 text-[10px] font-mono text-red-500"
          style={{ animation: "psaCornerFlash 0.6s ease infinite" }}
        >
          <div className="w-2 h-2 rounded-full bg-red-500" style={{ animation: "psaPulse 0.5s ease infinite" }} />
          IDENTITY OVERRIDE
        </div>
        <div className="flex flex-col gap-1 items-end">
          <HexData label="MEM:" value="4096KB" />
          <HexData label="CPU:" value={`${Math.floor(barWidth)}%`} />
        </div>
      </div>

      <div className="absolute bottom-4 left-6 right-6 flex justify-between z-20 font-mono text-[9px] text-red-800">
        <span>TG-WORKS :: SECURE_SHELL_v2.4</span>
        <span style={{ animation: "psaPulse 1s ease infinite" }}>ENCRYPTING...</span>
        <span>NODE_ID: 0x{(0xDEAD + Math.floor(barWidth)).toString(16).toUpperCase()}</span>
      </div>

      <div className="relative z-20 flex flex-col items-center gap-6 px-8">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "2px solid rgba(239,68,68,0.2)",
              borderTopColor: "#ef4444",
              animation: "psaSpin 1s linear infinite",
            }}
          />
          <div
            className="absolute inset-2 rounded-full"
            style={{
              border: "1px solid rgba(239,68,68,0.15)",
              borderBottomColor: "#ef4444",
              animation: "psaSpin 0.7s linear infinite reverse",
            }}
          />
          <svg viewBox="0 0 24 24" className="w-8 h-8 fill-red-500" style={{ filter: "drop-shadow(0 0 8px #ef4444)" }}>
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
          </svg>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div
            className="text-2xl font-mono font-bold tracking-[0.3em] text-red-400 text-center"
            style={{ animation: "psaGlow 0.8s ease infinite", fontFamily: "'Courier New', monospace" }}
          >
            {mainText}
          </div>
          <div className="text-[11px] font-mono tracking-widest text-red-700 text-center">
            {subText}
          </div>
        </div>

        <div className="w-80 flex flex-col gap-2">
          <div className="flex justify-between font-mono text-[10px] text-red-800">
            <span>LOADING PROFILE</span>
            <span className="text-red-500">{Math.floor(barWidth)}%</span>
          </div>
          <div className="h-[3px] w-full bg-red-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 rounded-full"
              style={{
                width: `${barWidth}%`,
                transition: "width 0.05s linear",
                animation: "psaBarGlow 0.5s ease infinite",
              }}
            />
          </div>
          <div className="flex justify-between font-mono text-[9px] text-red-900">
            <span>VERIFYING CREDENTIALS</span>
            <span>SECURE</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 font-mono text-[10px] text-red-900 w-80">
          {barWidth > 20 && <div className="text-red-700">{">"} AUTH_TOKEN validated</div>}
          {barWidth > 45 && <div className="text-red-700">{">"} SESSION encrypted</div>}
          {barWidth > 70 && <div className="text-red-700">{">"} PROFILE loading...</div>}
          {barWidth > 90 && <div className="text-red-500" style={{ animation: "psaPulse 0.3s ease infinite" }}>{">"} ACCESS GRANTED</div>}
        </div>
      </div>
    </div>
  );
}
