import { useState, useEffect } from "react";
import { X, Inbox, SlidersHorizontal, Phone, MessageCircle, AtSign } from "lucide-react";
import { useDiscord } from "@/hooks/useDiscord";
import { getChannelPreviews, avatarUrl, type ChannelPreview } from "@/lib/api";
import { Avatar } from "./Avatar";
import { cn } from "@/lib/utils";

type Tab = "foryou" | "unreads" | "mentions";

function snowflakeToDate(id: string): Date {
  return new Date(Number(BigInt(id) >> 22n) + 1420070400000);
}

function timeAgo(date: Date): string {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d`;
  const mo = Math.floor(d / 30);
  return `${mo}mo`;
}

interface InboxPanelProps {
  onClose: () => void;
  onOpenDm: (channelId: string) => void;
}

export function InboxPanel({ onClose, onOpenDm }: InboxPanelProps) {
  const { relationships, user } = useDiscord();
  const [tab, setTab] = useState<Tab>("foryou");
  const [previews, setPreviews] = useState<ChannelPreview[]>([]);
  const [loading, setLoading] = useState(false);

  const friends = relationships.filter((r) => r.type === 1);
  const sortedFriends = [...friends].sort((a, b) => {
    const da = snowflakeToDate(a.id).getTime();
    const db = snowflakeToDate(b.id).getTime();
    return db - da;
  });

  useEffect(() => {
    if (tab === "unreads" || tab === "mentions") {
      setLoading(true);
      getChannelPreviews().then((data) => {
        setPreviews(data);
        setLoading(false);
      });
    }
  }, [tab]);

  const unreads = previews.filter((p) => p.lastMsg !== null);
  const mentions = previews.flatMap((p) =>
    p.mentions.map((m) => ({ ...m, channel: p.channel }))
  );

  return (
    <div
      className="w-[360px] shrink-0 h-full flex flex-col"
      style={{
        background: "#080e1c",
        borderLeft: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Panel header */}
      <div
        className="h-12 flex items-center px-4 gap-2 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <Inbox className="w-4 h-4 text-[#6d6f76]" />
        <span className="text-[#f2f3f5] font-semibold text-[15px] flex-1">Inbox</span>
        <button
          className="w-8 h-8 rounded-[6px] flex items-center justify-center text-[#6d6f76] hover:text-[#dbdee1] hover:bg-white/8 transition-all"
          title="Filter"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-[6px] flex items-center justify-center text-[#6d6f76] hover:text-[#dbdee1] hover:bg-white/8 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex shrink-0 px-3 pt-2 gap-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {(["foryou", "unreads", "mentions"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-3 py-2 text-[13px] font-medium relative transition-all",
              tab === t ? "text-[#f2f3f5]" : "text-[#7d8188] hover:text-[#dbdee1]"
            )}
          >
            {t === "foryou" ? "For You" : t === "unreads" ? "Unreads" : "Mentions"}
            {t === "foryou" && sortedFriends.length > 0 && (
              <span className="ml-1.5 w-[7px] h-[7px] rounded-full bg-[#f23f43] inline-block" />
            )}
            {tab === t && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-8 rounded-full bg-[#5865f2]" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto discord-scrollbar">
        {/* ─── For You ─── */}
        {tab === "foryou" && (
          <div className="py-2">
            {sortedFriends.length === 0 ? (
              <EmptyState icon={<MessageCircle className="w-10 h-10" />} text="No recent activity" />
            ) : (
              sortedFriends.map((rel) => {
                const u = rel.user;
                const name = rel.nickname ?? u.global_name ?? u.username;
                const src = avatarUrl(u);
                const when = timeAgo(snowflakeToDate(rel.id));
                return (
                  <div key={rel.id} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors group">
                    <Avatar
                      initials={name[0]?.toUpperCase() ?? "?"}
                      src={src}
                      color="#5865f2"
                      size="md"
                      statusBg="#080e1c"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[13px] font-semibold text-[#f2f3f5] truncate">
                          <span className="text-[#dbdee1]">{name}</span>
                          <span className="text-[#87898c] font-normal"> accepted your friend request.</span>
                        </span>
                        <span className="text-[11px] text-[#5e6068] shrink-0">{when}</span>
                      </div>
                      <button
                        onClick={() => onOpenDm(rel.id)}
                        className="mt-2 px-3 py-1 rounded-[5px] text-[12px] font-semibold bg-[#1e222a] text-[#dbdee1] hover:bg-[#293040] transition-colors border border-white/10"
                      >
                        Message
                      </button>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center text-[#6d6f76] hover:text-[#dbdee1] transition-all shrink-0 mt-0.5">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ─── Unreads ─── */}
        {tab === "unreads" && (
          <div className="py-2">
            {loading ? (
              <LoadingState />
            ) : unreads.length === 0 ? (
              <div className="px-4 py-6">
                <div className="rounded-[10px] p-4 mb-4" style={{ background: "#0d1525", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex gap-3 items-start">
                    <div className="w-10 h-10 rounded-full bg-[#1e2636] flex items-center justify-center shrink-0">
                      <Inbox className="w-5 h-5 text-[#5865f2]" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#f2f3f5] mb-1">Stay up to date with latest messages!</p>
                      <p className="text-[12px] text-[#7d8188] leading-relaxed">Unread messages from all your unmuted channels will show up here. Time to get to that zero inbox!</p>
                      <button className="mt-3 px-3 py-1.5 rounded-[5px] bg-[#5865f2] hover:bg-[#4752c4] text-white text-[12px] font-semibold transition-colors">
                        Got it!
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              unreads.map(({ channel, lastMsg }) => {
                if (!lastMsg) return null;
                const recipient = channel.recipients?.[0];
                const chName = channel.type === 3
                  ? (channel.name ?? channel.recipients?.map((r) => r.username).join(", ") ?? "Group DM")
                  : (recipient?.global_name ?? recipient?.username ?? "DM");
                const authorName = lastMsg.author.global_name ?? lastMsg.author.username;
                const when = timeAgo(new Date(lastMsg.timestamp));
                return (
                  <div
                    key={channel.id}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer group"
                    onClick={() => { onOpenDm(channel.id); onClose(); }}
                  >
                    <Avatar
                      initials={chName[0]?.toUpperCase() ?? "?"}
                      src={recipient ? avatarUrl(recipient) : null}
                      color="#5865f2"
                      size="md"
                      statusBg="#080e1c"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-[13px] font-semibold text-[#f2f3f5] truncate">{chName}</span>
                        <span className="text-[11px] text-[#5e6068] shrink-0">{when}</span>
                      </div>
                      <p className="text-[12px] text-[#7d8188] truncate">
                        <span className="text-[#87898c] font-medium">{authorName}: </span>
                        {lastMsg.content || "(attachment)"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 shrink-0 transition-all">
                      <button
                        className="w-7 h-7 rounded-[5px] flex items-center justify-center text-[#87898c] hover:text-[#f2f3f5] hover:bg-white/10 transition-all"
                        title="Mark as read"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Inbox className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ─── Mentions ─── */}
        {tab === "mentions" && (
          <div className="py-2">
            {loading ? (
              <LoadingState />
            ) : mentions.length === 0 ? (
              <EmptyState icon={<AtSign className="w-10 h-10" />} text="No recent mentions" />
            ) : (
              mentions.map((m, i) => {
                const recipient = m.channel.recipients?.[0];
                const chName = m.channel.type === 3
                  ? (m.channel.name ?? "Group DM")
                  : (recipient?.global_name ?? recipient?.username ?? "DM");
                const authorName = m.author.global_name ?? m.author.username;
                const when = timeAgo(new Date(m.timestamp));
                return (
                  <div
                    key={`${m.id}-${i}`}
                    className="px-3 py-2 hover:bg-white/[0.03] transition-colors cursor-pointer group"
                    onClick={() => { onOpenDm(m.channel.id); onClose(); }}
                  >
                    <div className="text-[11px] text-[#87898c] flex items-center gap-1.5 mb-1.5 px-1">
                      <span className="text-[#6d6f76]">#</span>
                      <span className="font-semibold text-[#c4c9cf]">
                        {chName}
                      </span>
                    </div>
                    <div
                      className="rounded-[8px] p-3"
                      style={{ background: "#0d1525", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <div className="flex items-start gap-2">
                        <Avatar
                          initials={authorName[0]?.toUpperCase() ?? "?"}
                          src={null}
                          color="#5865f2"
                          size="sm"
                          statusBg="#0d1525"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-1.5 mb-0.5">
                            <span className="text-[13px] font-semibold text-[#f2f3f5]">{authorName}</span>
                            <span className="text-[11px] text-[#5e6068]">{when}</span>
                          </div>
                          <p className="text-[13px] text-[#dbdee1] leading-snug break-words">
                            {m.content.replace(/<@!?\d+>/g, (match) => {
                              const id = match.replace(/<@!?/, "").replace(">", "");
                              return id === user?.id ? `@${user?.username ?? "you"}` : match;
                            })}
                          </p>
                        </div>
                        <button
                          className="opacity-0 group-hover:opacity-100 text-[#6d6f76] hover:text-[#dbdee1] transition-all shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#4e5058]">
      {icon}
      <p className="text-[13px] font-medium">{text}</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12 gap-2 text-[#4e5058]">
      <div className="w-4 h-4 rounded-full border-2 border-white/10 border-t-white/50 animate-spin" />
      <span className="text-[13px]">Loading…</span>
    </div>
  );
}
