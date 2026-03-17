import { useState } from "react";
import { Shield, AlertCircle } from "lucide-react";
import { useDiscord } from "@/hooks/useDiscord";

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
      style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 35%, #0b1a38 0%, #050c1c 50%, #020508 100%)",
      }}
    >
      <div className="w-full max-w-[400px] mx-4">
        <div
          className="rounded-[28px] px-10 py-11 animate-scale-in"
          style={{
            backgroundColor: "rgba(6, 12, 26, 0.92)",
            border: "1px solid rgba(25, 60, 110, 0.35)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.04)",
            backdropFilter: "blur(24px)",
          }}
        >
          {/* Shield Icon */}
          <div className="flex justify-center mb-7">
            <div
              className="w-[68px] h-[68px] rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(145deg, #1d6ef5 0%, #1252cc 100%)",
                boxShadow: "0 10px 32px rgba(29, 110, 245, 0.45), 0 0 0 1px rgba(29,110,245,0.2)",
              }}
            >
              <Shield className="w-8 h-8 text-white" fill="white" strokeWidth={0} />
            </div>
          </div>

          {/* Title */}
          <h1
            className="text-center text-[28px] font-black italic text-white mb-2 tracking-tight"
            style={{ letterSpacing: "-0.01em" }}
          >
            NEXUS OBSIDIAN
          </h1>

          {/* Subtitle */}
          <p
            className="text-center text-[10.5px] text-[#3a5070] mb-9"
            style={{ letterSpacing: "0.28em", fontFamily: "'Courier New', monospace" }}
          >
            ZENITH OVERFLOW V19.5
          </p>

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
              placeholder="mfa.XXXXX.XXXXX.XXXXX"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full rounded-xl px-4 py-3.5 text-[13px] text-[#6a90b8] outline-none transition-all placeholder:text-[#1e3450]"
              style={{
                backgroundColor: "#030810",
                border: "1px solid rgba(15, 40, 75, 0.7)",
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
