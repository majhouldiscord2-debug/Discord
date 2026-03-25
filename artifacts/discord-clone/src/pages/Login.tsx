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
      [255, 210, 210],
      [255, 235, 235],
      [255, 255, 255],
      [230, 110, 110],
      [200, 60,  60],
      [255, 170, 170],
      [210, 200, 255],
    ];

    // Three depth layers for parallax feel
    const layers = [
      Array.from({ length: 220 }, () => ({
        x: Math.random(), y: Math.random(),
        r: Math.random() * 0.65 + 0.15,
        base: Math.random() * 0.3 + 0.08,
        offset: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.006 + 0.0015,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        drift: (Math.random() - 0.5) * 0.00003,
      })),
      Array.from({ length: 110 }, () => ({
        x: Math.random(), y: Math.random(),
        r: Math.random() * 1.1 + 0.45,
        base: Math.random() * 0.45 + 0.18,
        offset: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.013 + 0.004,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        drift: (Math.random() - 0.5) * 0.00006,
      })),
      Array.from({ length: 45 }, () => ({
        x: Math.random(), y: Math.random(),
        r: Math.random() * 2.2 + 1.0,
        base: Math.random() * 0.65 + 0.3,
        offset: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.018 + 0.006,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        drift: (Math.random() - 0.5) * 0.00009,
      })),
    ];

    // Enhanced nebulae — richer red + deep purple/blue mix for depth
    const nebulae = [
      { x: 0.12, y: 0.22, rx: 0.42, ry: 0.32, r: 200, g: 20,  b: 20,  a: 0.065 },
      { x: 0.80, y: 0.60, rx: 0.32, ry: 0.26, r: 170, g: 10,  b: 10,  a: 0.055 },
      { x: 0.50, y: 0.08, rx: 0.50, ry: 0.20, r: 210, g: 30,  b: 30,  a: 0.05  },
      { x: 0.88, y: 0.18, rx: 0.25, ry: 0.35, r: 150, g: 0,   b: 0,   a: 0.045 },
      { x: 0.28, y: 0.82, rx: 0.35, ry: 0.22, r: 190, g: 15,  b: 15,  a: 0.045 },
      { x: 0.60, y: 0.50, rx: 0.28, ry: 0.20, r: 40,  g: 0,   b: 80,  a: 0.04  },
      { x: 0.05, y: 0.65, rx: 0.20, ry: 0.28, r: 60,  g: 0,   b: 100, a: 0.035 },
      { x: 0.72, y: 0.88, rx: 0.30, ry: 0.18, r: 180, g: 30,  b: 0,   a: 0.04  },
    ];

    // Floating energy particles — slow drifting embers
    interface Particle { x: number; y: number; vx: number; vy: number; r: number; alpha: number; life: number; maxLife: number; }
    const particles: Particle[] = Array.from({ length: 60 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00012,
      vy: -Math.random() * 0.00018 - 0.00005,
      r: Math.random() * 1.6 + 0.4,
      alpha: Math.random() * 0.45 + 0.05,
      life: Math.floor(Math.random() * 300),
      maxLife: Math.floor(Math.random() * 400 + 200),
    }));

    // Shooting stars pool
    interface Meteor { x: number; y: number; len: number; angle: number; speed: number; life: number; maxLife: number; }
    const meteors: Meteor[] = [];
    let frame = 0;

    const spawnMeteor = (W: number, H: number) => {
      const angle = Math.PI * 0.13 + Math.random() * 0.22;
      meteors.push({
        x: Math.random() * W * 0.8,
        y: Math.random() * H * 0.45,
        len: Math.random() * 220 + 100,
        angle,
        speed: Math.random() * 7 + 5,
        life: 0,
        maxLife: Math.random() * 40 + 28,
      });
    };

    const drawNebulae = (W: number, H: number) => {
      nebulae.forEach((n) => {
        const grd = ctx.createRadialGradient(n.x * W, n.y * H, 0, n.x * W, n.y * H, Math.max(n.rx * W, n.ry * H));
        grd.addColorStop(0,   `rgba(${n.r},${n.g},${n.b},${n.a})`);
        grd.addColorStop(0.4, `rgba(${n.r},${n.g},${n.b},${n.a * 0.55})`);
        grd.addColorStop(0.75,`rgba(${n.r},${n.g},${n.b},${n.a * 0.18})`);
        grd.addColorStop(1,   `rgba(${n.r},${n.g},${n.b},0)`);
        ctx.save();
        ctx.scale(1, n.ry / n.rx);
        ctx.beginPath();
        ctx.arc(n.x * W, (n.y * H) / (n.ry / n.rx), n.rx * W, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.restore();
      });
    };

    const drawGrid = (W: number, H: number) => {
      const cellW = 90, cellH = 90;
      const pulse = 0.012 + 0.006 * Math.sin(frame * 0.008);
      ctx.save();
      ctx.strokeStyle = `rgba(180,0,0,${pulse})`;
      ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += cellW) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += cellH) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
      ctx.restore();
    };

    const drawVignette = (W: number, H: number) => {
      const vPulse = 0.55 + 0.06 * Math.sin(frame * 0.005);
      const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.28, W / 2, H / 2, H * 0.85);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(0.7, "rgba(0,0,0,0)");
      vg.addColorStop(1, `rgba(0,0,0,${vPulse})`);
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

      // Red edge glow
      const edgePulse = 0.055 + 0.025 * Math.sin(frame * 0.007);
      const eg = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H);
      eg.addColorStop(0, "rgba(180,0,0,0)");
      eg.addColorStop(0.75, "rgba(180,0,0,0)");
      eg.addColorStop(1, `rgba(180,0,0,${edgePulse})`);
      ctx.fillStyle = eg;
      ctx.fillRect(0, 0, W, H);
    };

    const draw = () => {
      frame++;
      const W = canvas.width, H = canvas.height;

      // Richer deep-space base: near-black with a red-to-indigo sweep
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0,    "#050008");
      bg.addColorStop(0.25, "#0a0002");
      bg.addColorStop(0.5,  "#110003");
      bg.addColorStop(0.75, "#0a0002");
      bg.addColorStop(1,    "#050008");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Subtle grid
      drawGrid(W, H);

      // Nebulae
      drawNebulae(W, H);

      // Drifting energy particles (embers)
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;
        if (p.y < 0 || p.y > 1 || p.life >= p.maxLife) {
          p.x = Math.random();
          p.y = 1;
          p.life = 0;
          p.maxLife = Math.floor(Math.random() * 400 + 200);
          p.alpha = Math.random() * 0.45 + 0.05;
        }
        const lifeAlpha = p.life < 40 ? p.life / 40 : p.life > p.maxLife - 40 ? (p.maxLife - p.life) / 40 : 1;
        const px = p.x * W, py = p.y * H;
        const pg = ctx.createRadialGradient(px, py, 0, px, py, p.r * 3);
        pg.addColorStop(0, `rgba(255,80,80,${p.alpha * lifeAlpha})`);
        pg.addColorStop(0.5, `rgba(220,30,30,${p.alpha * lifeAlpha * 0.4})`);
        pg.addColorStop(1, "rgba(180,0,0,0)");
        ctx.beginPath();
        ctx.arc(px, py, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = pg;
        ctx.fill();
      });

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

          if (s.r > 1.2) {
            const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.r * 5);
            glow.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.6})`);
            glow.addColorStop(0.4, `rgba(${r},${g},${b},${alpha * 0.2})`);
            glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
            ctx.beginPath();
            ctx.arc(sx, sy, s.r * 5, 0, Math.PI * 2);
            ctx.fillStyle = glow;
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.fill();
        });
      });

      // Shooting stars — spawn more frequently with a red-white trail
      if (frame % 110 === 0) spawnMeteor(W, H);
      if (frame % 290 === 0) spawnMeteor(W, H);

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.life++;
        const progress = m.life / m.maxLife;
        const opacity = progress < 0.18
          ? progress / 0.18
          : progress > 0.65
          ? (1 - progress) / 0.35
          : 1;
        const tail = ctx.createLinearGradient(
          m.x - Math.cos(m.angle) * m.len,
          m.y - Math.sin(m.angle) * m.len,
          m.x, m.y
        );
        tail.addColorStop(0,   "rgba(255,255,255,0)");
        tail.addColorStop(0.4, `rgba(220,60,60,${0.3 * opacity})`);
        tail.addColorStop(0.75,`rgba(255,160,160,${0.65 * opacity})`);
        tail.addColorStop(1,   `rgba(255,255,255,${opacity})`);
        ctx.beginPath();
        ctx.moveTo(m.x - Math.cos(m.angle) * m.len, m.y - Math.sin(m.angle) * m.len);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = tail;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        if (m.life >= m.maxLife) meteors.splice(i, 1);
      }

      // Vignette + red edge pulse — layered on top
      drawVignette(W, H);

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
