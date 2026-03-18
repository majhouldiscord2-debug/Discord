import { useState, useEffect, useRef, useCallback } from "react";
import { Hash, Phone, Video, Pin, Users, Search, Inbox, HelpCircle, AtSign, Smile, Plus, Gift, Sticker, Send, Image as ImageIcon, X } from "lucide-react";
import { getChannelMessages, sendMessage, avatarUrl, getPinnedMessages, type DiscordMessage, type DiscordUser, type DiscordChannel, type GuildChannel } from "@/lib/api";
import { Avatar } from "./Avatar";
import { cn } from "@/lib/utils";

interface ChatViewProps {
  channelId: string;
  channelName: string;
  channelTopic?: string;
  isDm?: boolean;
  dmRecipient?: DiscordUser | null;
  currentUser: DiscordUser | null;
  onInboxToggle?: () => void;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) {
    return `Today at ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  } else if (days === 1) {
    return `Yesterday at ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

function formatShortTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function isSameAuthorClose(a: DiscordMessage, b: DiscordMessage) {
  if (a.author.id !== b.author.id) return false;
  const diff = Math.abs(new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return diff < 7 * 60 * 1000;
}

function MessageGroup({ messages, isOwnMessage }: { messages: DiscordMessage[]; isOwnMessage: boolean }) {
  const first = messages[0];
  const author = first.author;
  const src = avatarUrl(author);
  const name = author.global_name ?? author.username;
  const initials = name[0]?.toUpperCase() ?? "?";

  return (
    <div className={cn("flex gap-4 px-4 py-1 group hover:bg-white/[0.025] transition-colors", isOwnMessage && "flex-row-reverse")}>
      <div className="shrink-0 mt-[2px]">
        <Avatar initials={initials} src={src} color="#5865f2" size="md" statusBg="#0a1220" />
      </div>
      <div className={cn("flex-1 min-w-0", isOwnMessage && "flex flex-col items-end")}>
        <div className={cn("flex items-baseline gap-2 mb-[2px]", isOwnMessage && "flex-row-reverse")}>
          <span className={cn("text-[14px] font-semibold leading-tight", isOwnMessage ? "text-[#89b4fa]" : "text-[#f2f3f5]")}>
            {name}
          </span>
          {author.bot && (
            <span className="px-1 py-[1px] text-[9px] font-bold bg-[#5865f2] text-white rounded uppercase tracking-wide leading-none">
              BOT
            </span>
          )}
          <span className="text-[11px] text-[#4e5058] opacity-0 group-hover:opacity-100 transition-opacity">
            {formatTime(first.timestamp)}
          </span>
        </div>
        <div className="space-y-[2px]">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} isOwn={isOwnMessage} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg, isOwn }: { msg: DiscordMessage; isOwn: boolean }) {
  const hasContent = msg.content.trim().length > 0;
  return (
    <div className={cn("group/msg flex items-start gap-2", isOwn && "flex-row-reverse")}>
      <div className={cn(
        "max-w-[500px] min-w-0",
        hasContent && "px-3 py-[6px] rounded-[18px]",
        isOwn
          ? "bg-[#1d6ef5] text-white rounded-br-[4px]"
          : "bg-[#111827] text-[#dbdee1] rounded-bl-[4px]",
        !hasContent && "bg-transparent px-0 py-0"
      )}>
        {hasContent && (
          <p className="text-[14px] leading-[1.5] break-words whitespace-pre-wrap">{msg.content}</p>
        )}
        {msg.attachments?.map((att) => {
          const isImg = att.content_type?.startsWith("image/") || /\.(png|jpg|jpeg|gif|webp)$/i.test(att.filename);
          if (isImg) {
            return (
              <img
                key={att.id}
                src={att.url}
                alt={att.filename}
                className="max-w-[400px] max-h-[300px] rounded-lg object-contain mt-1 cursor-pointer"
                loading="lazy"
              />
            );
          }
          return (
            <a
              key={att.id}
              href={att.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 mt-1 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 transition-colors text-[13px] text-[#00b0f4] underline"
            >
              <ImageIcon className="w-4 h-4 shrink-0" />
              {att.filename}
            </a>
          );
        })}
      </div>
      <span className="text-[10px] text-[#4e5058] opacity-0 group-hover/msg:opacity-100 transition-opacity self-end mb-1 shrink-0">
        {formatShortTime(msg.timestamp)}
        {msg.edited_timestamp && " (edited)"}
      </span>
    </div>
  );
}

function DateDivider({ date }: { date: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex-1 h-px bg-white/[0.06]" />
      <span className="text-[12px] font-semibold text-[#4e5058] shrink-0">{date}</span>
      <div className="flex-1 h-px bg-white/[0.06]" />
    </div>
  );
}

function formatDateLabel(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

interface MessageGroup2 {
  type: "date" | "messages";
  date?: string;
  messages?: DiscordMessage[];
}

function groupMessages(messages: DiscordMessage[]): MessageGroup2[] {
  if (messages.length === 0) return [];
  const sorted = [...messages].sort((a, b) => a.id.localeCompare(b.id));
  const groups: MessageGroup2[] = [];
  let currentDateLabel = "";
  let currentGroup: DiscordMessage[] = [];

  for (const msg of sorted) {
    const dateLabel = formatDateLabel(msg.timestamp);

    if (dateLabel !== currentDateLabel) {
      if (currentGroup.length > 0) {
        groups.push({ type: "messages", messages: currentGroup });
        currentGroup = [];
      }
      groups.push({ type: "date", date: dateLabel });
      currentDateLabel = dateLabel;
    }

    const last = currentGroup[currentGroup.length - 1];
    if (!last || !isSameAuthorClose(last, msg) || msg.type !== 0) {
      if (currentGroup.length > 0) {
        groups.push({ type: "messages", messages: currentGroup });
      }
      currentGroup = [msg];
    } else {
      currentGroup.push(msg);
    }
  }

  if (currentGroup.length > 0) {
    groups.push({ type: "messages", messages: currentGroup });
  }

  return groups;
}

export function ChatView({ channelId, channelName, channelTopic, isDm, dmRecipient, currentUser, onInboxToggle }: ChatViewProps) {
  const [messages, setMessages] = useState<DiscordMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [showPins, setShowPins] = useState(false);
  const [pins, setPins] = useState<DiscordMessage[]>([]);
  const [pinsLoading, setPinsLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async (prepend = false, beforeId?: string) => {
    if (prepend) setLoadingMore(true);
    else setLoading(true);

    const msgs = await getChannelMessages(channelId, 50, beforeId);

    if (!prepend) {
      setMessages(msgs);
      setHasMore(msgs.length === 50);
      shouldScrollRef.current = true;
    } else {
      if (msgs.length < 50) setHasMore(false);
      setMessages((prev) => {
        const ids = new Set(prev.map((m) => m.id));
        return [...msgs.filter((m) => !ids.has(m.id)), ...prev];
      });
    }
    if (prepend) setLoadingMore(false);
    else setLoading(false);
  }, [channelId]);

  useEffect(() => {
    setMessages([]);
    setHasMore(true);
    shouldScrollRef.current = true;
    load();
    inputRef.current?.focus();
  }, [channelId, load]);

  useEffect(() => {
    if (shouldScrollRef.current && !loading) {
      bottomRef.current?.scrollIntoView({ behavior: "instant" });
      shouldScrollRef.current = false;
    }
  }, [messages, loading]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop < 80 && hasMore && !loadingMore) {
      const oldScrollHeight = el.scrollHeight;
      const oldest = messages[0]?.id;
      if (oldest) {
        load(true, oldest).then(() => {
          requestAnimationFrame(() => {
            if (scrollRef.current) {
              scrollRef.current.scrollTop = scrollRef.current.scrollHeight - oldScrollHeight;
            }
          });
        });
      }
    }
  }

  async function handleSend() {
    const content = draft.trim();
    if (!content || sending) return;
    setSending(true);
    setDraft("");
    const msg = await sendMessage(channelId, content);
    if (msg) {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      shouldScrollRef.current = true;
    }
    setSending(false);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  async function handlePinsToggle() {
    if (showPins) {
      setShowPins(false);
      return;
    }
    setShowPins(true);
    setPinsLoading(true);
    const pinned = await getPinnedMessages(channelId);
    setPins(pinned);
    setPinsLoading(false);
  }

  function handleSearchToggle() {
    setSearchOpen((prev) => {
      if (!prev) {
        setTimeout(() => searchRef.current?.focus(), 50);
      } else {
        setSearchQuery("");
      }
      return !prev;
    });
  }

  function handleCallClick(video = false) {
    const url = `https://discord.com/channels/@me/${channelId}`;
    window.open(url, "_blank");
  }

  const allGroups = groupMessages(messages);
  const filteredMessages = searchQuery.trim()
    ? messages.filter((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : null;
  const groups = filteredMessages ? groupMessages(filteredMessages) : allGroups;
  const displayName = dmRecipient
    ? (dmRecipient.global_name ?? dmRecipient.username)
    : `#${channelName}`;

  return (
    <div className="flex-1 h-full flex flex-col min-w-0" style={{ backgroundColor: "#0a1220" }}>
      {/* Header */}
      <div
        className="h-12 shrink-0 flex items-center px-4 gap-3 select-none"
        style={{
          borderBottom: "1px solid rgba(0,0,0,0.4)",
          background: "linear-gradient(180deg, #0c1530 0%, #0a1220 100%)",
        }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isDm && dmRecipient ? (
            <Avatar
              initials={(dmRecipient.global_name ?? dmRecipient.username)[0]?.toUpperCase() ?? "?"}
              src={avatarUrl(dmRecipient)}
              color="#5865f2"
              size="sm"
              statusBg="#0a1220"
            />
          ) : (
            <Hash className="w-5 h-5 text-[#7d8188] shrink-0" />
          )}
          <span className="text-[#f2f3f5] font-semibold text-[15px] tracking-[-0.01em] truncate">
            {displayName}
          </span>
          {!isDm && channelTopic && (
            <>
              <div className="w-px h-5 bg-white/10 shrink-0" />
              <span className="text-[#7d8188] text-[13px] truncate">{channelTopic}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {isDm && (
            <>
              <IconBtn title="Start Voice Call" onClick={() => handleCallClick(false)}>
                <Phone className="w-[18px] h-[18px]" />
              </IconBtn>
              <IconBtn title="Start Video Call" onClick={() => handleCallClick(true)}>
                <Video className="w-[18px] h-[18px]" />
              </IconBtn>
            </>
          )}
          <IconBtn
            title="Pinned Messages"
            active={showPins}
            onClick={handlePinsToggle}
          >
            <Pin className="w-[18px] h-[18px]" />
          </IconBtn>
          {!isDm && <IconBtn title="Member List"><Users className="w-[18px] h-[18px]" /></IconBtn>}
          {searchOpen ? (
            <div className="flex items-center gap-1 bg-[#0d1525] border border-white/10 rounded-[6px] px-2 h-7">
              <Search className="w-3.5 h-3.5 text-[#7d8188] shrink-0" />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages…"
                className="bg-transparent text-[13px] text-[#dbdee1] placeholder-[#5e6068] outline-none w-36"
              />
              <button onClick={handleSearchToggle} className="text-[#6d6f76] hover:text-[#dbdee1] transition-colors ml-1">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <IconBtn title="Search" onClick={handleSearchToggle}>
              <Search className="w-[18px] h-[18px]" />
            </IconBtn>
          )}
          <IconBtn
            title="Inbox"
            onClick={isDm ? undefined : onInboxToggle}
          >
            <Inbox className="w-[18px] h-[18px]" />
          </IconBtn>
          <IconBtn title="Help"><HelpCircle className="w-[18px] h-[18px]" /></IconBtn>
        </div>
      </div>

      {/* Search active banner */}
      {searchOpen && searchQuery.trim() && (
        <div className="px-4 py-1.5 text-[12px] text-[#87898c] shrink-0 flex items-center gap-2" style={{ background: "#0d1525", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <Search className="w-3 h-3" />
          {filteredMessages?.length ?? 0} result{(filteredMessages?.length ?? 0) !== 1 ? "s" : ""} for
          <span className="text-[#dbdee1] font-semibold">"{searchQuery}"</span>
        </div>
      )}

      {/* Messages + Pins Row */}
      <div className="flex flex-1 min-h-0">
      {/* Messages Area */}
      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto discord-scrollbar">
        {loadingMore && (
          <div className="flex justify-center py-4">
            <div className="w-5 h-5 rounded-full border-2 border-[#1d6ef5]/30 border-t-[#1d6ef5] animate-spin" />
          </div>
        )}

        {!hasMore && !loading && (
          <div className="px-4 pt-8 pb-4">
            {isDm && dmRecipient ? (
              <div className="flex flex-col items-start gap-3">
                <Avatar
                  initials={(dmRecipient.global_name ?? dmRecipient.username)[0]?.toUpperCase() ?? "?"}
                  src={avatarUrl(dmRecipient)}
                  color="#5865f2"
                  size="lg"
                  statusBg="#0a1220"
                />
                <h2 className="text-[24px] font-bold text-[#f2f3f5]">
                  {dmRecipient.global_name ?? dmRecipient.username}
                </h2>
                <p className="text-[#87898c] text-[14px]">
                  This is the beginning of your direct message history with{" "}
                  <strong className="text-[#dbdee1]">@{dmRecipient.username}</strong>.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-start gap-2">
                <div className="w-[52px] h-[52px] rounded-full bg-[#1d6ef5] flex items-center justify-center">
                  <Hash className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-[24px] font-bold text-[#f2f3f5]">Welcome to #{channelName}!</h2>
                {channelTopic && <p className="text-[#87898c] text-[14px]">{channelTopic}</p>}
                <p className="text-[#87898c] text-[13px]">This is the start of the #{channelName} channel.</p>
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#1d6ef5]/30 border-t-[#1d6ef5] animate-spin" />
              <span className="text-[#949ba4] text-[13px]">Loading messages…</span>
            </div>
          </div>
        )}

        {!loading && groups.map((g, i) => {
          if (g.type === "date") {
            return <DateDivider key={`date-${i}`} date={g.date!} />;
          }
          const msgs = g.messages!;
          const first = msgs[0];
          const isOwn = currentUser?.id === first.author.id;
          return <MessageGroup key={first.id} messages={msgs} isOwnMessage={isOwn} />;
        })}

        {!loading && groups.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full gap-3 pb-12">
            <span className="text-[#5e6068] text-[14px]">No messages yet. Say hello!</span>
          </div>
        )}

        <div ref={bottomRef} className="h-4" />
      </div>

      {/* Pins Panel */}
      {showPins && (
        <div
          className="w-[320px] shrink-0 h-full flex flex-col border-l border-white/[0.06]"
          style={{ background: "#080e1c" }}
        >
          <div className="h-12 flex items-center px-4 gap-2 shrink-0 border-b border-white/[0.06]">
            <Pin className="w-4 h-4 text-[#6d6f76]" />
            <span className="text-[#f2f3f5] font-semibold text-[15px] flex-1">Pinned Messages</span>
            <button
              onClick={() => setShowPins(false)}
              className="w-8 h-8 rounded-[6px] flex items-center justify-center text-[#6d6f76] hover:text-[#dbdee1] hover:bg-white/8 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto discord-scrollbar py-2">
            {pinsLoading ? (
              <div className="flex items-center justify-center py-12 gap-2 text-[#4e5058]">
                <div className="w-4 h-4 rounded-full border-2 border-white/10 border-t-white/50 animate-spin" />
                <span className="text-[13px]">Loading…</span>
              </div>
            ) : pins.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#4e5058] px-6 text-center">
                <Pin className="w-10 h-10" />
                <p className="text-[13px] font-medium">No pins yet</p>
                <p className="text-[12px] text-[#4e5058] leading-relaxed">Right-click a message and choose Pin to pin it here.</p>
              </div>
            ) : (
              pins.map((msg) => {
                const name = msg.author.global_name ?? msg.author.username;
                const src = avatarUrl(msg.author);
                const time = new Date(msg.timestamp).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
                return (
                  <div key={msg.id} className="px-3 py-2">
                    <div className="rounded-[8px] p-3" style={{ background: "#0d1525", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="flex items-start gap-2">
                        <Avatar initials={name[0]?.toUpperCase() ?? "?"} src={src} color="#5865f2" size="sm" statusBg="#0d1525" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-1.5 mb-0.5">
                            <span className="text-[13px] font-semibold text-[#f2f3f5]">{name}</span>
                            <span className="text-[11px] text-[#5e6068]">{time}</span>
                          </div>
                          {msg.content ? (
                            <p className="text-[13px] text-[#dbdee1] leading-snug break-words">{msg.content}</p>
                          ) : (
                            <p className="text-[12px] text-[#5e6068] italic">(attachment or embed)</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
      </div>

      {/* Input Bar */}
      <div className="shrink-0 px-4 pb-4 pt-2">
        <div
          className="flex items-end rounded-[12px] px-3 py-2 gap-2 transition-colors focus-within:ring-1 focus-within:ring-white/10"
          style={{ backgroundColor: "#1e2842" }}
        >
          <button className="w-8 h-8 flex items-center justify-center text-[#87898c] hover:text-[#dbdee1] transition-colors shrink-0 self-end mb-[2px]" title="Add attachment">
            <Plus className="w-5 h-5" />
          </button>
          <textarea
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${isDm ? (dmRecipient ? `@${dmRecipient.username}` : "DM") : `#${channelName}`}`}
            rows={1}
            className="flex-1 bg-transparent text-[#dcddde] placeholder:text-[#6d6f78] text-[15px] outline-none resize-none max-h-[200px] leading-[1.5] py-[3px] discord-scrollbar"
            style={{
              overflowY: "auto",
            }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 200) + "px";
            }}
          />
          <div className="flex items-center gap-1 shrink-0 self-end mb-[2px]">
            <button className="w-8 h-8 flex items-center justify-center text-[#87898c] hover:text-[#dbdee1] transition-colors" title="Gif">
              <Gift className="w-5 h-5" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-[#87898c] hover:text-[#dbdee1] transition-colors" title="Sticker">
              <Sticker className="w-5 h-5" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-[#87898c] hover:text-[#dbdee1] transition-colors" title="Emoji">
              <Smile className="w-5 h-5" />
            </button>
            {draft.trim() && (
              <button
                onClick={handleSend}
                disabled={sending}
                className="w-8 h-8 flex items-center justify-center bg-[#1d6ef5] hover:bg-[#1a5fd4] text-white rounded-[8px] transition-colors disabled:opacity-50"
                title="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <p className="text-[11px] text-[#4e5058] mt-1.5 px-1">
          Press <kbd className="px-1 py-0.5 rounded bg-white/5 text-[10px]">Enter</kbd> to send · <kbd className="px-1 py-0.5 rounded bg-white/5 text-[10px]">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}

function IconBtn({ children, title, active, onClick }: { children: React.ReactNode; title: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={cn(
        "w-8 h-8 flex items-center justify-center rounded-[6px] transition-colors",
        active
          ? "text-[#f2f3f5] bg-white/10"
          : "text-[#87898c] hover:text-[#dbdee1] hover:bg-white/5"
      )}
    >
      {children}
    </button>
  );
}
