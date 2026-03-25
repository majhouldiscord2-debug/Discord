export function DotRobot() {
  const DR = 2.0;
  const DS = 9;
  const COLS = 33;
  const ROWS = 29;
  const W = COLS * DS; // 297
  const H = ROWS * DS; // 261

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ display: "block" }}
    >
      <defs>
        <pattern id="dotgrid" width={DS} height={DS} patternUnits="userSpaceOnUse">
          <circle cx={DS / 2} cy={DS / 2} r={DR} fill="rgba(255,255,255,0.72)" />
        </pattern>

        {/* Mask: white = show dots, black = hide dots (character silhouette) */}
        <mask id="charMask">
          <rect width={W} height={H} fill="white" />
          {/* Hat dome — wide bell curve */}
          <path d="M 28,112 C 28,0 269,0 269,112 Z" fill="black" />
          {/* Hat brim — full width solid bar */}
          <rect x="0" y="121" width={W} height="17" fill="black" />
          {/* Sub-brim shadow row (nearly full width) */}
          <rect x="9" y="152" width={W - 18} height="9" fill="black" />
          {/* Face (narrower) */}
          <rect x="93" y="152" width="111" height="46" fill="black" />
          {/* Body */}
          <rect x="74" y="198" width="149" height="54" rx="2" fill="black" />
          {/* Left arm */}
          <rect x="0" y="198" width="74" height="36" rx="2" fill="black" />
          {/* Right arm */}
          <rect x="223" y="198" width={W - 223} height="36" rx="2" fill="black" />
          {/* Left lower leg */}
          <rect x="83" y="252" width="40" height="9" rx="1" fill="black" />
          {/* Right lower leg */}
          <rect x="174" y="252" width="40" height="9" rx="1" fill="black" />
        </mask>

        <filter id="eyeGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="1.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Character silhouette (black, behind the dot layer) ── */}
      <path d="M 28,112 C 28,0 269,0 269,112 Z" fill="black" />
      <rect x="0" y="121" width={W} height="17" fill="black" />
      <rect x="9" y="152" width={W - 18} height="9" fill="black" />
      <rect x="93" y="152" width="111" height="46" fill="black" />
      <rect x="74" y="198" width="149" height="54" rx="2" fill="black" />
      <rect x="0" y="198" width="74" height="36" rx="2" fill="black" />
      <rect x="223" y="198" width={W - 223} height="36" rx="2" fill="black" />
      <rect x="83" y="252" width="40" height="9" rx="1" fill="black" />
      <rect x="174" y="252" width="40" height="9" rx="1" fill="black" />

      {/* ── Dot grid (masked — dots only visible outside silhouette) ── */}
      <rect width={W} height={H} fill="url(#dotgrid)" mask="url(#charMask)" />

      {/* ── Inner detail: hat brim stripe (single dot row within brim) ── */}
      {Array.from({ length: COLS }, (_, c) => (
        <circle
          key={`brim-${c}`}
          cx={c * DS + DS / 2}
          cy={129.5}
          r={DR * 0.72}
          fill="rgba(255,255,255,0.52)"
        />
      ))}

      {/* ── Inner detail: sub-brim row ── */}
      {Array.from({ length: COLS - 2 }, (_, c) => (
        <circle
          key={`subbrim-${c}`}
          cx={(c + 1) * DS + DS / 2}
          cy={156}
          r={DR * 0.62}
          fill="rgba(255,255,255,0.38)"
        />
      ))}

      {/* ── Eyes (glowing cyan) ── */}
      <circle
        cx={130}
        cy={179}
        r={DR * 1.6}
        fill="rgba(0,215,255,0.95)"
        filter="url(#eyeGlow)"
        style={{ animation: "epulse 2.8s ease-in-out infinite" }}
      />
      <circle
        cx={167}
        cy={179}
        r={DR * 1.6}
        fill="rgba(0,215,255,0.95)"
        filter="url(#eyeGlow)"
        style={{ animation: "epulse 2.8s ease-in-out infinite 0.5s" }}
      />

      {/* ── Body inner texture dots ── */}
      {[
        [88,210],[97,210],[106,210],[115,210],[124,210],[133,210],[142,210],[151,210],[160,210],[169,210],[178,210],[187,210],[196,210],[205,210],
        [88,219],[97,219],[106,219],[115,219],[124,219],[133,219],[142,219],[151,219],[160,219],[169,219],[178,219],[187,219],[196,219],[205,219],
        [88,228],[97,228],[106,228],[115,228],[124,228],[133,228],[142,228],[151,228],[160,228],[169,228],[178,228],[187,228],[196,228],[205,228],
      ].map(([cx, cy], i) => (
        <circle
          key={`bd-${i}`}
          cx={cx}
          cy={cy}
          r={DR * 0.55}
          fill="rgba(255,255,255,0.22)"
        />
      ))}

      {/* ── Arm inner dots ── */}
      {[
        [13,207],[22,207],[31,207],[40,207],[49,207],[58,207],[67,207],
        [13,216],[22,216],[31,216],[40,216],[49,216],[58,216],[67,216],
        [13,225],[22,225],[31,225],[40,225],[49,225],[58,225],[67,225],
        [229,207],[238,207],[247,207],[256,207],[265,207],[274,207],[283,207],
        [229,216],[238,216],[247,216],[256,216],[265,216],[274,216],[283,216],
        [229,225],[238,225],[247,225],[256,225],[265,225],[274,225],[283,225],
      ].map(([cx, cy], i) => (
        <circle
          key={`arm-${i}`}
          cx={cx}
          cy={cy}
          r={DR * 0.52}
          fill="rgba(255,255,255,0.18)"
        />
      ))}

      <style>{`
        @keyframes epulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </svg>
  );
}
