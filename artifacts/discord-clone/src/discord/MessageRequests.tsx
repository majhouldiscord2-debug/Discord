import { useState } from "react";
import { MailCheck, Check, X, UserCircle, Clock } from "lucide-react";

interface MessageRequest {
  id: string;
  username: string;
  displayName: string;
  avatarColor: string;
  preview: string;
  timestamp: string;
  mutualServers: number;
  isVerified?: boolean;
}

const MOCK_REQUESTS: MessageRequest[] = [
  {
    id: "1",
    username: "blaze_trader",
    displayName: "Blaze",
    avatarColor: "#f97316",
    preview: "Hey! I saw your post in Blox Fruits, interested in trading my Kitsune for your Dragon?",
    timestamp: "2m ago",
    mutualServers: 3,
  },
  {
    id: "2",
    username: "galaxy_coder",
    displayName: "GalaxyDev",
    avatarColor: "#6366f1",
    preview: "Your bot setup looks insane, any chance you could share the config?",
    timestamp: "14m ago",
    mutualServers: 1,
  },
  {
    id: "3",
    username: "neon_wave99",
    displayName: "NeonWave",
    avatarColor: "#06b6d4",
    preview: "Wanna duo queue? I'm gold 2 right now grinding ranked",
    timestamp: "1h ago",
    mutualServers: 0,
  },
  {
    id: "4",
    username: "void.keeper",
    displayName: "VoidKeeper",
    avatarColor: "#a855f7",
    preview: "Hey I think I recognize you from the server event last week, small world lol",
    timestamp: "3h ago",
    mutualServers: 5,
    isVerified: true,
  },
  {
    id: "5",
    username: "storm_rex",
    displayName: "StormRex",
    avatarColor: "#22c55e",
    preview: "Can you check out my trading server? I'm looking for mods with experience",
    timestamp: "Yesterday",
    mutualServers: 2,
  },
];

function Avatar({ color, username }: { color: string; username: string }) {
  return (
    <div
      className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white text-[15px] font-bold"
      style={{ background: `linear-gradient(135deg, ${color}cc, ${color})`, boxShadow: `0 0 12px ${color}40` }}
    >
      {username[0].toUpperCase()}
    </div>
  );
}

function RequestCard({
  request,
  onAccept,
  onIgnore,
}: {
  request: MessageRequest;
  onAccept: (id: string) => void;
  onIgnore: (id: string) => void;
}) {
  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-xl transition-colors group"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.02)"; }}
    >
      <Avatar color={request.avatarColor} username={request.displayName} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[13px] font-bold text-[#f2f3f5]">{request.displayName}</span>
          <span className="text-[11px] text-[#4e5058]">@{request.username}</span>
          {request.isVerified && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: "#5865f220", color: "#5865f2", border: "1px solid #5865f230" }}>
              VERIFIED
            </span>
          )}
        </div>

        <p className="text-[12px] text-[#949ba4] leading-snug line-clamp-2 mb-1.5">{request.preview}</p>

        <div className="flex items-center gap-3 text-[10px] text-[#4e5058]">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{request.timestamp}</span>
          {request.mutualServers > 0 ? (
            <span className="flex items-center gap-1">
              <UserCircle className="w-3 h-3" />
              {request.mutualServers} mutual server{request.mutualServers !== 1 ? "s" : ""}
            </span>
          ) : (
            <span className="text-[#ef444460]">No mutual servers</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onAccept(request.id)}
          title="Accept"
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: "#22c55e20", border: "1px solid #22c55e40" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#22c55e33"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#22c55e20"; }}
        >
          <Check className="w-4 h-4 text-[#22c55e]" />
        </button>
        <button
          onClick={() => onIgnore(request.id)}
          title="Ignore"
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: "#ef444420", border: "1px solid #ef444440" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#ef444433"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#ef444420"; }}
        >
          <X className="w-4 h-4 text-[#ef4444]" />
        </button>
      </div>
    </div>
  );
}

export default function MessageRequestsPage() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [accepted, setAccepted] = useState<string[]>([]);

  function handleAccept(id: string) {
    setAccepted((prev) => [...prev, id]);
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }

  function handleIgnore(id: string) {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden" style={{ backgroundColor: "#0a1220" }}>
      {/* Header */}
      <div className="px-6 pt-5 pb-4 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-3 mb-1">
          <MailCheck className="w-5 h-5 text-[#5865f2]" />
          <h1 className="text-[18px] font-bold text-[#f2f3f5]">Message Requests</h1>
          {requests.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold text-white"
              style={{ background: "#5865f2" }}>
              {requests.length}
            </span>
          )}
        </div>
        <p className="text-[12px] text-[#4e5058]">
          People you haven't chatted with before. Accept to start a conversation or ignore to remove.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto discord-scrollbar p-4">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <MailCheck className="w-12 h-12 text-[#4e5058]" />
            <p className="text-[#f2f3f5] text-[15px] font-semibold">All caught up!</p>
            <p className="text-[#4e5058] text-[13px]">No pending message requests.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-w-2xl">
            <p className="text-[10px] font-bold text-[#4e5058] uppercase tracking-widest mb-1 px-1">
              Pending — {requests.length}
            </p>
            {requests.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                onAccept={handleAccept}
                onIgnore={handleIgnore}
              />
            ))}
          </div>
        )}

        {accepted.length > 0 && (
          <div className="mt-6 max-w-2xl">
            <p className="text-[10px] font-bold text-[#22c55e60] uppercase tracking-widest mb-2 px-1">
              Accepted — {accepted.length}
            </p>
            {accepted.map((id) => {
              const r = MOCK_REQUESTS.find((x) => x.id === id);
              if (!r) return null;
              return (
                <div key={id} className="flex items-center gap-3 px-4 py-2.5 rounded-xl opacity-50">
                  <Avatar color={r.avatarColor} username={r.displayName} />
                  <span className="text-[13px] font-semibold text-[#f2f3f5]">{r.displayName}</span>
                  <span className="text-[11px] text-[#22c55e] ml-auto flex items-center gap-1">
                    <Check className="w-3 h-3" /> Accepted
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
