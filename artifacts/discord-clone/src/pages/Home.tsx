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

  function handleComplete() {
    const next = pendingRef.current;
    pendingRef.current = null;
    switchingRef.current = false;
    if (next !== null) setIsBotMode(next);
    setSwitching(false);
  }

  return (
    <>
      {switching && (
        <ProfileSwitchAnimation
          key={String(isBotMode)}
          targetMode={pendingRef.current ? "bot" : "discord"}
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
