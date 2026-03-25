import { useState, useEffect, useRef } from "react";
import { Shield, AlertCircle } from "lucide-react";
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

    const NUM_STARS = 220;
    const NUM_NEBULA = 6;

    const stars = Array.from({ length: NUM_STARS }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.6 + 0.2,
      opacity: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.12 + 0.03,
      twinkleOffset: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
    }));

    const nebulae = Array.from({ length: NUM_NEBULA }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      rx: Math.random() * 300 + 150,
      ry: Math.random() * 200 + 100,
      color: [
        "rgba(29,110,245,",
        "rgba(80,0,180,",
        "rgba(0,180,220,",
        "rgba(120,0,255,",
        "rgba(0,60,180,",
        "rgba(30,0,100,",
      ][Math.floor(Math.random() * 6)],
      opacity: Math.random() * 0.07 + 0.02,
      driftX: (Math.random() - 0.5) * 0.08,
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
        n.x += n.driftX;
        n.y += n.driftY;
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
        if (s.y > H) {
          s.y = 0;
          s.x = Math.random() * W;
        }
        const twinkle = 0.5 + 0.5 * Math.sin(frame * s.twinkleSpeed + s.twinkleOffset);
        const op = s.opacity * (0.6 + 0.4 * twinkle);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${op})`;
        ctx.fill();
      });

      const shootingChance = Math.random();
      if (shootingChance < 0.003) {
        const sx = Math.random() * W;
        const sy = Math.random() * H * 0.5;
        const len = Math.random() * 120 + 60;
        const grad = ctx.createLinearGradient(sx, sy, sx + len, sy + len * 0.4);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(0.5, "rgba(255,255,255,0.7)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + len, sy + len * 0.4);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.stroke();
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
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
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
    if (!res.success) {
      setError(res.error ?? "Invalid token. Check and try again.");
    }
  }

  return (
    <div
      className="flex h-screen w-full items-center justify-center"
      style={{ background: "#000000", position: "relative" }}
    >
      <SpaceCanvas />

      <div className="w-full max-w-[400px] mx-4" style={{ position: "relative", zIndex: 1 }}>
        <div
          className="rounded-[28px] px-10 py-11 animate-scale-in"
          style={{
            backgroundColor: "#000000",
            border: "1px solid rgba(29, 110, 245, 0.18)",
            boxShadow:
              "0 40px 100px rgba(0,0,0,1), 0 0 60px rgba(29,110,245,0.06), inset 0 1px 0 rgba(255,255,255,0.03)",
            backdropFilter: "blur(0px)",
          }}
        >
          {/* Shield Icon */}
          <div className="flex justify-center mb-7">
            <div
              className="w-[68px] h-[68px] rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(145deg, #1d6ef5 0%, #1252cc 100%)",
                boxShadow:
                  "0 10px 32px rgba(29, 110, 245, 0.5), 0 0 0 1px rgba(29,110,245,0.25), 0 0 40px rgba(29,110,245,0.2)",
              }}
            >
              <Shield className="w-8 h-8 text-white" fill="white" strokeWidth={0} />
            </div>
          </div>

          {/* Title */}
          <h1
            className="text-center text-[28px] font-black italic text-white mb-5 tracking-tight"
            style={{
              letterSpacing: "-0.01em",
              textShadow: "0 0 30px rgba(29,110,245,0.4)",
            }}
          >
            TG Works
          </h1>

          {/* Registry Token label */}
          <div className="mb-3.5">
            <label
              className="block text-[10px] font-bold text-[#3a5070] mb-2.5"
              style={{ letterSpacing: "0.2em", fontFamily: "'Courier New', monospace" }}
            >
              REGISTRY TOKEN
            </label>
            <input
              type="password"
              placeholder="MTQxxx.xxx.xxx-yyyy-A"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full rounded-xl px-4 py-3.5 text-[13px] text-[#6a90b8] outline-none transition-all placeholder:text-[#1e3450]"
              style={{
                backgroundColor: "#000000",
                border: "1px solid rgba(29, 110, 245, 0.15)",
                caretColor: "#1d6ef5",
                fontFamily: "'Courier New', monospace",
              }}
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          {error && (
            <div
              className="flex items-start gap-2 mb-4 px-3 py-2.5 rounded-xl"
              style={{
                backgroundColor: "rgba(237,66,69,0.08)",
                border: "1px solid rgba(237,66,69,0.2)",
              }}
            >
              <AlertCircle className="w-4 h-4 text-[#ed4245] mt-0.5 shrink-0" />
              <p className="text-[12px] text-[#ed4245] leading-relaxed">{error}</p>
            </div>
          )}

          {/* Initialize Uplink button */}
          <button
            onClick={handleLogin}
            disabled={!token.trim() || loading}
            className="w-full py-4 rounded-full text-[12.5px] font-black text-white uppercase transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-3"
            style={{
              background: "linear-gradient(145deg, #1d6ef5 0%, #1458d8 100%)",
              boxShadow: "0 8px 28px rgba(29, 110, 245, 0.5), 0 2px 8px rgba(0,0,0,0.4)",
              letterSpacing: "0.16em",
            }}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                CONNECTING…
              </>
            ) : (
              "INITIALIZE UPLINK"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
