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

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const starColors = [
      [255, 255, 255],
      [255, 200, 200],
      [255, 220, 220],
      [255, 240, 240],
      [220, 100, 100],
      [255, 150, 150],
    ];

    // Three depth layers for parallax feel
    const layers = [
      Array.from({ length: 180 }, () => ({
        x: Math.random(), y: Math.random(),
        r: Math.random() * 0.7 + 0.2,
        base: Math.random() * 0.35 + 0.1,
        offset: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.008 + 0.002,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        drift: (Math.random() - 0.5) * 0.00004,
      })),
      Array.from({ length: 100 }, () => ({
        x: Math.random(), y: Math.random(),
        r: Math.random() * 1.2 + 0.5,
        base: Math.random() * 0.5 + 0.2,
        offset: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.014 + 0.004,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        drift: (Math.random() - 0.5) * 0.00007,
      })),
      Array.from({ length: 40 }, () => ({
        x: Math.random(), y: Math.random(),
        r: Math.random() * 2.0 + 1.0,
        base: Math.random() * 0.6 + 0.3,
        offset: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.007,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        drift: (Math.random() - 0.5) * 0.0001,
      })),
    ];

    // Nebula nodes
    const nebulae = [
      { x: 0.15, y: 0.25, rx: 0.35, ry: 0.25, r: 180, g: 20, b: 20, a: 0.045 },
      { x: 0.78, y: 0.65, rx: 0.28, ry: 0.22, r: 160, g: 10, b: 10, a: 0.04 },
      { x: 0.5,  y: 0.1,  rx: 0.45, ry: 0.18, r: 200, g: 30, b: 30, a: 0.035 },
      { x: 0.85, y: 0.2,  rx: 0.22, ry: 0.3,  r: 140, g: 0,  b: 0,  a: 0.03 },
      { x: 0.3,  y: 0.8,  rx: 0.3,  ry: 0.2,  r: 180, g: 20, b: 20, a: 0.03 },
    ];

    // Shooting stars pool
    interface Meteor { x: number; y: number; len: number; angle: number; speed: number; life: number; maxLife: number; }
    const meteors: Meteor[] = [];
    let frame = 0;

    const spawnMeteor = (W: number, H: number) => {
      const angle = Math.PI * 0.15 + Math.random() * 0.2;
      meteors.push({
        x: Math.random() * W,
        y: Math.random() * H * 0.5,
        len: Math.random() * 180 + 80,
        angle,
        speed: Math.random() * 6 + 4,
        life: 0,
        maxLife: Math.random() * 35 + 25,
      });
    };

    const drawNebulae = (W: number, H: number) => {
      nebulae.forEach((n) => {
        const grd = ctx.createRadialGradient(n.x * W, n.y * H, 0, n.x * W, n.y * H, Math.max(n.rx * W, n.ry * H));
        grd.addColorStop(0, `rgba(${n.r},${n.g},${n.b},${n.a})`);
        grd.addColorStop(0.5, `rgba(${n.r},${n.g},${n.b},${n.a * 0.5})`);
        grd.addColorStop(1, `rgba(${n.r},${n.g},${n.b},0)`);
        ctx.save();
        ctx.scale(1, n.ry / n.rx);
        ctx.beginPath();
        ctx.arc(n.x * W, (n.y * H) / (n.ry / n.rx), n.rx * W, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.restore();
      });
    };

    const draw = () => {
      frame++;
      const W = canvas.width, H = canvas.height;

      // Deep space base gradient
      const bg = ctx.createLinearGradient(0, 0, W * 0.5, H);
      bg.addColorStop(0, "#080000");
      bg.addColorStop(0.5, "#0f0000");
      bg.addColorStop(1, "#080000");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Nebulae
      drawNebulae(W, H);

      // Stars by layer
      layers.forEach((layer) => {
        layer.forEach((s) => {
          s.x += s.drift;
          if (s.x < 0) s.x = 1;
          if (s.x > 1) s.x = 0;
          const twinkle = 0.55 + 0.45 * Math.sin(frame * s.speed + s.offset);
          const alpha = s.base * twinkle;
          const [r, g, b] = s.color;
          const sx = s.x * W, sy = s.y * H;

          // Glow for larger stars
          if (s.r > 1.2) {
            const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.r * 4);
            glow.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.5})`);
            glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
            ctx.beginPath();
            ctx.arc(sx, sy, s.r * 4, 0, Math.PI * 2);
            ctx.fillStyle = glow;
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.fill();
        });
      });

      // Shooting stars
      if (frame % 140 === 0) spawnMeteor(W, H);

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.life++;
        const progress = m.life / m.maxLife;
        const opacity = progress < 0.2
          ? progress / 0.2
          : progress > 0.7
          ? (1 - progress) / 0.3
          : 1;
        const tail = ctx.createLinearGradient(
          m.x - Math.cos(m.angle) * m.len,
          m.y - Math.sin(m.angle) * m.len,
          m.x, m.y
        );
        tail.addColorStop(0, `rgba(255,255,255,0)`);
        tail.addColorStop(0.6, `rgba(255,180,180,${0.5 * opacity})`);
        tail.addColorStop(1, `rgba(255,255,255,${0.9 * opacity})`);
        ctx.beginPath();
        ctx.moveTo(m.x - Math.cos(m.angle) * m.len, m.y - Math.sin(m.angle) * m.len);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = tail;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (m.life >= m.maxLife) meteors.splice(i, 1);
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }}
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
    <div className="flex h-screen w-full items-center justify-center" style={{ background: "#080000", position: "relative" }}>
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
              color: "rgba(220,80,80,0.8)",
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
              color: "rgba(255,200,200,0.85)",
              fontFamily: "'Courier New', monospace",
              outline: "none",
              caretColor: "#cc0000",
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
              background: "linear-gradient(135deg, #cc0000 0%, #8b0000 100%)",
              color: "#fff",
              fontSize: 11.5,
              fontWeight: 900,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: token.trim() && !loading ? "pointer" : "not-allowed",
              opacity: !token.trim() || loading ? 0.35 : 1,
              boxShadow: "0 8px 26px rgba(200,0,0,0.45)",
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
