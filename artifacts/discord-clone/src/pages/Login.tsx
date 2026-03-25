import { useState, useEffect, useRef } from "react";
import { AlertCircle } from "lucide-react";
import { useDiscord } from "@/hooks/useDiscord";

function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.72,
      r: Math.random() * 1.3 + 0.15,
      base: Math.random() * 0.55 + 0.2,
      offset: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.018 + 0.004,
    }));
    let frame = 0;
    const draw = () => {
      frame++;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      stars.forEach((s) => {
        const twinkle = 0.6 + 0.4 * Math.sin(frame * s.speed + s.offset);
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.base * twinkle})`;
        ctx.fill();
      });
      if (frame % 420 === 0) {
        const sx = Math.random() * W * 0.8 + W * 0.1;
        const sy = Math.random() * H * 0.45;
        const len = Math.random() * 140 + 80;
        const angle = Math.PI * 0.18 + Math.random() * 0.15;
        const g = ctx.createLinearGradient(sx, sy, sx + Math.cos(angle) * len, sy + Math.sin(angle) * len);
        g.addColorStop(0, "rgba(255,255,255,0)");
        g.addColorStop(0.45, "rgba(255,255,255,0.75)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + Math.cos(angle) * len, sy + Math.sin(angle) * len);
        ctx.strokeStyle = g; ctx.lineWidth = 1; ctx.stroke();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <>
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: "url('/space-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
        backgroundRepeat: "no-repeat",
      }} />
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }} />
    </>
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
      <SpaceBackground />

      {/* Card wrapper */}
      <div style={{ position: "relative", zIndex: 2, width: "min(860px, 94vw)" }}>

      <div
        className="animate-scale-in"
        style={{
          display: "flex",
          minHeight: 420,
          borderRadius: 20,
          overflow: "hidden",
          background: "rgba(0,0,0,0.82)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.06)",
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
            @keyframes tgPulse {
              0%, 100% { filter: brightness(1.1); opacity: 0.92; }
              50% { filter: brightness(1.35); opacity: 1; }
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
          <div style={{ marginBottom: 20, position: "relative" }}>
            <img
              src="/tg-logo.png"
              alt="TG Works"
              style={{
                width: 150,
                height: 150,
                objectFit: "contain",
                display: "block",
                mixBlendMode: "screen",
                filter: "brightness(1.1)",
                animation: "tgPulse 3.5s ease-in-out infinite",
              }}
            />
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
    </div>
  );
}
