import { useState, useEffect, useRef, memo } from "react";
import { Hash, Phone, Video, Pin, Users, Search, Inbox, HelpCircle, Smile, Plus, Gift, Sticker, Send, X, Megaphone } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useMessages, useTypingUsers, useSimulatedActivity } from "@/hooks/useMessages";
import type { Message, User, Channel } from "@/types";
import { Avatar } from "./Avatar";
import { cn } from "@/lib/utils";

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return `Today at ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  if (days === 1) return `Yesterday at ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

function formatShortTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDateLabel(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function isSameAuthorClose(a: Message, b: Message): boolean {
  if (a.authorId !== b.authorId) return false;
  const diff = Math.abs(new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return diff < 7 * 60 * 1000;
}

interface MsgGroup {
  type: "date" | "messages";
  date?: string;
  messages?: Message[];
}

function groupMessages(messages: Message[]): MsgGroup[] {
  if (messages.length === 0) return [];
  const sorted = [...messages].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  const groups: MsgGroup[] = [];
  let currentDateLabel = "";
  let currentGroup: Message[] = [];

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
    if (!last || !isSameAuthorClose(last, msg)) {
      if (currentGroup.length > 0) groups.push({ type: "messages", messages: currentGroup });
      currentGroup = [msg];
    } else {
      currentGroup.push(msg);
    }
  }
  if (currentGroup.length > 0) groups.push({ type: "messages", messages: currentGroup });
  return groups;
}

const MessageBubble = memo(function MessageBubble({ msg, isOwn }: { msg: Message; isOwn: boolean }) {
  return (
    <div className={cn("group/msg flex items-start gap-2", isOwn && "flex-row-reverse")}>
      <div className={cn(
        "max-w-[500px] min-w-0 px-3 py-[6px] rounded-[18px]",
        isOwn ? "bg-[#aa0000] text-white rounded-br-[4px]" : "bg-[#1a0a0a] text-[#dbdee1] rounded-bl-[4px]"
      )}>
        <p className="text-[14px] leading-[1.5] break-words whitespace-pre-wrap">{msg.content}</p>
      </div>
      <span className="text-[10px] text-[#4e5058] opacity-0 group-hover/msg:opacity-100 transition-opacity self-end mb-1 shrink-0">
        {formatShortTime(msg.timestamp)}
        {msg.editedAt && " (edited)"}
      </span>
    </div>
  );
});

const MessageGroupBlock = memo(function MessageGroupBlock({
  messages, isOwnMessage, getUserById,
}: {
  messages: Message[];
  isOwnMessage: boolean;
  getUserById: (id: string) => User | undefined;
}) {
  const first = messages[0];
  const author = getUserById(first.authorId);
  const name = author?.displayName ?? "Unknown";
  const initials = name[0]?.toUpperCase() ?? "?";

  return (
    <div className={cn("flex gap-4 px-4 py-1 group hover:bg-white/[0.025] transition-colors", isOwnMessage && "flex-row-reverse")}>
      <div className="shrink-0 mt-[2px]">
        <Avatar
          initials={initials}
          color={author?.avatarColor ?? "#cc0000"}
          size="md"
          statusBg="#0a0000"
        />
      </div>
      <div className={cn("flex-1 min-w-0", isOwnMessage && "flex flex-col items-end")}>
        <div className={cn("flex items-baseline gap-2 mb-[2px]", isOwnMessage && "flex-row-reverse")}>
          <span className={cn("text-[14px] font-semibold leading-tight", isOwnMessage ? "text-[#ff8080]" : "text-[#f2f3f5]")}>
            {name}
          </span>
          {author?.bot && (
            <span className="px-1 py-[1px] text-[9px] font-bold bg-[#aa0000] text-white rounded uppercase tracking-wide leading-none">
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
});

function DateDivider({ date }: { date: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex-1 h-px bg-white/[0.06]" />
      <span className="text-[12px] font-semibold text-[#4e5058] shrink-0">{date}</span>
      <div className="flex-1 h-px bg-white/[0.06]" />
    </div>
  );
}

function TypingIndicator({ users }: { users: (User | undefined)[] }) {
  const validUsers = users.filter(Boolean) as User[];
  if (validUsers.length === 0) return null;

  const names = validUsers.map((u) => u.displayName);
  const text = names.length === 1
    ? `${names[0]} is typing…`
    : names.length === 2
    ? `${names[0]} and ${names[1]} are typing…`
    : `${names[0]} and ${names.length - 1} others are typing…`;

  return (
    <div className="px-4 pb-1 flex items-center gap-2 h-5">
      <div className="flex gap-[3px] items-center">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-[5px] h-[5px] rounded-full bg-[#87898c] animate-bounce"
            style={{ animationDelay: `${i * 150}ms`, animationDuration: "0.9s" }}
          />
        ))}
      </div>
      <span className="text-[12px] text-[#87898c]">{text}</span>
    </div>
  );
}

function IconBtn({
  children, title, onClick, active,
}: {
  children: React.ReactNode;
  title: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={cn(
        "w-8 h-8 rounded-[6px] flex items-center justify-center transition-all duration-150",
        active ? "text-[#f2f3f5] bg-white/10" : "text-[#87898c] hover:text-[#dbdee1] hover:bg-white/8"
      )}
    >
      {children}
    </button>
  );
}

interface ChatViewProps {
  channelId: string;
  channelName: string;
  channelTopic?: string;
  isDm?: boolean;
  dmRecipient?: User | null;
  onInboxToggle?: () => void;
}

export function ChatView({ channelId, channelName, channelTopic, isDm, dmRecipient, onInboxToggle }: ChatViewProps) {
  const currentUserId = useAppStore((s) => s.currentUserId);
  const getUserById = useAppStore((s) => s.getUserById);
  const sendMessage = useAppStore((s) => s.sendMessage);
  const currentUser = getUserById(currentUserId);

  const messages = useMessages(channelId);
  const typingUsers = useTypingUsers(channelId);

  useSimulatedActivity(channelId);

  const [draft, setDraft] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    isFirstLoad.current = true;
    setDraft("");
    setSearchQuery("");
    setSearchOpen(false);
    inputRef.current?.focus();
  }, [channelId]);

  useEffect(() => {
    if (isFirstLoad.current) {
      bottomRef.current?.scrollIntoView({ behavior: "instant" });
      isFirstLoad.current = false;
      return;
    }
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (nearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  function handleSend() {
    const content = draft.trim();
    if (!content) return;
    sendMessage(channelId, content);
    setDraft("");
    inputRef.current?.focus();
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const displayMessages = searchQuery.trim()
    ? messages.filter((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  const groups = groupMessages(displayMessages);
  const displayName = isDm && dmRecipient ? dmRecipient.displayName : `#${channelName}`;

  return (
    <div className="flex-1 h-full flex flex-col min-w-0" style={{ backgroundColor: "#0a0000" }}>
      <div
        className="h-12 shrink-0 flex items-center px-4 gap-3 select-none"
        style={{ borderBottom: "1px solid rgba(80,0,0,0.4)", background: "linear-gradient(180deg, #150000 0%, #0a0000 100%)" }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isDm && dmRecipient ? (
            <Avatar initials={dmRecipient.initials} color={dmRecipient.avatarColor} size="sm" statusBg="#0a0000" status={dmRecipient.status} />
          ) : (
            channelName === "announcements" ? <Megaphone className="w-5 h-5 text-[#7d8188] shrink-0" /> : <Hash className="w-5 h-5 text-[#7d8188] shrink-0" />
          )}
          <span className="text-[#f2f3f5] font-semibold text-[15px] tracking-[-0.01em] truncate">{displayName}</span>
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
              <IconBtn title="Start Voice Call"><Phone className="w-[18px] h-[18px]" /></IconBtn>
              <IconBtn title="Start Video Call"><Video className="w-[18px] h-[18px]" /></IconBtn>
            </>
          )}
          {!isDm && <IconBtn title="Member List"><Users className="w-[18px] h-[18px]" /></IconBtn>}
          <IconBtn title="Pinned Messages"><Pin className="w-[18px] h-[18px]" /></IconBtn>
          {searchOpen ? (
            <div className="flex items-center gap-1 bg-[#1a0000] border border-white/10 rounded-[6px] px-2 h-7">
              <Search className="w-3.5 h-3.5 text-[#7d8188] shrink-0" />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages…"
                className="bg-transparent text-[13px] text-[#dbdee1] placeholder-[#5e6068] outline-none w-36"
              />
              <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="text-[#6d6f76] hover:text-[#dbdee1] transition-colors ml-1">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <IconBtn title="Search" onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50); }}>
              <Search className="w-[18px] h-[18px]" />
            </IconBtn>
          )}
          <IconBtn title="Inbox" onClick={onInboxToggle}><Inbox className="w-[18px] h-[18px]" /></IconBtn>
          <IconBtn title="Help"><HelpCircle className="w-[18px] h-[18px]" /></IconBtn>
        </div>
      </div>

      {searchOpen && searchQuery.trim() && (
        <div className="px-4 py-1.5 text-[12px] text-[#87898c] shrink-0 flex items-center gap-2" style={{ background: "#1a0000", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <Search className="w-3 h-3" />
          {displayMessages.length} result{displayMessages.length !== 1 ? "s" : ""} for <span className="text-[#dbdee1] font-semibold">"{searchQuery}"</span>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto discord-scrollbar">
        <div className="px-4 pt-8 pb-2">
          {isDm && dmRecipient ? (
            <div className="flex flex-col items-start gap-3">
              <Avatar initials={dmRecipient.initials} color={dmRecipient.avatarColor} size="lg" statusBg="#0a0000" status={dmRecipient.status} />
              <h2 className="text-[24px] font-bold text-[#f2f3f5]">{dmRecipient.displayName}</h2>
              <p className="text-[#87898c] text-[14px]">
                This is the beginning of your direct message history with{" "}
                <strong className="text-[#dbdee1]">@{dmRecipient.username}</strong>.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-2">
              <div className="w-[52px] h-[52px] rounded-full bg-[#aa0000] flex items-center justify-center">
                <Hash className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-[24px] font-bold text-[#f2f3f5]">Welcome to #{channelName}!</h2>
              {channelTopic && <p className="text-[#87898c] text-[14px]">{channelTopic}</p>}
              <p className="text-[#87898c] text-[13px]">This is the start of the #{channelName} channel.</p>
            </div>
          )}
        </div>

        {groups.map((g, i) => {
          if (g.type === "date") return <DateDivider key={`date-${i}`} date={g.date!} />;
          const msgs = g.messages!;
          const isOwn = currentUser?.id === msgs[0].authorId;
          return (
            <MessageGroupBlock
              key={msgs[0].id}
              messages={msgs}
              isOwnMessage={isOwn}
              getUserById={getUserById}
            />
          );
        })}

        {groups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <span className="text-[#5e6068] text-[14px]">No messages yet. Say hello!</span>
          </div>
        )}

        <div ref={bottomRef} className="h-2" />
      </div>

      <TypingIndicator users={typingUsers} />

      <div className="shrink-0 px-4 pb-4 pt-1">
        <div
          className="flex items-end rounded-[12px] px-3 py-2 gap-2 transition-colors focus-within:ring-1 focus-within:ring-white/10"
          style={{ backgroundColor: "#1a0505" }}
        >
          <button className="w-8 h-8 flex items-center justify-center text-[#87898c] hover:text-[#dbdee1] transition-colors shrink-0 self-end mb-[2px]" title="Add attachment">
            <Plus className="w-5 h-5" />
          </button>
          <textarea
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${isDm && dmRecipient ? `@${dmRecipient.username}` : `#${channelName}`}`}
            rows={1}
            className="flex-1 bg-transparent text-[#dcddde] placeholder:text-[#6d6f78] text-[15px] outline-none resize-none max-h-[200px] leading-[1.5] py-[3px] discord-scrollbar"
            style={{ overflowY: "auto" }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 200) + "px";
            }}
          />
          <div className="flex items-center gap-1 shrink-0 self-end mb-[2px]">
            <button className="w-8 h-8 flex items-center justify-center text-[#87898c] hover:text-[#dbdee1] transition-colors" title="GIF">
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
                className="w-8 h-8 rounded-[6px] flex items-center justify-center bg-[#cc0000] text-white hover:bg-[#aa0000] transition-colors"
                title="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
