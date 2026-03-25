import { useEffect, useRef } from "react";

interface Props {
  onComplete: () => void;
  targetMode: "bot" | "discord";
}

const TOTAL_MS = 2200;

export default function ProfileSwitchAnimation({ onComplete, targetMode }: Props) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const id = setTimeout(() => onCompleteRef.current(), TOTAL_MS);
    return () => clearTimeout(id);
  }, []);

  const isBot = targetMode === "bot";
  const modeLabel = isBot ? "BOT MANAGER" : "DISCORD MODE";
  const modeCode  = isBot ? "MODE::0x02" : "MODE::0x01";

  return (
    <div className="psa">
      <style>{`
        /* ─── Root ─────────────────────────────────── */
        .psa {
          position: fixed; inset: 0; z-index: 9999;
          background: #000;
          overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          animation: psaLife ${TOTAL_MS}ms forwards;
        }
        @keyframes psaLife {
          0%   { opacity: 0; }
          2%   { opacity: 1; }
          4%   { opacity: 0.15; }
          6%   { opacity: 1; }
          8%   { opacity: 0.6; }
          10%  { opacity: 1; }
          82%  { opacity: 1; }
          88%  { opacity: 0.1; }
          91%  { opacity: 0.9; }
          94%  { opacity: 0; }
          100% { opacity: 0; }
        }

        /* ─── Background grid ──────────────────────── */
        .psa-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(180,0,0,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180,0,0,0.07) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: psaGridPan 3s linear infinite;
        }
        @keyframes psaGridPan {
          from { background-position: 0 0; }
          to   { background-position: 40px 40px; }
        }

        /* ─── Radial vignette + glow ───────────────── */
        .psa-vignette {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 70% 60% at 50% 50%,
            rgba(160,0,0,0.22) 0%,
            transparent 65%),
            radial-gradient(ellipse 100% 100% at 50% 50%,
            transparent 50%, rgba(0,0,0,0.8) 100%);
          animation: psaGlowBeat 0.55s ease-in-out infinite alternate;
        }
        @keyframes psaGlowBeat {
          from { opacity: 0.7; }
          to   { opacity: 1; }
        }

        /* ─── Scanlines ────────────────────────────── */
        .psa-scan {
          position: absolute; inset: 0; pointer-events: none;
          background: repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px);
        }

        /* ─── Chromatic aberration ghost layers ────── */
        .psa-ghost {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          pointer-events: none;
        }
        .psa-ghost-r { animation: psaGhostR 0.12s steps(1) infinite; opacity: 0.18; }
        .psa-ghost-b { animation: psaGhostB 0.17s steps(1) infinite; opacity: 0.14; }
        @keyframes psaGhostR {
          0%  { transform: translate(4px, -1px); }
          25% { transform: translate(-3px, 2px); }
          50% { transform: translate(5px, 0px); }
          75% { transform: translate(-2px, -3px); }
          100%{ transform: translate(4px, -1px); }
        }
        @keyframes psaGhostB {
          0%  { transform: translate(-5px, 2px); }
          33% { transform: translate(3px, -2px); }
          66% { transform: translate(-4px, 1px); }
          100%{ transform: translate(-5px, 2px); }
        }
        .psa-ghost-r .psa-logo-wrap svg { filter: drop-shadow(0 0 6px red); }
        .psa-ghost-b .psa-logo-wrap svg { filter: drop-shadow(0 0 6px #00aaff); }

        /* ─── Horizontal glitch slices ─────────────── */
        .psa-glitch-slice {
          position: absolute; left: 0; right: 0; pointer-events: none;
          overflow: hidden; mix-blend-mode: screen;
        }
        .psa-glitch-slice.a {
          top: 22%; height: 3px;
          background: rgba(255,0,0,0.6);
          animation: psaSlice 0.08s steps(1) infinite;
        }
        .psa-glitch-slice.b {
          top: 55%; height: 2px;
          background: rgba(255,0,0,0.4);
          animation: psaSlice 0.11s steps(1) 0.04s infinite;
        }
        .psa-glitch-slice.c {
          top: 73%; height: 4px;
          background: rgba(200,0,0,0.3);
          animation: psaSlice 0.14s steps(1) 0.02s infinite;
        }
        @keyframes psaSlice {
          0%  { opacity: 1; transform: translateX(0); }
          20% { opacity: 0; }
          40% { opacity: 1; transform: translateX(-8px); }
          60% { opacity: 0; }
          80% { opacity: 1; transform: translateX(6px); }
          100%{ opacity: 0; }
        }

        /* ─── Side data panels ─────────────────────── */
        .psa-side {
          position: absolute; top: 0; bottom: 0; width: 200px;
          display: flex; flex-direction: column; justify-content: center;
          padding: 0 24px;
          font-family: 'Courier New', monospace;
          font-size: 9px; line-height: 1.6;
          color: rgba(180,0,0,0.5);
          animation: psaSideIn 0.3s ease forwards;
          opacity: 0;
        }
        .psa-side.left  { left: 0;  animation-delay: 150ms; }
        .psa-side.right { right: 0; text-align: right; animation-delay: 200ms; }
        @keyframes psaSideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .psa-side.right { animation-name: psaSideInR; }
        @keyframes psaSideInR {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .psa-side-title {
          color: rgba(200,0,0,0.9);
          font-weight: bold;
          letter-spacing: 0.15em;
          margin-bottom: 10px;
          border-bottom: 1px solid rgba(180,0,0,0.25);
          padding-bottom: 6px;
        }
        .psa-side-row {
          display: flex; justify-content: space-between; gap: 8px;
          animation: psaSideRow 0.25s ease forwards; opacity: 0;
        }
        .psa-side.right .psa-side-row { flex-direction: row-reverse; }
        .psa-side-row.r1 { animation-delay: 220ms; }
        .psa-side-row.r2 { animation-delay: 340ms; }
        .psa-side-row.r3 { animation-delay: 460ms; }
        .psa-side-row.r4 { animation-delay: 580ms; }
        .psa-side-row.r5 { animation-delay: 700ms; }
        .psa-side-row.r6 { animation-delay: 820ms; }
        @keyframes psaSideRow {
          from { opacity: 0; transform: translateX(-5px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .psa-side-val {
          color: rgba(220,30,30,0.85);
          font-weight: bold;
          font-variant-numeric: tabular-nums;
          animation: psaValFlicker 0.6s steps(2) infinite;
        }
        @keyframes psaValFlicker {
          50% { opacity: 0.6; }
        }

        /* ─── Corner brackets ──────────────────────── */
        .psa-corner-wrap {
          position: absolute; inset: 16px; pointer-events: none;
          animation: psaCornerIn 0.25s cubic-bezier(0.2,0,0,1) forwards;
        }
        @keyframes psaCornerIn {
          from { opacity: 0; transform: scale(1.06); }
          to   { opacity: 1; transform: scale(1); }
        }
        .psa-c {
          position: absolute; width: 32px; height: 32px;
          border: 0px solid rgba(200,0,0,0.65);
        }
        .psa-c.tl { top:0; left:0; border-top-width:2px; border-left-width:2px; border-radius: 3px 0 0 0; }
        .psa-c.tr { top:0; right:0; border-top-width:2px; border-right-width:2px; border-radius: 0 3px 0 0; }
        .psa-c.bl { bottom:0; left:0; border-bottom-width:2px; border-left-width:2px; border-radius: 0 0 0 3px; }
        .psa-c.br { bottom:0; right:0; border-bottom-width:2px; border-right-width:2px; border-radius: 0 0 3px 0; }
        /* tick marks */
        .psa-tick {
          position: absolute; background: rgba(200,0,0,0.4);
        }
        .psa-tick.h { height: 1px; width: 60px; top: 32px; }
        .psa-tick.v { width: 1px; height: 60px; left: 32px; }
        .psa-tick.tl.h { top: 16px; left: 0; }
        .psa-tick.tl.v { top: 0; left: 16px; }
        .psa-tick.tr.h { top: 16px; right: 0; }
        .psa-tick.tr.v { top: 0; right: 16px; }
        .psa-tick.bl.h { bottom: 16px; left: 0; }
        .psa-tick.bl.v { bottom: 0; left: 16px; }
        .psa-tick.br.h { bottom: 16px; right: 0; }
        .psa-tick.br.v { bottom: 0; right: 16px; }

        /* ─── Center content ───────────────────────── */
        .psa-center {
          position: relative; z-index: 20;
          display: flex; flex-direction: column;
          align-items: center; gap: 24px;
          animation: psaCenterIn 0.3s cubic-bezier(0.1,0,0,1) forwards;
          opacity: 0;
        }
        @keyframes psaCenterIn {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* ─── Targeting reticle ────────────────────── */
        .psa-reticle {
          position: relative; width: 140px; height: 140px;
          display: flex; align-items: center; justify-content: center;
        }
        .psa-reticle-ring {
          position: absolute; border-radius: 50%;
          border: 1px solid transparent;
        }
        .psa-reticle-ring.r1 {
          inset: 0;
          border-color: rgba(200,0,0,0.8);
          border-style: solid;
          border-width: 2px;
          box-shadow: 0 0 20px rgba(200,0,0,0.3), inset 0 0 20px rgba(200,0,0,0.1);
          animation: psaReticleSpin1 2s linear infinite;
        }
        .psa-reticle-ring.r2 {
          inset: 14px;
          border-top-color: #cc0000;
          border-right-color: rgba(200,0,0,0.2);
          border-bottom-color: rgba(200,0,0,0.2);
          border-left-color: #cc0000;
          border-width: 1.5px;
          animation: psaReticleSpin2 1.1s linear infinite;
        }
        .psa-reticle-ring.r3 {
          inset: 28px;
          border-top-color: rgba(200,0,0,0.5);
          border-right-color: transparent;
          border-bottom-color: rgba(200,0,0,0.5);
          border-left-color: transparent;
          border-width: 1px;
          animation: psaReticleSpin2 0.7s linear infinite reverse;
        }
        .psa-reticle-ring.r4 {
          inset: 40px;
          border-color: rgba(200,0,0,0.15);
          border-width: 1px;
          border-style: dashed;
        }
        @keyframes psaReticleSpin1 {
          to { transform: rotate(360deg); }
        }
        @keyframes psaReticleSpin2 {
          to { transform: rotate(360deg); }
        }

        /* crosshair */
        .psa-cross { position: absolute; inset: 0; pointer-events: none; }
        .psa-cross::before, .psa-cross::after {
          content: ''; position: absolute; background: rgba(200,0,0,0.35);
        }
        .psa-cross::before { /* horizontal */
          top: 50%; left: 8px; right: 8px; height: 1px;
          transform: translateY(-50%);
        }
        .psa-cross::after { /* vertical */
          left: 50%; top: 8px; bottom: 8px; width: 1px;
          transform: translateX(-50%);
        }

        /* center dot */
        .psa-dot {
          position: relative; z-index: 2;
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #cc0000;
          box-shadow: 0 0 0 3px rgba(200,0,0,0.2), 0 0 20px #cc0000;
          animation: psaDotPulse 0.5s ease-in-out infinite alternate;
        }
        @keyframes psaDotPulse {
          from { box-shadow: 0 0 0 3px rgba(200,0,0,0.2), 0 0 12px #cc0000; transform: scale(1); }
          to   { box-shadow: 0 0 0 6px rgba(200,0,0,0.1), 0 0 28px #ff4444; transform: scale(1.2); }
        }

        /* tick marks around r1 ring */
        .psa-tick-mark {
          position: absolute; width: 6px; height: 2px;
          background: rgba(200,0,0,0.8);
          top: 50%; transform-origin: -63px 0;
          transform: translateY(-1px) rotate(var(--a));
        }

        /* ─── Logo ─────────────────────────────────── */
        .psa-logo-wrap {
          position: absolute; z-index: 5;
          display: flex; align-items: center; justify-content: center;
        }
        .psa-logo-wrap svg {
          width: 32px; height: 32px;
          fill: #cc0000;
          filter: drop-shadow(0 0 12px rgba(200,0,0,0.8));
          animation: psaLogoGlow 0.6s ease-in-out infinite alternate;
        }
        @keyframes psaLogoGlow {
          from { filter: drop-shadow(0 0 8px #cc0000); }
          to   { filter: drop-shadow(0 0 24px #ff4444) drop-shadow(0 0 48px rgba(200,0,0,0.4)); }
        }

        /* ─── Mode label ───────────────────────────── */
        .psa-mode-title {
          text-align: center; letter-spacing: 0.3em;
          font-family: 'Courier New', monospace;
          font-size: 20px; font-weight: 900;
          color: #ff3333;
          text-shadow: 0 0 30px rgba(200,0,0,0.7), 0 0 60px rgba(200,0,0,0.3);
          animation: psaTitleFlicker ${TOTAL_MS}ms steps(1) forwards;
          position: relative;
        }
        @keyframes psaTitleFlicker {
          0%, 100% { opacity: 1; }
          15%       { opacity: 0.8; }
          30%       { opacity: 1; }
          45%       { opacity: 0.6; }
          50%       { opacity: 1; }
        }
        .psa-mode-sub {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          letter-spacing: 0.25em;
          color: rgba(180,0,0,0.6);
          margin-top: 4px;
        }

        /* ─── Progress ─────────────────────────────── */
        .psa-prog {
          width: 320px; display: flex; flex-direction: column; gap: 8px;
        }
        .psa-prog-header {
          display: flex; justify-content: space-between;
          font-family: 'Courier New', monospace;
          font-size: 9px; color: rgba(150,0,0,0.7);
          letter-spacing: 0.1em;
        }
        .psa-prog-track {
          height: 4px;
          background: rgba(80,0,0,0.5);
          border: 1px solid rgba(120,0,0,0.3);
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }
        .psa-prog-fill {
          height: 100%;
          background: linear-gradient(90deg, #6b0000, #cc0000, #ff6666, #cc0000);
          background-size: 200% 100%;
          border-radius: 2px;
          width: 0%;
          animation:
            psaFill ${TOTAL_MS * 0.74}ms cubic-bezier(0.05,0,0.35,1) ${TOTAL_MS * 0.06}ms forwards,
            psaFillShimmer 0.8s linear infinite;
          box-shadow: 0 0 10px rgba(200,0,0,0.5);
        }
        @keyframes psaFill {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes psaFillShimmer {
          from { background-position: 200% 0; }
          to   { background-position: 0% 0; }
        }
        /* bright leading edge */
        .psa-prog-fill::after {
          content: '';
          position: absolute; top: 0; right: 0; bottom: 0;
          width: 20px;
          background: linear-gradient(90deg, transparent, rgba(255,150,150,0.8));
          border-radius: 2px;
        }

        /* ─── Status lines ─────────────────────────── */
        .psa-status {
          width: 320px; font-family: 'Courier New', monospace;
          font-size: 10px; display: flex; flex-direction: column; gap: 4px;
        }
        .psa-st {
          opacity: 0;
          color: rgba(140,0,0,0.8);
          display: flex; align-items: center; gap: 8px;
          animation: psaStIn 0.25s ease forwards;
        }
        .psa-st::before {
          content: '▶';
          font-size: 7px;
          color: rgba(180,0,0,0.6);
        }
        .psa-st.ok::after { content: ' ✓'; color: rgba(200,80,80,0.9); }
        .psa-st.l1 { animation-delay: ${TOTAL_MS * 0.10}ms; }
        .psa-st.l2 { animation-delay: ${TOTAL_MS * 0.25}ms; }
        .psa-st.l3 { animation-delay: ${TOTAL_MS * 0.42}ms; }
        .psa-st.l4 {
          animation-delay: ${TOTAL_MS * 0.60}ms;
          color: #cc3333; font-weight: bold;
        }
        @keyframes psaStIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* ─── Top / bottom HUD bars ─────────────────── */
        .psa-hud {
          position: absolute; left: 0; right: 0;
          display: flex; align-items: center;
          padding: 0 20px;
          font-family: 'Courier New', monospace;
          font-size: 9px; color: rgba(120,0,0,0.55);
          letter-spacing: 0.1em;
          border-color: rgba(140,0,0,0.2);
          border-style: solid; border-width: 0;
          animation: psaHudIn 0.3s ease forwards; opacity: 0;
        }
        .psa-hud.top    { top: 0; height: 36px; border-bottom-width: 1px; animation-delay: 80ms; }
        .psa-hud.bottom { bottom: 0; height: 36px; border-top-width: 1px; animation-delay: 120ms; }
        @keyframes psaHudIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .psa-hud-seg { flex: 1; }
        .psa-hud-seg.center { text-align: center; color: rgba(180,0,0,0.7); }
        .psa-hud-seg.right  { text-align: right; }
        .psa-hud-pulse {
          display: inline-block; width: 5px; height: 5px;
          border-radius: 50%; background: #cc0000; margin-right: 6px;
          box-shadow: 0 0 6px #cc0000;
          animation: psaHudPulse 0.45s ease-in-out infinite alternate;
          vertical-align: middle;
        }
        @keyframes psaHudPulse {
          from { opacity: 0.3; box-shadow: 0 0 2px #cc0000; }
          to   { opacity: 1;   box-shadow: 0 0 10px #cc0000; }
        }

        /* ─── Binary rain ───────────────────────────── */
        .psa-rain {
          position: absolute; inset: 0;
          overflow: hidden; pointer-events: none; opacity: 0.12;
        }
        .psa-rain-col {
          position: absolute; top: 0;
          font-family: 'Courier New', monospace;
          font-size: 11px; line-height: 15px;
          color: #cc0000; white-space: pre;
          transform: translateY(-100%);
          animation: psaRain linear infinite;
        }
        @keyframes psaRain { to { transform: translateY(160vh); } }
      `}</style>

      {/* Background layers */}
      <div className="psa-grid" />
      <div className="psa-vignette" />
      <div className="psa-scan" />

      {/* Glitch slices */}
      <div className="psa-glitch-slice a" />
      <div className="psa-glitch-slice b" />
      <div className="psa-glitch-slice c" />

      {/* Binary rain */}
      <BinaryRain />

      {/* Corner brackets */}
      <div className="psa-corner-wrap">
        <div className="psa-c tl" /><div className="psa-c tr" />
        <div className="psa-c bl" /><div className="psa-c br" />
        <div className="psa-tick tl h" /><div className="psa-tick tl v" />
        <div className="psa-tick tr h" /><div className="psa-tick tr v" />
        <div className="psa-tick bl h" /><div className="psa-tick bl v" />
        <div className="psa-tick br h" /><div className="psa-tick br v" />
      </div>

      {/* HUD bars */}
      <div className="psa-hud top">
        <span className="psa-hud-seg">
          <span className="psa-hud-pulse" />
          IDENTITY OVERRIDE ACTIVE
        </span>
        <span className="psa-hud-seg center">TG-WORKS :: {modeCode}</span>
        <span className="psa-hud-seg right">CHANNEL: SECURE</span>
      </div>
      <div className="psa-hud bottom">
        <span className="psa-hud-seg">AUTH_LAYER: AES-256</span>
        <span className="psa-hud-seg center">SWITCHING PROFILE</span>
        <span className="psa-hud-seg right">SESSION: ACTIVE</span>
      </div>

      {/* Left side panel */}
      <div className="psa-side left">
        <div className="psa-side-title">SYS_MONITOR</div>
        <div className="psa-side-row r1"><span>CPU</span><span className="psa-side-val">87%</span></div>
        <div className="psa-side-row r2"><span>MEM</span><span className="psa-side-val">2.4GB</span></div>
        <div className="psa-side-row r3"><span>NET</span><span className="psa-side-val">↑1.2M</span></div>
        <div className="psa-side-row r4"><span>PING</span><span className="psa-side-val">12ms</span></div>
        <div className="psa-side-row r5"><span>PROC</span><span className="psa-side-val">141</span></div>
        <div className="psa-side-row r6"><span>UPTIME</span><span className="psa-side-val">14h</span></div>
      </div>

      {/* Right side panel */}
      <div className="psa-side right">
        <div className="psa-side-title">IDENTITY</div>
        <div className="psa-side-row r1"><span>USER</span><span className="psa-side-val">ROOT</span></div>
        <div className="psa-side-row r2"><span>PRIV</span><span className="psa-side-val">ADMIN</span></div>
        <div className="psa-side-row r3"><span>TOKEN</span><span className="psa-side-val">VALID</span></div>
        <div className="psa-side-row r4"><span>GUILD</span><span className="psa-side-val">ACTIVE</span></div>
        <div className="psa-side-row r5"><span>BOTS</span><span className="psa-side-val">3</span></div>
        <div className="psa-side-row r6"><span>SCOPE</span><span className="psa-side-val">FULL</span></div>
      </div>

      {/* Chromatic aberration ghosts */}
      <div className="psa-ghost psa-ghost-r">
        <LogoSVG />
      </div>
      <div className="psa-ghost psa-ghost-b">
        <LogoSVG />
      </div>

      {/* Center content */}
      <div className="psa-center">
        <div className="psa-reticle">
          <div className="psa-reticle-ring r1" />
          <div className="psa-reticle-ring r2" />
          <div className="psa-reticle-ring r3" />
          <div className="psa-reticle-ring r4" />
          <div className="psa-cross" />
          {TICK_ANGLES.map((a, i) => (
            <div key={i} className="psa-tick-mark" style={{ "--a": `${a}deg` } as React.CSSProperties} />
          ))}
          <div className="psa-logo-wrap">
            <LogoSVG />
          </div>
          <div className="psa-dot" />
        </div>

        <div>
          <div className="psa-mode-title">SWITCHING TO {modeLabel}</div>
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
          <div className="psa-st ok l1">AUTH_TOKEN validated</div>
          <div className="psa-st ok l2">SESSION encrypted</div>
          <div className="psa-st ok l3">PROFILE loaded</div>
          <div className="psa-st l4">ACCESS GRANTED — SWITCHING NOW</div>
        </div>
      </div>
    </div>
  );
}

const TICK_ANGLES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

function LogoSVG() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
    </svg>
  );
}

const RAIN_COLS = Array.from({ length: 26 }, (_, i) => ({
  id: i,
  chars: Array.from({ length: 24 }, () => (Math.random() > 0.5 ? "1" : "0")).join("\n"),
  left: `${(i / 26) * 100}%`,
  duration: `${0.9 + Math.random() * 0.8}s`,
  delay: `${-(Math.random() * 0.8)}s`,
}));

function BinaryRain() {
  return (
    <div className="psa-rain">
      {RAIN_COLS.map((col) => (
        <div
          key={col.id}
          className="psa-rain-col"
          style={{ left: col.left, animationDuration: col.duration, animationDelay: col.delay }}
        >
          {col.chars}
        </div>
      ))}
    </div>
  );
}
