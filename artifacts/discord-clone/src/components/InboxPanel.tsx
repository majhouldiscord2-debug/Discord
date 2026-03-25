import { useState } from "react";
import { X, Inbox, SlidersHorizontal, MessageCircle, AtSign } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Avatar } from "./Avatar";
import { cn } from "@/lib/utils";

type Tab = "foryou" | "unreads" | "mentions";

function timeAgo(date: Date): string {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

interface InboxPanelProps {
  onClose: () => void;
  onOpenDm: (dmId: string) => void;
}

const ACTIVITY = [
  { userId: "user-nova", text: "reacted 🚀 to your message in #general", time: new Date(Date.now() - 5 * 60000) },
  { userId: "user-storm", text: "started a new conversation with you", time: new Date(Date.now() - 15 * 60000) },
  { userId: "user-pixel", text: "mentioned you in #help", time: new Date(Date.now() - 45 * 60000) },
  { userId: "user-drift", text: "accepted your friend request", time: new Date(Date.now() - 2 * 3600000) },
];

const UNREAD_DMS = ["dm-nova", "dm-storm"];

export function InboxPanel({ onClose, onOpenDm }: InboxPanelProps) {
  const users = useAppStore((s) => s.users);
  const dmChannels = useAppStore((s) => s.dmChannels);
  const getDmRecipient = useAppStore((s) => s.getDmRecipient);
  const messages = useAppStore((s) => s.messages);

  const [tab, setTab] = useState<Tab>("foryou");

  const unreadDms = dmChannels.filter((dm) => (dm.unreadCount ?? 0) > 0);

  return (
    <div
      className="w-[360px] shrink-0 h-full flex flex-col"
      style={{ background: "#080000", borderLeft: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="h-12 flex items-center px-4 gap-2 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Inbox className="w-4 h-4 text-[#6d6f76]" />
        <span className="text-[#f2f3f5] font-semibold text-[15px] flex-1">Inbox</span>
        <button className="w-8 h-8 rounded-[6px] flex items-center justify-center text-[#6d6f76] hover:text-[#dbdee1] hover:bg-white/8 transition-all" title="Filter">
          <SlidersHorizontal className="w-4 h-4" />
        </button>
        <button onClick={onClose} className="w-8 h-8 rounded-[6px] flex items-center justify-center text-[#6d6f76] hover:text-[#dbdee1] hover:bg-white/8 transition-all">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex shrink-0 px-3 pt-2 gap-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {(["foryou", "unreads", "mentions"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn("px-3 py-2 text-[13px] font-medium relative transition-all", tab === t ? "text-[#f2f3f5]" : "text-[#7d8188] hover:text-[#dbdee1]")}
          >
            {t === "foryou" ? "For You" : t === "unreads" ? "Unreads" : "Mentions"}
            {t === "foryou" && (
              <span className="ml-1.5 w-[7px] h-[7px] rounded-full bg-[#f23f43] inline-block" />
            )}
            {tab === t && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-8 rounded-full bg-[#cc0000]" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto discord-scrollbar">
        {tab === "foryou" && (
          <div className="py-2">
            {ACTIVITY.map((a, i) => {
              const u = users[a.userId];
              if (!u) return null;
              return (
                <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors group">
                  <Avatar initials={u.initials} color={u.avatarColor} size="md" statusBg="#080000" status={u.status} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] text-[#dbdee1] leading-snug">
                        <strong className="text-[#f2f3f5]">{u.displayName}</strong> {a.text}
                      </span>
                      <span className="text-[11px] text-[#5e6068] shrink-0">{timeAgo(a.time)}</span>
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center text-[#6d6f76] hover:text-[#dbdee1] transition-all shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {tab === "unreads" && (
          <div className="py-2">
            {unreadDms.length === 0 ? (
              <div className="px-4 py-6">
                <div className="rounded-[10px] p-4" style={{ background: "#1a0505", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex gap-3 items-start">
                    <div className="w-10 h-10 rounded-full bg-[#2a0000] flex items-center justify-center shrink-0">
                      <Inbox className="w-5 h-5 text-[#cc0000]" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#f2f3f5] mb-1">You're all caught up!</p>
                      <p className="text-[12px] text-[#7d8188] leading-relaxed">Unread messages from your unmuted channels will appear here.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              unreadDms.map((dm) => {
                const recipient = getDmRecipient(dm.id);
                if (!recipient) return null;
                const dmMessages = messages[dm.id] ?? [];
                const lastMsg = dmMessages[dmMessages.length - 1];
                return (
                  <div
                    key={dm.id}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer group"
                    onClick={() => { onOpenDm(dm.id); onClose(); }}
                  >
                    <Avatar initials={recipient.initials} color={recipient.avatarColor} size="md" statusBg="#080000" status={recipient.status} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-[13px] font-semibold text-[#f2f3f5] truncate">{recipient.displayName}</span>
                        {dm.lastMessageAt && <span className="text-[11px] text-[#5e6068] shrink-0">{timeAgo(new Date(dm.lastMessageAt))}</span>}
                      </div>
                      {lastMsg && (
                        <p className="text-[12px] text-[#7d8188] truncate">
                          {lastMsg.content}
                        </p>
                      )}
                    </div>
                    {dm.unreadCount ? (
                      <span className="bg-[#ed4245] text-white text-[10px] font-bold rounded-full px-1.5 min-w-[18px] h-[18px] flex items-center justify-center shrink-0">
                        {dm.unreadCount}
                      </span>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        )}

        {tab === "mentions" && (
          <div className="py-2">
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#4e5058]">
              <AtSign className="w-10 h-10" />
              <p className="text-[13px] font-medium">No recent mentions</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
