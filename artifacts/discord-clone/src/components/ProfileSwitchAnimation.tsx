import { useEffect, useRef } from "react";

interface Props {
  onComplete: () => void;
  targetMode: "bot" | "discord";
}

const TOTAL_MS = 1800;

export default function ProfileSwitchAnimation({ onComplete, targetMode }: Props) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const id = setTimeout(() => onCompleteRef.current(), TOTAL_MS);
    return () => clearTimeout(id);
  }, []);

  const label = targetMode === "bot" ? "BOT MANAGER" : "DISCORD MODE";

  return (
    <div className="psa-root">
      <style>{`
        .psa-root {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          animation: psaWrap ${TOTAL_MS}ms ease forwards;
        }
        @keyframes psaWrap {
          0%   { opacity: 0; }
          6%   { opacity: 1; }
          78%  { opacity: 1; }
          100% { opacity: 0; }
        }

        /* ── Radial glow ── */
        .psa-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 55% 45% at 50% 50%, rgba(200,0,0,0.18) 0%, transparent 70%);
          animation: psaGlowPulse 0.6s ease-in-out infinite alternate;
        }
        @keyframes psaGlowPulse {
          from { opacity: 0.6; }
          to   { opacity: 1; }
        }

        /* ── Scanline overlay ── */
        .psa-scanlines {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(0,0,0,0.22) 3px,
            rgba(0,0,0,0.22) 4px
          );
        }

        /* ── Sweep line ── */
        .psa-sweep {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, #cc0000 40%, #ff4444 50%, #cc0000 60%, transparent 100%);
          box-shadow: 0 0 18px 3px rgba(200,0,0,0.7);
          animation: psaSweep ${TOTAL_MS * 0.72}ms cubic-bezier(0.4,0,0.2,1) forwards;
          animation-delay: ${TOTAL_MS * 0.06}ms;
          top: 0;
        }
        @keyframes psaSweep {
          from { top: 0%; opacity: 0.9; }
          to   { top: 100%; opacity: 0.2; }
        }

        /* ── Corner brackets ── */
        .psa-corners {
          position: absolute;
          inset: 24px;
          pointer-events: none;
          animation: psaCornersIn 0.2s ease forwards;
        }
        @keyframes psaCornersIn {
          from { opacity: 0; transform: scale(1.04); }
          to   { opacity: 1; transform: scale(1); }
        }
        .psa-corner {
          position: absolute;
          width: 24px;
          height: 24px;
          border-color: rgba(180,0,0,0.7);
          border-style: solid;
          border-width: 0;
        }
        .psa-corner.tl { top:0; left:0; border-top-width:2px; border-left-width:2px; border-radius:2px 0 0 0; }
        .psa-corner.tr { top:0; right:0; border-top-width:2px; border-right-width:2px; border-radius:0 2px 0 0; }
        .psa-corner.bl { bottom:0; left:0; border-bottom-width:2px; border-left-width:2px; border-radius:0 0 0 2px; }
        .psa-corner.br { bottom:0; right:0; border-bottom-width:2px; border-right-width:2px; border-radius:0 0 2px 0; }

        /* ── HUD lines ── */
        .psa-hud-h {
          position: absolute;
          left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(150,0,0,0.4), transparent);
        }
        .psa-hud-h.top    { top: 60px; }
        .psa-hud-h.bottom { bottom: 60px; }

        /* ── Binary rain ── */
        .psa-rain {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          opacity: 0.18;
        }
        .psa-rain-col {
          position: absolute;
          top: 0;
          font-size: 10px;
          font-family: 'Courier New', monospace;
          line-height: 14px;
          color: #cc0000;
          animation: psaRainFall linear infinite;
          transform: translateY(-100%);
        }
        @keyframes psaRainFall {
          to { transform: translateY(200%); }
        }

        /* ── Central panel ── */
        .psa-panel {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          animation: psaPanelIn 0.25s ease forwards;
        }
        @keyframes psaPanelIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Spinner ── */
        .psa-spinner-wrap {
          position: relative;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .psa-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid transparent;
        }
        .psa-ring.outer {
          border-top-color: #cc0000;
          border-right-color: rgba(180,0,0,0.3);
          animation: psaSpin 0.9s linear infinite;
        }
        .psa-ring.inner {
          inset: 8px;
          border-bottom-color: #ff4444;
          border-left-color: rgba(200,0,0,0.2);
          animation: psaSpin 0.65s linear infinite reverse;
        }
        @keyframes psaSpin {
          to { transform: rotate(360deg); }
        }
        .psa-logo {
          width: 28px;
          height: 28px;
          fill: #cc0000;
          filter: drop-shadow(0 0 10px #cc0000);
          animation: psaLogoPulse 0.7s ease-in-out infinite alternate;
        }
        @keyframes psaLogoPulse {
          from { filter: drop-shadow(0 0 6px #cc0000); }
          to   { filter: drop-shadow(0 0 18px #ff4444) drop-shadow(0 0 30px #cc000066); }
        }

        /* ── Label ── */
        .psa-label {
          text-align: center;
        }
        .psa-label-main {
          font-family: 'Courier New', monospace;
          font-size: 15px;
          font-weight: bold;
          letter-spacing: 0.3em;
          color: #ff4444;
          text-shadow: 0 0 16px #cc000099;
          animation: psaLabelGlow 0.6s ease-in-out infinite alternate;
        }
        @keyframes psaLabelGlow {
          from { text-shadow: 0 0 8px #cc0000; }
          to   { text-shadow: 0 0 22px #ff4444, 0 0 40px #cc000066; }
        }
        .psa-label-sub {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: rgba(160,0,0,0.7);
          margin-top: 6px;
        }

        /* ── Progress bar ── */
        .psa-bar-wrap {
          width: 300px;
        }
        .psa-bar-meta {
          display: flex;
          justify-content: space-between;
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: rgba(120,0,0,0.8);
          margin-bottom: 6px;
        }
        .psa-bar-track {
          height: 3px;
          background: rgba(80,0,0,0.4);
          border-radius: 4px;
          overflow: hidden;
        }
        .psa-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b0000, #cc0000, #ff4444);
          border-radius: 4px;
          box-shadow: 0 0 12px rgba(200,0,0,0.6);
          animation: psaBarFill ${TOTAL_MS * 0.72}ms cubic-bezier(0.1,0,0.4,1) forwards;
          animation-delay: ${TOTAL_MS * 0.06}ms;
          width: 0%;
        }
        @keyframes psaBarFill {
          from { width: 0%; }
          to   { width: 100%; }
        }
        .psa-bar-label {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          color: rgba(100,0,0,0.6);
          margin-top: 4px;
          display: flex;
          justify-content: space-between;
        }

        /* ── Status lines ── */
        .psa-status {
          width: 300px;
          display: flex;
          flex-direction: column;
          gap: 3px;
          font-family: 'Courier New', monospace;
          font-size: 10px;
        }
        .psa-status-line {
          color: rgba(120,0,0,0.7);
          opacity: 0;
          animation: psaStatusIn 0.3s ease forwards;
        }
        .psa-status-line.s1 { animation-delay: ${TOTAL_MS * 0.12}ms; color: rgba(180,0,0,0.8); }
        .psa-status-line.s2 { animation-delay: ${TOTAL_MS * 0.30}ms; }
        .psa-status-line.s3 { animation-delay: ${TOTAL_MS * 0.50}ms; }
        .psa-status-line.s4 {
          animation-delay: ${TOTAL_MS * 0.68}ms;
          color: #cc0000;
          animation: psaStatusIn 0.3s ease forwards, psaStatusBlink 0.35s ease ${TOTAL_MS * 0.68}ms infinite alternate;
        }
        @keyframes psaStatusIn {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes psaStatusBlink {
          from { opacity: 0.6; }
          to   { opacity: 1; }
        }

        /* ── Top/bottom HUD ── */
        .psa-hud-top, .psa-hud-bottom {
          position: absolute;
          left: 40px;
          right: 40px;
          display: flex;
          justify-content: space-between;
          font-family: 'Courier New', monospace;
          font-size: 9px;
          color: rgba(100,0,0,0.6);
          z-index: 10;
        }
        .psa-hud-top { top: 16px; }
        .psa-hud-bottom { bottom: 16px; }
        .psa-hud-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #cc0000;
          margin-right: 6px;
          animation: psaDotPulse 0.5s ease-in-out infinite alternate;
        }
        @keyframes psaDotPulse {
          from { opacity: 0.4; box-shadow: 0 0 2px #cc0000; }
          to   { opacity: 1;   box-shadow: 0 0 8px #cc0000; }
        }
      `}</style>

      <div className="psa-glow" />
      <div className="psa-scanlines" />
      <div className="psa-sweep" />
      <div className="psa-hud-h top" />
      <div className="psa-hud-h bottom" />

      <div className="psa-corners">
        <div className="psa-corner tl" />
        <div className="psa-corner tr" />
        <div className="psa-corner bl" />
        <div className="psa-corner br" />
      </div>

      <BinaryRain />

      <div className="psa-hud-top">
        <span><span className="psa-hud-dot" />IDENTITY OVERRIDE</span>
        <span>TG-WORKS :: v2.4</span>
        <span>SECURE</span>
      </div>

      <div className="psa-hud-bottom">
        <span>AUTH_LAYER: ACTIVE</span>
        <span>ENCRYPTION: ON</span>
        <span>SESSION: VERIFIED</span>
      </div>

      <div className="psa-panel">
        <div className="psa-spinner-wrap">
          <div className="psa-ring outer" />
          <div className="psa-ring inner" />
          <svg viewBox="0 0 24 24" className="psa-logo">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
          </svg>
        </div>

        <div className="psa-label">
          <div className="psa-label-main">SWITCHING TO {label}</div>
          <div className="psa-label-sub">IDENTITY PROTOCOL ACTIVE</div>
        </div>

        <div className="psa-bar-wrap">
          <div className="psa-bar-meta">
            <span>LOADING PROFILE</span>
            <span style={{ color: "#cc0000" }}>SECURE</span>
          </div>
          <div className="psa-bar-track">
            <div className="psa-bar-fill" />
          </div>
          <div className="psa-bar-label">
            <span>VERIFYING CREDENTIALS</span>
            <span>ENCRYPTED</span>
          </div>
        </div>

        <div className="psa-status">
          <div className="psa-status-line s1">{">"} AUTH_TOKEN validated</div>
          <div className="psa-status-line s2">{">"} SESSION encrypted</div>
          <div className="psa-status-line s3">{">"} PROFILE loading...</div>
          <div className="psa-status-line s4">{">"} ACCESS GRANTED</div>
        </div>
      </div>
    </div>
  );
}

const RAIN_COLS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  chars: Array.from({ length: 20 }, () => (Math.random() > 0.5 ? "1" : "0")).join("\n"),
  left: `${(i / 22) * 100 + (Math.random() * 2)}%`,
  duration: `${0.8 + Math.random() * 0.7}s`,
  delay: `${Math.random() * 0.5}s`,
}));

function BinaryRain() {
  return (
    <div className="psa-rain">
      {RAIN_COLS.map((col) => (
        <div
          key={col.id}
          className="psa-rain-col"
          style={{
            left: col.left,
            animationDuration: col.duration,
            animationDelay: col.delay,
          }}
        >
          {col.chars}
        </div>
      ))}
    </div>
  );
}
