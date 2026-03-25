import { useState, useEffect, useRef } from "react";
import { AlertCircle } from "lucide-react";
import { useDiscord } from "@/hooks/useDiscord";

function SpaceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.6 + 0.2,
      opacity: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.12 + 0.03,
      twinkleOffset: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
    }));
    const nebulae = Array.from({ length: 5 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      rx: Math.random() * 300 + 150,
      ry: Math.random() * 200 + 100,
      color: ["rgba(29,110,245,", "rgba(80,0,180,", "rgba(0,120,200,", "rgba(60,0,160,", "rgba(0,60,180,"][Math.floor(Math.random() * 5)],
      opacity: Math.random() * 0.06 + 0.02,
      driftX: (Math.random() - 0.5) * 0.07,
      driftY: (Math.random() - 0.5) * 0.05,
    }));
    let frame = 0;
    const draw = () => {
      frame++;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W, H);
      nebulae.forEach((n) => {
        n.x += n.driftX; n.y += n.driftY;
        if (n.x < -n.rx) n.x = W + n.rx;
        if (n.x > W + n.rx) n.x = -n.rx;
        if (n.y < -n.ry) n.y = H + n.ry;
        if (n.y > H + n.ry) n.y = -n.ry;
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.rx);
        grad.addColorStop(0, n.color + n.opacity + ")");
        grad.addColorStop(1, n.color + "0)");
        ctx.beginPath();
        ctx.ellipse(n.x, n.y, n.rx, n.ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });
      stars.forEach((s) => {
        s.y += s.speed;
        if (s.y > H) { s.y = 0; s.x = Math.random() * W; }
        const twinkle = 0.5 + 0.5 * Math.sin(frame * s.twinkleSpeed + s.twinkleOffset);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity * (0.6 + 0.4 * twinkle)})`;
        ctx.fill();
      });
      if (Math.random() < 0.003) {
        const sx = Math.random() * W, sy = Math.random() * H * 0.5, len = Math.random() * 120 + 60;
        const g = ctx.createLinearGradient(sx, sy, sx + len, sy + len * 0.4);
        g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(0.5, "rgba(255,255,255,0.7)"); g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + len, sy + len * 0.4);
        ctx.strokeStyle = g; ctx.lineWidth = 1.2; ctx.stroke();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} />;
}

function DotRobot() {
  return (
    <img
      src="/robot.png"
      alt="Robot"
      style={{
        width: 230,
        height: 230,
        objectFit: "contain",
        display: "block",
        mixBlendMode: "screen",
        filter: "brightness(1.2)",
        animation: "robotPulse 3s ease-in-out infinite",
      }}
    />
  );
}

export default function Login() {
  const { login } = useDiscord();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    if (!token.trim()) return;
    setError(null);
    setLoading(true);
    const res = await login(token.trim(), "user");
    setLoading(false);
    if (!res.success) setError(res.error ?? "Invalid token. Check and try again.");
  }

  return (
    <div className="flex h-screen w-full items-center justify-center" style={{ background: "#000000", position: "relative" }}>
      <SpaceCanvas />

      <div
        className="animate-scale-in"
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          width: "min(860px, 94vw)",
          minHeight: 420,
          borderRadius: 24,
          overflow: "hidden",
          background: "rgba(5,8,18,0.72)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(29,100,245,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
          backdropFilter: "blur(32px)",
        }}
      >
        {/* LEFT — form panel */}
        <div
          style={{
            flex: "0 0 46%",
            padding: "44px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            borderRight: "1px solid rgba(255,255,255,0.055)",
          }}
        >
          <h1
            style={{
              fontSize: 26,
              fontWeight: 900,
              color: "#ffffff",
              marginBottom: 6,
              letterSpacing: "-0.02em",
              fontStyle: "italic",
            }}
          >
            TG Works
          </h1>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", marginBottom: 32, letterSpacing: "0.02em" }}>
            Secure access portal
          </p>

          <label
            style={{
              display: "block",
              fontSize: 9.5,
              fontWeight: 700,
              color: "rgba(100,140,200,0.7)",
              letterSpacing: "0.22em",
              fontFamily: "'Courier New', monospace",
              marginBottom: 8,
            }}
          >
            REGISTRY TOKEN
          </label>
          <input
            type="password"
            placeholder="MTQxxx.xxx.xxx-yyyy-A"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{
              width: "100%",
              boxSizing: "border-box",
              background: "rgba(0,0,0,0.55)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 10,
              padding: "11px 14px",
              fontSize: 13,
              color: "rgba(160,200,255,0.85)",
              fontFamily: "'Courier New', monospace",
              outline: "none",
              caretColor: "#1d6ef5",
              marginBottom: 16,
            }}
            autoComplete="off"
            spellCheck={false}
          />

          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                marginBottom: 14,
                padding: "10px 12px",
                borderRadius: 10,
                background: "rgba(237,66,69,0.08)",
                border: "1px solid rgba(237,66,69,0.2)",
              }}
            >
              <AlertCircle size={14} color="#ed4245" style={{ marginTop: 1, flexShrink: 0 }} />
              <p style={{ fontSize: 11.5, color: "#ed4245", margin: 0, lineHeight: 1.5 }}>{error}</p>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={!token.trim() || loading}
            style={{
              width: "100%",
              padding: "13px 0",
              borderRadius: 50,
              border: "none",
              background: "linear-gradient(135deg, #1d6ef5 0%, #1252cc 100%)",
              color: "#fff",
              fontSize: 11.5,
              fontWeight: 900,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: token.trim() && !loading ? "pointer" : "not-allowed",
              opacity: !token.trim() || loading ? 0.35 : 1,
              boxShadow: "0 8px 26px rgba(29,110,245,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "opacity 0.2s, transform 0.1s",
            }}
          >
            {loading ? (
              <>
                <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", animation: "spin 0.7s linear infinite" }} />
                CONNECTING…
              </>
            ) : "INITIALIZE UPLINK"}
          </button>
          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes robotPulse {
              0%, 100% { opacity: 0.9; filter: brightness(1.15); }
              50% { opacity: 1; filter: brightness(1.4); }
            }
          `}</style>
        </div>

        {/* RIGHT — robot panel */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 32px",
            background: "rgba(0,0,0,0.18)",
            position: "relative",
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <DotRobot />
          </div>

          <h2
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "0.08em",
              marginBottom: 6,
              textAlign: "center",
            }}
          >
            TG Works
          </h2>
          <p
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.35)",
              textAlign: "center",
              letterSpacing: "0.04em",
              lineHeight: 1.6,
              maxWidth: 200,
              marginBottom: 20,
            }}
          >
            The secure gateway that understands your workflow
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {["✦  High-security token auth", "✦  Encrypted session layer", "✦  Full audit trail"].map((t) => (
              <p key={t} style={{ fontSize: 10.5, color: "rgba(100,180,255,0.6)", margin: 0, letterSpacing: "0.02em" }}>{t}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
