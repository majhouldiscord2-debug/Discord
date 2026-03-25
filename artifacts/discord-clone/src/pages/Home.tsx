import { useState, useCallback } from "react";
import DiscordHome from "@/discord/Home";
import BotHome from "@/bot/Home";
import ProfileSwitchAnimation from "@/components/ProfileSwitchAnimation";

export default function Home() {
  const [isBotMode, setIsBotMode] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [pendingMode, setPendingMode] = useState<boolean | null>(null);

  const handleSwitchMode = useCallback((nextBot: boolean) => {
    if (switching) return;
    setPendingMode(nextBot);
    setSwitching(true);
  }, [switching]);

  const handleAnimationComplete = useCallback(() => {
    if (pendingMode !== null) setIsBotMode(pendingMode);
    setSwitching(false);
    setPendingMode(null);
  }, [pendingMode]);

  return (
    <>
      {switching && (
        <ProfileSwitchAnimation
          targetMode={pendingMode ? "bot" : "discord"}
          onComplete={handleAnimationComplete}
        />
      )}

      {isBotMode
        ? <BotHome onSwitchMode={() => handleSwitchMode(false)} />
        : <DiscordHome onSwitchMode={() => handleSwitchMode(true)} />
      }
    </>
  );
}
