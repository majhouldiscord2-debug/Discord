import { useState } from "react";
import { Eye, EyeOff, Bot, User, AlertCircle } from "lucide-react";
import { useDiscord } from "@/hooks/useDiscord";
import { cn } from "@/lib/utils";

function DiscordWordmark() {
  return (
    <svg viewBox="0 0 126.67 96" className="h-8 fill-white" xmlns="http://www.w3.org/2000/svg">
      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,10.75A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm41.64,0C77.82,65.69,72.6,60,72.6,53s5-12.74,11.49-12.74S96.23,46,96.12,53,91.08,65.69,84.09,65.69Z" />
    </svg>
  );
}

export default function Login() {
  const { login } = useDiscord();
  const [token, setToken] = useState("");
  const [tokenType, setTokenType] = useState<"user" | "bot">("user");
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    if (!token.trim()) return;
    setError(null);
    setLoading(true);
    const res = await login(token.trim(), tokenType);
    setLoading(false);
    if (!res.success) {
      setError(res.error ?? "Invalid token. Check the token type and try again.");
    }
  }

  return (
    <div
      className="flex h-screen w-full items-center justify-center"
      style={{ background: "linear-gradient(135deg, #1a1c2e 0%, #1e1f22 50%, #111214 100%)" }}
    >
      <div className="w-full max-w-[440px] mx-4">
        <div
          className="rounded-2xl px-8 py-10 animate-scale-in"
          style={{ backgroundColor: "#313338", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}
        >
          <div className="flex justify-center mb-6">
            <DiscordWordmark />
          </div>

          <h1 className="text-[24px] font-bold text-[#f2f3f5] text-center mb-1">
            Connect your account
          </h1>
          <p className="text-[#949ba4] text-[14px] text-center mb-8 leading-relaxed">
            Enter your Discord token to link real data to your dashboard.
          </p>

          {/* Token type selector */}
          <div
            className="flex rounded-xl overflow-hidden mb-5 p-1"
            style={{ backgroundColor: "#1e1f22", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            {(["user", "bot"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTokenType(t)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-200",
                  tokenType === t
                    ? "bg-[#5865f2] text-white shadow-lg"
                    : "text-[#949ba4] hover:text-[#dbdee1]"
                )}
              >
                {t === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                {t === "user" ? "User Token" : "Bot Token"}
              </button>
            ))}
          </div>

          {/* Token input */}
          <div className="mb-2">
            <label className="block text-[11px] font-bold tracking-widest uppercase text-[#949ba4] mb-2">
              {tokenType === "bot" ? "Bot Token" : "User Token"}
            </label>
            <div
              className="flex items-center rounded-lg px-4 gap-3 transition-all focus-within:ring-2 focus-within:ring-[#5865f2]/50"
              style={{ backgroundColor: "#1e1f22", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <input
                type={showToken ? "text" : "password"}
                placeholder={tokenType === "bot" ? "MTxxxxxx.xxxxxx.xxxxxx" : "Paste your token here"}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="flex-1 bg-transparent py-3.5 text-[14px] text-[#dbdee1] placeholder:text-[#4e5058] outline-none"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                onClick={() => setShowToken((v) => !v)}
                className="text-[#949ba4] hover:text-[#dbdee1] transition-colors shrink-0"
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 mb-4 px-3 py-2.5 rounded-lg" style={{ backgroundColor: "rgba(237,66,69,0.12)", border: "1px solid rgba(237,66,69,0.25)" }}>
              <AlertCircle className="w-4 h-4 text-[#ed4245] mt-0.5 shrink-0" />
              <p className="text-[13px] text-[#ed4245] leading-relaxed">{error}</p>
            </div>
          )}

          {tokenType === "user" && (
            <div
              className="flex items-start gap-2 mb-5 px-3 py-2.5 rounded-lg"
              style={{ backgroundColor: "rgba(250,166,26,0.1)", border: "1px solid rgba(250,166,26,0.2)" }}
            >
              <AlertCircle className="w-4 h-4 text-[#faa61a] mt-0.5 shrink-0" />
              <p className="text-[12px] text-[#faa61a] leading-relaxed">
                User tokens give full account access including DMs, friends, and all servers.
              </p>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={!token.trim() || loading}
            className="w-full py-3 rounded-lg text-[15px] font-semibold text-white transition-all duration-200 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
            style={{ background: "linear-gradient(135deg, #5865f2, #7b68ee)" }}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Verifying…
              </>
            ) : (
              "Log in"
            )}
          </button>

          <p className="text-[12px] text-[#4e5058] text-center mt-5 leading-relaxed">
            Your token is stored securely on the server and never shared.
          </p>
        </div>
      </div>
    </div>
  );
}
