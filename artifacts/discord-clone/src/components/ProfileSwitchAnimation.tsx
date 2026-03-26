import { useEffect, useRef, useState } from "react";

interface Props {
  onSwitch: () => void;
  onComplete: () => void;
  targetMode: "bot" | "discord";
}

const TOTAL_MS = 4500;
const SWITCH_AT_MS = Math.round(TOTAL_MS * 0.65); // ~2925ms — switch dashboard mid-animation

// ─── Character pools ─────────────────────────────────────────────────────────
const POOL_ALL = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*<>?/|[]{}~;:.░▒▓";
const POOL_HEX = "0123456789ABCDEF!@#$*?.\\";

function rndChar(pool = POOL_ALL) {
  return pool[Math.floor(Math.random() * pool.length)];
}

// ─── Module-level constants (stable across renders) ───────────────────────────
const RAIN_COLS = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  chars: Array.from({ length: 18 + Math.floor(Math.random() * 16) }, () => rndChar(POOL_HEX)).join("\n"),
  left: `${(i / 50) * 100 + (Math.random() - 0.5) * 1.2}%`,
  dur: `${0.45 + Math.random() * 1.4}s`,
  delay: `${-(Math.random() * 3.5)}s`,
  color: Math.random() > 0.12
    ? `rgba(${160 + Math.floor(Math.random() * 80)},0,0,${0.25 + Math.random() * 0.55})`
    : `rgba(255,${Math.floor(Math.random() * 50)},0,0.75)`,
  fontSize: `${9 + Math.floor(Math.random() * 5)}px`,
}));

const ERROR_MSGS = [
  { text: "CRITICAL: AUTH_OVERRIDE_DETECTED",        left: "6%",  top: "17%", delay: 280,  dur: 2200, color: "#ff2222" },
  { text: "ERROR 0x00000050: ACCESS_VIOLATION",       left: "52%", top: "22%", delay: 650,  dur: 1800, color: "#ff6600" },
  { text: "FATAL: MEMORY_CORRUPTION @0xDEADBEEF",    left: "10%", top: "74%", delay: 420,  dur: 2000, color: "#ff2222" },
  { text: "WARN: FIREWALL BYPASS IN PROGRESS...",     left: "48%", top: "80%", delay: 1050, dur: 1600, color: "#ffaa00" },
  { text: "SYS: IDENTITY INJECTION STARTING",         left: "28%", top: "10%", delay: 820,  dur: 2400, color: "#cc0000" },
  { text: ">>> OVERRIDE SEQUENCE ACCEPTED <<<",       left: "58%", top: "63%", delay: 1400, dur: 2000, color: "#ff4444" },
  { text: "KERNEL PANIC: NULL_PTR_EXCEPTION",         left: "4%",  top: "44%", delay: 550,  dur: 1200, color: "#ff2200" },
  { text: "BREACH: FIREWALL OFFLINE",                 left: "42%", top: "89%", delay: 1200, dur: 1800, color: "#ff6600" },
  { text: "INJECT: new_identity.bin → 0xFF34A1",      left: "62%", top: "38%", delay: 1600, dur: 1600, color: "#cc3300" },
  { text: "ERR: UNEXPECTED TOKEN 'ROOT'",             left: "18%", top: "58%", delay: 950,  dur: 1400, color: "#ff4422" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function GlitchRain() {
  return (
    <div className="psa-rain">
      {RAIN_COLS.map((col) => (
        <div
          key={col.id}
          className="psa-rain-col"
          style={{
            left: col.left,
            animationDuration: col.dur,
            animationDelay: col.delay,
            color: col.color,
            fontSize: col.fontSize,
          }}
        >
          {col.chars}
        </div>
      ))}
    </div>
  );
}

function ScrambleText({
  target,
  startDelay = 0,
  duration = 1800,
}: {
  target: string;
  startDelay?: number;
  duration?: number;
}) {
  const [display, setDisplay] = useState(() =>
    target.split("").map((c) => (c === " " ? " " : rndChar())).join("")
  );

  useEffect(() => {
    const tid = setTimeout(() => {
      const chars = target.split("");
      let frame = 0;
      const totalFrames = Math.ceil(duration / 38);
      const iv = setInterval(() => {
        frame++;
        const resolved = Math.floor((frame / totalFrames) * chars.length);
        setDisplay(
          chars.map((c, i) => (c === " " || i < resolved ? c : rndChar())).join("")
        );
        if (frame >= totalFrames) {
          setDisplay(target);
          clearInterval(iv);
        }
      }, 38);
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(tid);
  }, [target, startDelay, duration]);

  return <>{display}</>;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProfileSwitchAnimation({ onSwitch, onComplete, targetMode }: Props) {
  const onSwitchRef   = useRef(onSwitch);
  const onCompleteRef = useRef(onComplete);
  onSwitchRef.current   = onSwitch;
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const switchId   = setTimeout(() => onSwitchRef.current(),   SWITCH_AT_MS);
    const completeId = setTimeout(() => onCompleteRef.current(), TOTAL_MS);
    return () => { clearTimeout(switchId); clearTimeout(completeId); };
  }, []);

  const isBot     = targetMode === "bot";
  const modeLabel = isBot ? "BOT MANAGER" : "DISCORD MODE";
  const modeCode  = isBot ? "MODE::0x02" : "MODE::0x01";

  return (
    <div className="psa">
      <style>{`
        /* ── Root ──────────────────────────────────────────── */
        .psa {
          position: fixed; inset: 0; z-index: 9999;
          background: #000;
          overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Courier New', monospace;
          animation: psaLife ${TOTAL_MS}ms forwards;
        }
        @keyframes psaLife {
          0%   { opacity: 0; }
          1%   { opacity: 1; }
          2%   { opacity: 0.1; }
          3%   { opacity: 1; }
          4%   { opacity: 0.4; }
          5%   { opacity: 1; }
          82%  { opacity: 1; }
          90%  { opacity: 0; }
          100% { opacity: 0; }
        }

        /* ── Grid ──────────────────────────────────────────── */
        .psa-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(180,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180,0,0,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: psaGridPan 3s linear infinite;
        }
        @keyframes psaGridPan {
          from { background-position: 0 0; }
          to   { background-position: 40px 40px; }
        }

        /* ── Scanlines ─────────────────────────────────────── */
        .psa-scan {
          position: absolute; inset: 0; pointer-events: none;
          background: repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px);
        }

        /* ── Falling character rain ─────────────────────────── */
        .psa-rain {
          position: absolute; inset: 0;
          overflow: hidden; pointer-events: none;
        }
        .psa-rain-col {
          position: absolute; top: 0;
          line-height: 1.55;
          white-space: pre;
          transform: translateY(-105%);
          animation: psaRainFall linear infinite;
        }
        @keyframes psaRainFall { to { transform: translateY(110vh); } }

        /* ── Horizontal glitch tears ───────────────────────── */
        .psa-tear {
          position: absolute; left: 0; right: 0; pointer-events: none;
        }
        .psa-tear.t1 { top: 13%;  height: 3px;  animation: psaTearA 0.07s steps(1) infinite; }
        .psa-tear.t2 { top: 38%;  height: 2px;  animation: psaTearB 0.05s steps(1) infinite 0.01s; }
        .psa-tear.t3 { top: 61%;  height: 4px;  animation: psaTearA 0.09s steps(1) infinite 0.03s; }
        .psa-tear.t4 { top: 85%;  height: 2px;  animation: psaTearB 0.06s steps(1) infinite; }
        .psa-tear.t5 { top: 27%;  height: 1px;  animation: psaTearA 0.04s steps(1) infinite 0.02s; }
        @keyframes psaTearA {
          0%   { background: rgba(255,0,0,0.7);    transform: translateX(0); }
          20%  { background: rgba(255,80,0,0.5);   transform: translateX(-14px); }
          45%  { background: transparent;           transform: translateX(9px); }
          70%  { background: rgba(200,0,0,0.6);    transform: translateX(-4px); }
          100% { background: rgba(255,0,0,0.7);    transform: translateX(0); }
        }
        @keyframes psaTearB {
          0%   { background: rgba(255,50,0,0.4);   transform: translateX(6px); }
          33%  { background: transparent;           transform: translateX(-10px); }
          66%  { background: rgba(200,0,0,0.45);   transform: translateX(4px); }
          100% { background: rgba(255,50,0,0.4);   transform: translateX(6px); }
        }

        /* ── Floating error messages ───────────────────────── */
        .psa-err {
          position: absolute;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.07em;
          padding: 3px 9px; border-radius: 2px;
          white-space: nowrap; pointer-events: none;
          opacity: 0;
          animation: psaErrPop var(--dur) ease-out var(--delay) both;
        }
        @keyframes psaErrPop {
          0%   { opacity: 0; transform: translateY(-8px) scaleX(0.7); filter: blur(2px); }
          6%   { opacity: 1; transform: translateY(0)   scaleX(1);   filter: blur(0); }
          12%  { opacity: 0.2; }
          16%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { opacity: 0; transform: translateY(5px); }
        }

        /* ── Corner brackets ───────────────────────────────── */
        .psa-corner-wrap { position: absolute; inset: 16px; pointer-events: none; }
        .psa-c { position: absolute; width: 32px; height: 32px; border: 0px solid rgba(200,0,0,0.65); }
        .psa-c.tl { top:0; left:0;  border-top-width:2px; border-left-width:2px;  border-radius:3px 0 0 0; }
        .psa-c.tr { top:0; right:0; border-top-width:2px; border-right-width:2px; border-radius:0 3px 0 0; }
        .psa-c.bl { bottom:0; left:0;  border-bottom-width:2px; border-left-width:2px;  border-radius:0 0 0 3px; }
        .psa-c.br { bottom:0; right:0; border-bottom-width:2px; border-right-width:2px; border-radius:0 0 3px 0; }

        /* ── HUD bars ──────────────────────────────────────── */
        .psa-hud {
          position: absolute; left: 0; right: 0;
          display: flex; align-items: center; padding: 0 20px;
          font-size: 9px; color: rgba(120,0,0,0.55); letter-spacing: 0.1em;
          border-color: rgba(140,0,0,0.2); border-style: solid; border-width: 0;
        }
        .psa-hud.top    { top: 0;    height: 36px; border-bottom-width: 1px; }
        .psa-hud.bottom { bottom: 0; height: 36px; border-top-width: 1px; }
        .psa-hud-seg { flex: 1; }
        .psa-hud-seg.center { text-align: center; color: rgba(180,0,0,0.7); }
        .psa-hud-seg.right  { text-align: right; }
        .psa-hud-pulse {
          display: inline-block; width: 5px; height: 5px; border-radius: 50%;
          background: #cc0000; margin-right: 6px; vertical-align: middle;
          animation: psaHudPulse 0.4s ease-in-out infinite alternate;
        }
        @keyframes psaHudPulse {
          from { opacity: 0.3; box-shadow: 0 0 2px #cc0000; }
          to   { opacity: 1;   box-shadow: 0 0 10px #cc0000; }
        }

        /* ── Center content ────────────────────────────────── */
        .psa-center {
          position: relative; z-index: 20;
          display: flex; flex-direction: column; align-items: center; gap: 22px;
          animation: psaCenterIn 0.2s ease 0.08s both;
        }
        @keyframes psaCenterIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Mode title with RGB glitch ────────────────────── */
        .psa-mode-title {
          text-align: center; letter-spacing: 0.28em;
          font-size: 22px; font-weight: 900; color: #ff3333;
          text-shadow: 0 0 28px rgba(200,0,0,0.8), 0 0 55px rgba(200,0,0,0.3);
          animation: psaTitleGlitch 0.11s steps(1) infinite;
        }
        @keyframes psaTitleGlitch {
          0%   { text-shadow: 0 0 28px rgba(200,0,0,0.8); transform: translate(0,0); }
          8%   { text-shadow: 2px 0 #ff0000, -2px 0 #00ccff; transform: translate(-1px, 0); }
          16%  { text-shadow: 0 0 28px rgba(200,0,0,0.8); transform: translate(0,0); }
          68%  { text-shadow: 0 0 28px rgba(200,0,0,0.8); transform: translate(0,0); }
          71%  { text-shadow: -3px 0 #ff2200, 3px 0 #0033ff; transform: translate(2px, 0); }
          74%  { text-shadow: 0 0 28px rgba(200,0,0,0.8); transform: translate(0,0); }
          91%  { text-shadow: 4px 0 #ff0000, -4px 0 #00ffcc; transform: translate(-2px, 1px); }
          94%  { text-shadow: 0 0 28px rgba(200,0,0,0.8); transform: translate(0,0); }
        }
        .psa-mode-sub {
          font-size: 10px; letter-spacing: 0.25em;
          color: rgba(180,0,0,0.6); margin-top: 3px;
          text-align: center;
        }

        /* ── Progress bar ──────────────────────────────────── */
        .psa-prog { width: 340px; display: flex; flex-direction: column; gap: 8px; }
        .psa-prog-header {
          display: flex; justify-content: space-between;
          font-size: 9px; color: rgba(150,0,0,0.7); letter-spacing: 0.1em;
        }
        .psa-prog-track {
          height: 5px; border-radius: 2px; overflow: hidden;
          background: rgba(80,0,0,0.5); border: 1px solid rgba(120,0,0,0.3);
          position: relative;
        }
        .psa-prog-fill {
          height: 100%; border-radius: 2px; width: 0%;
          background: linear-gradient(90deg, #6b0000, #cc0000, #ff6666, #cc0000);
          background-size: 200% 100%;
          box-shadow: 0 0 10px rgba(200,0,0,0.5);
          animation:
            psaFill ${TOTAL_MS * 0.82}ms cubic-bezier(0.04,0,0.18,1) ${TOTAL_MS * 0.03}ms forwards,
            psaFillShimmer 0.8s linear infinite;
        }
        @keyframes psaFill { from { width: 0%; } to { width: 100%; } }
        @keyframes psaFillShimmer {
          from { background-position: 200% 0; }
          to   { background-position:   0% 0; }
        }
        .psa-prog-fill::after {
          content: ''; position: absolute; top: 0; right: 0; bottom: 0; width: 26px;
          background: linear-gradient(90deg, transparent, rgba(255,150,150,0.9));
          border-radius: 2px;
        }

        /* ── Status lines ──────────────────────────────────── */
        .psa-status {
          width: 340px; font-size: 10px;
          display: flex; flex-direction: column; gap: 5px;
        }
        .psa-st {
          opacity: 0; color: rgba(140,0,0,0.8);
          display: flex; align-items: center; gap: 8px;
          animation: psaStIn 0.3s ease forwards;
        }
        .psa-st::before { content: '▶'; font-size: 7px; color: rgba(180,0,0,0.5); }
        .psa-st.ok::after  { content: ' ✓'; color: rgba(200,80,80,0.9); }
        .psa-st.err::after { content: ' ✗'; color: #ff3333; }
        .psa-st.l1 { animation-delay: ${Math.round(TOTAL_MS * 0.07)}ms; }
        .psa-st.l2 { animation-delay: ${Math.round(TOTAL_MS * 0.17)}ms; }
        .psa-st.l3 { animation-delay: ${Math.round(TOTAL_MS * 0.29)}ms; }
        .psa-st.l4 { animation-delay: ${Math.round(TOTAL_MS * 0.42)}ms; }
        .psa-st.l5 { animation-delay: ${Math.round(TOTAL_MS * 0.55)}ms; color: #cc3333; font-weight: bold; }
        @keyframes psaStIn {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* ── Side panels ───────────────────────────────────── */
        .psa-side {
          position: absolute; top: 0; bottom: 0; width: 180px;
          display: flex; flex-direction: column; justify-content: center;
          padding: 0 24px; font-size: 9px; line-height: 1.65;
          color: rgba(180,0,0,0.5);
        }
        .psa-side.left  { left: 0; }
        .psa-side.right { right: 0; text-align: right; }
        .psa-side-title {
          color: rgba(200,0,0,0.9); font-weight: bold;
          letter-spacing: 0.15em; margin-bottom: 10px;
          border-bottom: 1px solid rgba(180,0,0,0.25); padding-bottom: 6px;
        }
        .psa-side-row { display: flex; justify-content: space-between; gap: 8px; }
        .psa-side.right .psa-side-row { flex-direction: row-reverse; }
        .psa-side-val {
          color: rgba(220,30,30,0.85); font-weight: bold;
          animation: psaValFlicker 0.55s steps(2) infinite;
        }
        @keyframes psaValFlicker { 50% { opacity: 0.4; } }
      `}</style>

      {/* Background */}
      <div className="psa-grid" />
      <div className="psa-scan" />

      {/* Falling chars */}
      <GlitchRain />

      {/* Horizontal glitch tears */}
      <div className="psa-tear t1" />
      <div className="psa-tear t2" />
      <div className="psa-tear t3" />
      <div className="psa-tear t4" />
      <div className="psa-tear t5" />

      {/* Corner brackets */}
      <div className="psa-corner-wrap">
        <div className="psa-c tl" /><div className="psa-c tr" />
        <div className="psa-c bl" /><div className="psa-c br" />
      </div>

      {/* HUD bars */}
      <div className="psa-hud top">
        <span className="psa-hud-seg"><span className="psa-hud-pulse" />IDENTITY OVERRIDE ACTIVE</span>
        <span className="psa-hud-seg center">TG-WORKS :: {modeCode}</span>
        <span className="psa-hud-seg right">CHANNEL: SECURE</span>
      </div>
      <div className="psa-hud bottom">
        <span className="psa-hud-seg">AUTH_LAYER: AES-256</span>
        <span className="psa-hud-seg center">SWITCHING PROFILE</span>
        <span className="psa-hud-seg right">SESSION: ACTIVE</span>
      </div>

      {/* Floating error popups */}
      {ERROR_MSGS.map((e, i) => (
        <div
          key={i}
          className="psa-err"
          style={{
            left: e.left,
            top: e.top,
            color: e.color,
            background: `${e.color}18`,
            border: `1px solid ${e.color}45`,
            "--delay": `${e.delay}ms`,
            "--dur": `${e.dur}ms`,
          } as React.CSSProperties}
        >
          {e.text}
        </div>
      ))}

      {/* Left panel */}
      <div className="psa-side left">
        <div className="psa-side-title">SYS_MONITOR</div>
        <div className="psa-side-row"><span>CPU</span><span className="psa-side-val">94%</span></div>
        <div className="psa-side-row"><span>MEM</span><span className="psa-side-val">3.1GB</span></div>
        <div className="psa-side-row"><span>NET</span><span className="psa-side-val">↑2.4M</span></div>
        <div className="psa-side-row"><span>PING</span><span className="psa-side-val">8ms</span></div>
        <div className="psa-side-row"><span>PROC</span><span className="psa-side-val">212</span></div>
      </div>

      {/* Right panel */}
      <div className="psa-side right">
        <div className="psa-side-title">IDENTITY</div>
        <div className="psa-side-row"><span>USER</span><span className="psa-side-val">ROOT</span></div>
        <div className="psa-side-row"><span>PRIV</span><span className="psa-side-val">ADMIN</span></div>
        <div className="psa-side-row"><span>TOKEN</span><span className="psa-side-val">VALID</span></div>
        <div className="psa-side-row"><span>GUILD</span><span className="psa-side-val">ACTIVE</span></div>
        <div className="psa-side-row"><span>BOTS</span><span className="psa-side-val">3</span></div>
      </div>

      {/* Center */}
      <div className="psa-center">
        <div>
          <div className="psa-mode-title">
            SWITCHING TO&nbsp;
            <ScrambleText target={modeLabel} startDelay={150} duration={1900} />
          </div>
          <div className="psa-mode-sub">IDENTITY PROTOCOL ENGAGED</div>
        </div>

        <div className="psa-prog">
          <div className="psa-prog-header">
            <span>LOADING PROFILE</span>
            <span>ENCRYPTED CHANNEL</span>
          </div>
          <div className="psa-prog-track">
            <div className="psa-prog-fill" />
          </div>
          <div className="psa-prog-header">
            <span>VERIFYING CREDENTIALS</span>
            <span>AES-256-GCM</span>
          </div>
        </div>

        <div className="psa-status">
          <div className="psa-st err l1">FIREWALL_OVERRIDE requested</div>
          <div className="psa-st ok  l2">AUTH_TOKEN re-validated</div>
          <div className="psa-st err l3">MEMORY anomaly detected — patched</div>
          <div className="psa-st ok  l4">SESSION re-encrypted</div>
          <div className="psa-st     l5">ACCESS GRANTED — SWITCHING NOW</div>
        </div>
      </div>
    </div>
  );
}
