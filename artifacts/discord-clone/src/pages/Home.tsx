import { useState, useRef } from "react";
import DiscordHome from "@/discord/Home";
import BotHome from "@/bot/Home";
import ProfileSwitchAnimation from "@/components/ProfileSwitchAnimation";

export default function Home() {
  const [isBotMode, setIsBotMode] = useState(false);
  const [switching, setSwitching] = useState(false);
  const pendingRef = useRef<boolean | null>(null);
  const switchingRef = useRef(false);

  function triggerSwitch(nextBot: boolean) {
    if (switchingRef.current) return;
    switchingRef.current = true;
    pendingRef.current = nextBot;
    setSwitching(true);
  }

  // Called mid-animation: swap the underlying dashboard while overlay is still visible
  function handleSwitch() {
    const next = pendingRef.current;
    pendingRef.current = null;
    if (next !== null) setIsBotMode(next);
  }

  // Called when the animation fully fades out: remove the overlay
  function handleComplete() {
    switchingRef.current = false;
    setSwitching(false);
  }

  return (
    <>
      {switching && (
        <ProfileSwitchAnimation
          key={String(isBotMode)}
          targetMode={pendingRef.current !== null ? (pendingRef.current ? "bot" : "discord") : (isBotMode ? "bot" : "discord")}
          onSwitch={handleSwitch}
          onComplete={handleComplete}
        />
      )}

      {isBotMode
        ? <BotHome onSwitchMode={() => triggerSwitch(false)} />
        : <DiscordHome onSwitchMode={() => triggerSwitch(true)} />
      }
    </>
  );
}
