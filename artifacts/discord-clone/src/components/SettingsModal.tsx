import { useState, useEffect } from "react";
import {
  X, Search, User, Globe, Shield, Users, Cpu, Link2, Bell,
  Zap, Rocket, CreditCard, Gift, Palette, Accessibility, Mic,
  MessageSquare, Keyboard, Clock, Tv, MoreHorizontal, Activity,
  LogOut, Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDiscord } from "@/hooks/useDiscord";
import { avatarUrl } from "@/lib/api";
import { Avatar } from "./Avatar";
import { InProgressClock } from "./InProgress";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

type SettingsPage =
  | "my-account" | "content-social" | "data-privacy" | "family-center"
  | "authorized-apps" | "devices" | "connections" | "notifications"
  | "nitro" | "server-boost" | "subscriptions" | "gift-inventory" | "billing"
  | "appearance" | "accessibility" | "voice-video" | "chat" | "keybinds"
  | "language-time" | "streamer-mode" | "advanced" | "activity-privacy";

interface NavItem {
  id: SettingsPage | "logout";
  label: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  danger?: boolean;
}

interface NavSection {
  label?: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    label: "User Settings",
    items: [
      { id: "my-account",      label: "My Account",       icon: <User className="w-4 h-4" /> },
      { id: "content-social",  label: "Content & Social",  icon: <Globe className="w-4 h-4" /> },
      { id: "data-privacy",    label: "Data & Privacy",    icon: <Shield className="w-4 h-4" /> },
      { id: "family-center",   label: "Family Center",     icon: <Users className="w-4 h-4" /> },
      { id: "authorized-apps", label: "Authorized Apps",   icon: <Cpu className="w-4 h-4" /> },
      { id: "devices",         label: "Devices",           icon: <Cpu className="w-4 h-4" /> },
      { id: "connections",     label: "Connections",       icon: <Link2 className="w-4 h-4" /> },
      { id: "notifications",   label: "Notifications",     icon: <Bell className="w-4 h-4" /> },
    ],
  },
  {
    label: "Billing Settings",
    items: [
      { id: "nitro",          label: "Nitro",          icon: <Zap className="w-4 h-4" /> },
      { id: "server-boost",   label: "Server Boost",   icon: <Rocket className="w-4 h-4" /> },
      { id: "subscriptions",  label: "Subscriptions",  icon: <CreditCard className="w-4 h-4" /> },
      { id: "gift-inventory", label: "Gift Inventory", icon: <Gift className="w-4 h-4" /> },
      { id: "billing",        label: "Billing",        icon: <CreditCard className="w-4 h-4" /> },
    ],
  },
  {
    label: "App Settings",
    items: [
      { id: "appearance",    label: "Appearance",    icon: <Palette className="w-4 h-4" /> },
      { id: "accessibility", label: "Accessibility", icon: <Accessibility className="w-4 h-4" /> },
      { id: "voice-video",   label: "Voice & Video", icon: <Mic className="w-4 h-4" /> },
      {
        id: "chat", label: "Chat", icon: <MessageSquare className="w-4 h-4" />,
        badge: <span className="ml-auto bg-[#eb459e] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">NEW</span>,
      },
      { id: "keybinds",       label: "Keybinds",        icon: <Keyboard className="w-4 h-4" /> },
      { id: "language-time",  label: "Language & Time",  icon: <Clock className="w-4 h-4" /> },
      { id: "streamer-mode",  label: "Streamer Mode",    icon: <Tv className="w-4 h-4" /> },
      { id: "advanced",       label: "Advanced",         icon: <MoreHorizontal className="w-4 h-4" /> },
    ],
  },
  {
    label: "Activity Settings",
    items: [
      { id: "activity-privacy", label: "Activity Privacy", icon: <Activity className="w-4 h-4" /> },
    ],
  },
  {
    items: [
      { id: "logout", label: "Log Out", icon: <LogOut className="w-4 h-4" />, danger: true },
    ],
  },
];

const pageTitles: Record<string, string> = {
  "content-social": "Content & Social", "data-privacy": "Data & Privacy",
  "family-center": "Family Center", "authorized-apps": "Authorized Apps",
  devices: "Devices", connections: "Connections", notifications: "Notifications",
  nitro: "Nitro", "server-boost": "Server Boost", subscriptions: "Subscriptions",
  "gift-inventory": "Gift Inventory", billing: "Billing", appearance: "Appearance",
  accessibility: "Accessibility", "voice-video": "Voice & Video", chat: "Chat",
  keybinds: "Keybinds", "language-time": "Language & Time",
  "streamer-mode": "Streamer Mode", advanced: "Advanced",
  "activity-privacy": "Activity Privacy",
};

function TabBtn({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "pb-[10px] mr-5 text-[15px] font-medium border-b-2 transition-colors",
        isActive ? "text-[#f2f3f5] border-[#cc0000]" : "text-[#949ba4] border-transparent hover:text-[#dbdee1]"
      )}
    >
      {label}
    </button>
  );
}

function AccountField({ label, value, onEdit, editLabel = "Edit" }: { label: string; value: React.ReactNode; onEdit: () => void; editLabel?: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-[14px]">
      <div className="min-w-0 flex-1 pr-4">
        <div className="text-[12px] font-bold text-[#b5bac1] uppercase tracking-wide mb-[2px]">{label}</div>
        <div className="text-[14px] text-[#dbdee1]">{value}</div>
      </div>
      <button
        onClick={onEdit}
        className="shrink-0 px-4 py-[6px] rounded-[3px] text-[14px] font-medium text-[#dbdee1] transition-colors hover:bg-[#5c6068]"
        style={{ backgroundColor: "#4e5058" }}
      >
        {editLabel}
      </button>
    </div>
  );
}

function Divider() {
  return <div className="h-px mx-4" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />;
}

function MyAccountPage() {
  const { user } = useDiscord();
  const [activeTab, setActiveTab] = useState<"security" | "standing">("security");
  const [showEmail, setShowEmail] = useState(false);

  const displayName = user?.global_name ?? user?.username ?? "Unknown";
  const username = user?.username ?? "";
  const initials = displayName[0]?.toUpperCase() ?? "?";
  const avatarColor = "#cc0000";
  const avatarSrc = user ? avatarUrl(user) : null;
  const discriminator = user?.discriminator && user.discriminator !== "0" ? `#${user.discriminator}` : "";

  return (
    <>
      <div className="px-10 pt-[72px] pb-0 shrink-0">
        <h2 className="text-[20px] font-bold text-[#f2f3f5] mb-4">My Account</h2>
        <div className="flex items-end gap-0 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <TabBtn label="Security" isActive={activeTab === "security"} onClick={() => setActiveTab("security")} />
          <TabBtn label="Standing" isActive={activeTab === "standing"} onClick={() => setActiveTab("standing")} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto discord-scrollbar px-10 py-5">
        {activeTab === "security" ? (
          <div className="max-w-[660px] space-y-[10px]">
            <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "#111214" }}>
              <div className="h-[100px] relative" style={{ background: "#000" }}>
                <div
                  className="absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                    backgroundSize: "120px 120px",
                  }}
                />
              </div>
              <div className="px-4 pb-3">
                <div className="flex items-end justify-between -mt-9 mb-2">
                  <div className="relative">
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt={displayName}
                        className="w-[72px] h-[72px] rounded-full border-[6px] object-cover"
                        style={{ borderColor: "#111214" }}
                      />
                    ) : (
                      <div
                        className="w-[72px] h-[72px] rounded-full flex items-center justify-center font-bold text-white border-[6px]"
                        style={{ backgroundColor: "#cc0000", borderColor: "#111214", fontSize: 20 }}
                      >
                        {initials}
                      </div>
                    )}
                    <div
                      className="absolute bottom-[5px] right-[5px] w-[14px] h-[14px] rounded-full border-[3px] flex items-center justify-center"
                      style={{ backgroundColor: "#23a55a", borderColor: "#111214" }}
                    />
                  </div>
                  <button
                    className="px-3 py-[6px] rounded-[3px] text-[13px] font-semibold text-white hover:brightness-110 transition-all"
                    style={{ backgroundColor: "#cc0000" }}
                  >
                    Edit User Profile
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[18px] font-bold text-[#f2f3f5]">{displayName}</span>
                  {user?.bot && (
                    <span className="px-1 py-[1px] text-[9px] font-bold bg-[#cc0000] text-white rounded uppercase tracking-wide">BOT</span>
                  )}
                </div>
                <div className="text-[14px] text-[#87898c]">{username}{discriminator}</div>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "#111214" }}>
              <AccountField label="Display Name" value={displayName} onEdit={() => {}} />
              <Divider />
              <AccountField label="Username" value={`${username}${discriminator}`} onEdit={() => {}} />
              <Divider />
              {user?.email ? (
                <>
                  <AccountField
                    label="Email"
                    value={
                      <div className="flex items-center gap-2">
                        <span>{showEmail ? user.email : user.email.replace(/(?<=.{2}).(?=.*@)/g, "*")}</span>
                        <button
                          className="text-[#00b0f4] text-[13px] hover:underline"
                          onClick={() => setShowEmail(!showEmail)}
                        >
                          {showEmail ? "Hide" : "Reveal"}
                        </button>
                      </div>
                    }
                    onEdit={() => {}}
                  />
                  <Divider />
                </>
              ) : null}
              <AccountField
                label="Phone Number"
                value="You haven't added a phone number yet."
                onEdit={() => {}}
                editLabel="Add"
              />
            </div>
          </div>
        ) : (
          <div className="max-w-[660px] flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#23a55a22" }}>
              <span className="text-4xl">✅</span>
            </div>
            <h3 className="text-[20px] font-bold text-[#f2f3f5] mb-2">Your account is in good standing!</h3>
            <p className="text-[#949ba4] text-[15px] max-w-xs">
              You have no active restrictions, warnings, or bans applied to your account.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <>
      <div className="px-10 pt-[72px] pb-0 shrink-0">
        <h2 className="text-[20px] font-bold text-[#f2f3f5] mb-4">{title}</h2>
        <div className="border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }} />
      </div>
      <div className="flex-1 overflow-y-auto discord-scrollbar px-10 py-5">
        <div
          className="max-w-[660px] rounded-lg flex flex-col items-center justify-center py-16 text-center"
          style={{ backgroundColor: "#111214" }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{ background: "linear-gradient(135deg,#1a1b1e,#313338)" }}>
            <Palette className="w-6 h-6 text-[#5e6068]" />
          </div>
          <p className="text-[#5e6068] text-[14px] font-medium">This section is coming soon.</p>
          <p className="text-[#3e4147] text-[12px] mt-1">No settings available here yet.</p>
        </div>
      </div>
    </>
  );
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { user, logout } = useDiscord();
  const [activePage, setActivePage] = useState<SettingsPage>("my-account");
  const [search, setSearch] = useState("");
  const [pageKey, setPageKey] = useState(0);

  const displayName = user?.global_name ?? user?.username ?? "Unknown";
  const initials = displayName[0]?.toUpperCase() ?? "?";
  const avatarSrc = user ? avatarUrl(user) : null;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handlePageChange = (page: SettingsPage) => {
    setActivePage(page);
    setPageKey(k => k + 1);
  };

  if (!open) return null;

  const filteredSections = navSections
    .map((s) => ({ ...s, items: s.items.filter((i) => search === "" || i.label.toLowerCase().includes(search.toLowerCase())) }))
    .filter((s) => s.items.length > 0);

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex animate-modal-slide-in" style={{ left: 72, backgroundColor: "#313338" }}>

      {/* Sidebar */}
      <div
        className="shrink-0 h-full flex flex-col items-end overflow-y-auto discord-scrollbar pt-[72px] pb-[20px] animate-sidebar-slide-in"
        style={{ width: 232, backgroundColor: "#2b2d31" }}
      >
        <div className="w-[200px]">
          {/* User header */}
          <div className="px-2 pb-2">
            <div className="flex items-center gap-2">
              <div className="relative shrink-0">
                {avatarSrc ? (
                  <img src={avatarSrc} alt={displayName} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[12px]"
                    style={{ backgroundColor: "#cc0000" }}
                  >
                    {initials}
                  </div>
                )}
                <div
                  className="absolute -bottom-[1px] -right-[1px] w-[11px] h-[11px] rounded-full border-[2px]"
                  style={{ backgroundColor: "#23a55a", borderColor: "#2b2d31" }}
                />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-[#f2f3f5] leading-tight truncate">
                  {displayName}
                </div>
                <button className="flex items-center gap-1 text-[11px] text-[#6d6f76] hover:text-[#dbdee1] transition-colors">
                  Edit Profiles <Pencil className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Search */}
          <div
            className="flex items-center gap-2 mx-2 px-2 py-[5px] rounded-[3px] mb-3"
            style={{ backgroundColor: "#1e1f22" }}
          >
            <Search className="w-3 h-3 shrink-0" style={{ color: "#949ba4" }} />
            <input
              className="flex-1 bg-transparent text-[13px] placeholder:text-[#949ba4] outline-none"
              style={{ color: "#f2f3f5" }}
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Nav */}
          {filteredSections.map((section, si) => (
            <div key={section.label ?? "section-logout"}>
              {section.label && (
                <div className="px-2 pt-3 pb-[2px] text-[11px] font-bold uppercase tracking-wider" style={{ color: "#949ba4" }}>
                  {section.label}
                </div>
              )}
              {section.items.map((item) =>
                item.id === "logout" ? (
                  <button
                    key={item.id}
                    onClick={() => { logout(); onClose(); }}
                    className="w-full flex items-center gap-2 px-2 py-[6px] rounded-[3px] text-[#ed4245] transition-colors hover:bg-[#ed424520]"
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span className="text-[14px] font-medium">{item.label}</span>
                  </button>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => handlePageChange(item.id as SettingsPage)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-[6px] rounded-[3px] transition-colors text-left",
                      activePage === item.id
                        ? "bg-[#2a0505] text-[#f2f3f5]"
                        : "text-[#949ba4] hover:bg-[#1a0505] hover:text-[#dbdee1]"
                    )}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span className="text-[14px] font-medium flex-1 text-left">{item.label}</span>
                    {item.badge}
                  </button>
                )
              )}
              {si < filteredSections.length - 1 && (
                <div className="mt-3 mb-3 mx-2 h-px" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
              )}
            </div>
          ))}

          <div className="mt-4 px-2">
            <p className="text-[11px]" style={{ color: "#6d6f76" }}>stable 511379 (2376a86)</p>
            <div className="flex flex-wrap items-center gap-1 mt-1">
              {["Privacy Policy", "Terms of Service", "More"].map((label, i, arr) => (
                <span key={label} className="flex items-center gap-1">
                  <button className="text-[11px] hover:underline" style={{ color: "#00b0f4" }}>{label}</button>
                  {i < arr.length - 1 && <span className="text-[11px]" style={{ color: "#6d6f76" }}>•</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content pane */}
      <div className="flex-1 flex overflow-hidden" style={{ backgroundColor: "#313338" }}>
        <div key={pageKey} className="flex-1 flex flex-col overflow-hidden min-w-0 animate-page-slide-right items-center justify-center">
          <div className="flex flex-col items-center gap-5 py-16">
            <InProgressClock size={80} />
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-[20px] font-bold text-[#dbdee1]">{pageTitles[activePage] ?? (activePage === "my-account" ? "My Account" : activePage)}</span>
              <span className="text-[14px] text-[#5e6068] max-w-[320px] leading-relaxed">
                This settings section is currently being built.
              </span>
            </div>
            <div className="px-4 py-1.5 rounded-full text-[12px] font-semibold uppercase tracking-widest"
              style={{ background: "rgba(0,176,244,0.12)", color: "#00b0f4", border: "1px solid rgba(0,176,244,0.2)" }}>
              Coming Soon
            </div>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-center pt-[72px] px-5">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
            style={{ border: "2px solid #4e5058" }}
            title="Close (Esc)"
          >
            <X className="w-5 h-5" style={{ color: "#b5bac1" }} />
          </button>
          <span className="text-[11px] mt-1 font-medium" style={{ color: "#4e5058" }}>ESC</span>
        </div>
      </div>
    </div>
  );
}
