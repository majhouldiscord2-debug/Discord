import { useState, useEffect } from "react";
import { X, Search, User, Globe, Shield, Users, Cpu, Link2, Bell, Zap, Rocket, CreditCard, Gift, Palette, Accessibility, Mic, MessageSquare, Keyboard, Clock, Tv, MoreHorizontal, Activity, LogOut, ChevronRight, Pencil, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { currentUser } from "@/lib/mock-data";
import { Avatar } from "./Avatar";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

type SettingsPage =
  | "my-account"
  | "content-social"
  | "data-privacy"
  | "family-center"
  | "authorized-apps"
  | "devices"
  | "connections"
  | "notifications"
  | "nitro"
  | "server-boost"
  | "subscriptions"
  | "gift-inventory"
  | "billing"
  | "appearance"
  | "accessibility"
  | "voice-video"
  | "chat"
  | "keybinds"
  | "language-time"
  | "streamer-mode"
  | "advanced"
  | "activity-privacy";

interface NavSection {
  label?: string;
  items: NavItem[];
}

interface NavItem {
  id: SettingsPage | "logout";
  label: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  danger?: boolean;
}

const navSections: NavSection[] = [
  {
    label: "User Settings",
    items: [
      { id: "my-account", label: "My Account", icon: <User className="w-4 h-4" /> },
      { id: "content-social", label: "Content & Social", icon: <Globe className="w-4 h-4" /> },
      { id: "data-privacy", label: "Data & Privacy", icon: <Shield className="w-4 h-4" /> },
      { id: "family-center", label: "Family Center", icon: <Users className="w-4 h-4" /> },
      { id: "authorized-apps", label: "Authorized Apps", icon: <Cpu className="w-4 h-4" /> },
      { id: "devices", label: "Devices", icon: <Cpu className="w-4 h-4" /> },
      { id: "connections", label: "Connections", icon: <Link2 className="w-4 h-4" /> },
      { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    ],
  },
  {
    label: "Billing Settings",
    items: [
      { id: "nitro", label: "Nitro", icon: <Zap className="w-4 h-4" /> },
      { id: "server-boost", label: "Server Boost", icon: <Rocket className="w-4 h-4" /> },
      { id: "subscriptions", label: "Subscriptions", icon: <CreditCard className="w-4 h-4" /> },
      { id: "gift-inventory", label: "Gift Inventory", icon: <Gift className="w-4 h-4" /> },
      { id: "billing", label: "Billing", icon: <CreditCard className="w-4 h-4" /> },
    ],
  },
  {
    label: "App Settings",
    items: [
      { id: "appearance", label: "Appearance", icon: <Palette className="w-4 h-4" /> },
      { id: "accessibility", label: "Accessibility", icon: <Accessibility className="w-4 h-4" /> },
      { id: "voice-video", label: "Voice & Video", icon: <Mic className="w-4 h-4" /> },
      {
        id: "chat",
        label: "Chat",
        icon: <MessageSquare className="w-4 h-4" />,
        badge: (
          <span className="ml-auto bg-[#eb459e] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
            NEW
          </span>
        ),
      },
      { id: "keybinds", label: "Keybinds", icon: <Keyboard className="w-4 h-4" /> },
      { id: "language-time", label: "Language & Time", icon: <Clock className="w-4 h-4" /> },
      { id: "streamer-mode", label: "Streamer Mode", icon: <Tv className="w-4 h-4" /> },
      { id: "advanced", label: "Advanced", icon: <MoreHorizontal className="w-4 h-4" /> },
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

function Badge({ icon }: { icon: string }) {
  return (
    <span className="text-[16px]" title="Badge">
      {icon}
    </span>
  );
}

function MyAccountPage() {
  const [activeTab, setActiveTab] = useState<"security" | "standing">("security");
  const [showEmail, setShowEmail] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto discord-scrollbar px-10 py-8 max-w-[740px]">
      <h2 className="text-[20px] font-bold text-[#f2f3f5] mb-6">My Account</h2>

      {/* Tabs */}
      <div className="flex items-end gap-0 border-b mb-6" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <TabBtn label="Security" isActive={activeTab === "security"} onClick={() => setActiveTab("security")} />
        <TabBtn label="Standing" isActive={activeTab === "standing"} onClick={() => setActiveTab("standing")} />
      </div>

      {activeTab === "security" ? (
        <div className="space-y-0">
          {/* Profile card */}
          <div className="rounded-lg overflow-hidden mb-4" style={{ backgroundColor: "#1e1f22" }}>
            {/* Banner */}
            <div
              className="h-[100px] relative"
              style={{ background: "linear-gradient(135deg, #23272a 0%, #2c2f33 100%)" }}
            />
            {/* Avatar + name row */}
            <div className="px-4 pb-4">
              <div className="flex items-end justify-between -mt-8 mb-3">
                <div className="relative">
                  <div
                    className="w-[80px] h-[80px] rounded-full flex items-center justify-center text-[28px] font-bold text-white border-[6px]"
                    style={{
                      backgroundColor: currentUser.avatarColor,
                      borderColor: "#1e1f22",
                    }}
                  >
                    {currentUser.initials}
                  </div>
                  {/* online indicator */}
                  <div
                    className="absolute bottom-1 right-1 w-[18px] h-[18px] rounded-full border-[3px]"
                    style={{ backgroundColor: "#23a55a", borderColor: "#1e1f22" }}
                  />
                </div>
                <button
                  className="px-4 py-[7px] rounded-[3px] text-[14px] font-medium text-white transition-all hover:brightness-110"
                  style={{ backgroundColor: "#5865f2" }}
                >
                  Edit User Profile
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[20px] font-bold text-[#f2f3f5]">{currentUser.name}</span>
                <span className="text-[#949ba4] text-[16px]">···</span>
              </div>
              {/* Badges */}
              <div className="flex items-center gap-1 mt-1">
                <Badge icon="🔵" />
                <Badge icon="🔺" />
                <Badge icon="⭕" />
                <Badge icon="💠" />
              </div>
            </div>
          </div>

          {/* Account fields */}
          <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "#1e1f22" }}>
            <AccountField
              label="Display Name"
              value={currentUser.name}
              onEdit={() => {}}
            />
            <div className="h-px mx-4" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
            <AccountField
              label="Username"
              value={currentUser.username}
              onEdit={() => {}}
            />
            <div className="h-px mx-4" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
            <AccountField
              label="Email"
              value={
                <div className="flex items-center gap-2">
                  <span>{showEmail ? "velvetsky@gmail.com" : "••••••••••••@gmail.com"}</span>
                  <button
                    className="text-[#00b0f4] text-[13px] font-medium hover:underline"
                    onClick={() => setShowEmail(!showEmail)}
                  >
                    {showEmail ? "Hide" : "Reveal"}
                  </button>
                </div>
              }
              onEdit={() => {}}
            />
            <div className="h-px mx-4" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
            <AccountField
              label="Phone Number"
              value="You haven't added a phone number yet."
              onEdit={() => {}}
              editLabel="Add"
            />
          </div>
        </div>
      ) : (
        <StandingPage />
      )}
    </div>
  );
}

function AccountField({
  label,
  value,
  onEdit,
  editLabel = "Edit",
}: {
  label: string;
  value: React.ReactNode;
  onEdit: () => void;
  editLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-4 group">
      <div>
        <div className="text-[12px] font-bold text-[#b5bac1] uppercase tracking-wide mb-1">{label}</div>
        <div className="text-[15px] text-[#dbdee1]">{value}</div>
      </div>
      <button
        onClick={onEdit}
        className="px-4 py-[6px] rounded-[3px] text-[14px] font-medium text-[#dbdee1] hover:bg-white/10 transition-colors shrink-0"
        style={{ backgroundColor: "#313338", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        {editLabel}
      </button>
    </div>
  );
}

function StandingPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#23a55a22" }}>
        <span className="text-4xl">✅</span>
      </div>
      <h3 className="text-[20px] font-bold text-[#f2f3f5] mb-2">Your account is in good standing!</h3>
      <p className="text-[#949ba4] text-[15px] max-w-xs">
        You have no active restrictions, warnings, or bans applied to your account.
      </p>
    </div>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex-1 overflow-y-auto discord-scrollbar px-10 py-8 max-w-[740px]">
      <h2 className="text-[20px] font-bold text-[#f2f3f5] mb-6">{title}</h2>
      <div
        className="rounded-lg p-6 flex flex-col items-center justify-center py-16 text-center"
        style={{ backgroundColor: "#1e1f22" }}
      >
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#313338" }}>
          <Palette className="w-7 h-7 text-[#949ba4]" />
        </div>
        <p className="text-[#949ba4] text-[15px]">This settings page is a preview and has no interactive content.</p>
      </div>
    </div>
  );
}

function TabBtn({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-1 pb-3 mr-6 text-[15px] font-medium transition-colors",
        isActive
          ? "text-[#f2f3f5] border-b-2 border-white"
          : "text-[#949ba4] hover:text-[#dbdee1]"
      )}
    >
      {label}
    </button>
  );
}

const pageTitles: Record<string, string> = {
  "content-social": "Content & Social",
  "data-privacy": "Data & Privacy",
  "family-center": "Family Center",
  "authorized-apps": "Authorized Apps",
  "devices": "Devices",
  "connections": "Connections",
  "notifications": "Notifications",
  "nitro": "Nitro",
  "server-boost": "Server Boost",
  "subscriptions": "Subscriptions",
  "gift-inventory": "Gift Inventory",
  "billing": "Billing",
  "appearance": "Appearance",
  "accessibility": "Accessibility",
  "voice-video": "Voice & Video",
  "chat": "Chat",
  "keybinds": "Keybinds",
  "language-time": "Language & Time",
  "streamer-mode": "Streamer Mode",
  "advanced": "Advanced",
  "activity-privacy": "Activity Privacy",
};

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [activePage, setActivePage] = useState<SettingsPage>("my-account");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex"
      style={{ backgroundColor: "#313338" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Left sidebar */}
      <div
        className="w-[232px] h-full flex flex-col items-end shrink-0 pr-2 py-[60px] overflow-y-auto discord-scrollbar"
        style={{ backgroundColor: "#2b2d31", minWidth: 180 }}
      >
        <div className="w-[192px]">
          {/* User header */}
          <div className="px-2 pb-4">
            <div className="flex items-center gap-3 mb-1">
              <Avatar
                initials={currentUser.initials}
                color={currentUser.avatarColor}
                status={currentUser.status}
                size="sm"
                statusBg="#2b2d31"
              />
              <div>
                <div className="text-[14px] font-bold text-[#f2f3f5] leading-tight">{currentUser.name}</div>
                <button className="text-[12px] text-[#949ba4] hover:text-[#dbdee1] transition-colors flex items-center gap-1">
                  Edit Profiles <Pencil className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Search */}
          <div
            className="flex items-center gap-2 px-2 py-[6px] rounded-[4px] mb-4"
            style={{ backgroundColor: "#1e1f22" }}
          >
            <Search className="w-3.5 h-3.5 text-[#949ba4] shrink-0" />
            <input
              className="flex-1 bg-transparent text-[13px] text-[#f2f3f5] placeholder:text-[#949ba4] outline-none"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Nav sections */}
          {navSections.map((section, si) => (
            <div key={si} className="mb-1">
              {section.label && (
                <div className="px-2 py-1.5 text-[11px] font-bold text-[#949ba4] uppercase tracking-wider">
                  {section.label}
                </div>
              )}
              {section.items
                .filter((item) =>
                  search === "" || item.label.toLowerCase().includes(search.toLowerCase())
                )
                .map((item) =>
                  item.id === "logout" ? (
                    <button
                      key={item.id}
                      onClick={onClose}
                      className="w-full flex items-center gap-2 px-2 py-[7px] rounded-[4px] transition-colors text-[#ed4245] hover:bg-[#ed424520] hover:text-[#ed4245]"
                    >
                      <span className="shrink-0">{item.icon}</span>
                      <span className="text-[15px] font-medium">{item.label}</span>
                    </button>
                  ) : (
                    <button
                      key={item.id}
                      onClick={() => setActivePage(item.id as SettingsPage)}
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-[7px] rounded-[4px] transition-colors",
                        activePage === item.id
                          ? "bg-[#404249] text-[#f2f3f5]"
                          : "text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]"
                      )}
                    >
                      <span className="shrink-0">{item.icon}</span>
                      <span className="text-[15px] font-medium flex-1 text-left">{item.label}</span>
                      {item.badge}
                    </button>
                  )
                )}
              {si < navSections.length - 1 && (
                <div className="my-2 mx-2 h-px" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
              )}
            </div>
          ))}

          {/* Version footer */}
          <div className="mt-4 px-2">
            <div className="text-[11px] text-[#949ba4] leading-relaxed">
              stable 511379 (2376a86)
            </div>
            <div className="flex items-center gap-1 flex-wrap mt-1">
              <button className="text-[11px] text-[#00b0f4] hover:underline">Privacy Policy</button>
              <span className="text-[#949ba4] text-[11px]">•</span>
              <button className="text-[11px] text-[#00b0f4] hover:underline">Terms of Service</button>
              <span className="text-[#949ba4] text-[11px]">•</span>
              <button className="text-[11px] text-[#00b0f4] hover:underline">More</button>
            </div>
          </div>
        </div>
      </div>

      {/* Right content */}
      <div className="flex-1 h-full flex overflow-hidden" style={{ backgroundColor: "#313338" }}>
        {activePage === "my-account" ? (
          <MyAccountPage />
        ) : (
          <PlaceholderPage title={pageTitles[activePage] ?? activePage} />
        )}

        {/* Close button */}
        <div className="pt-[60px] px-6 shrink-0">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
            style={{ border: "2px solid #4e5058" }}
            title="Close (Esc)"
          >
            <X className="w-5 h-5 text-[#b5bac1]" />
          </button>
          <div className="text-[11px] text-[#4e5058] text-center mt-1 font-medium">ESC</div>
        </div>
      </div>
    </div>
  );
}
