import { useState, useRef } from "react";
import DiscordHome from "@/discord/Home";
import BotHome from "@/bot/Home";
import ProfileSwitchAnimation from "@/components/ProfileSwitchAnimation";

export default function Home() {
  const [isBotMode, setIsBotMode]   = useState(false);
  const [switching, setSwitching]   = useState(false);
  const pendingRef    = useRef<boolean | null>(null);
  const switchingRef  = useRef(false);
  const animTargetRef = useRef<"bot" | "discord">("discord");

  function triggerSwitch(nextBot: boolean) {
    if (switchingRef.current) return;
    switchingRef.current  = true;
    pendingRef.current    = nextBot;
    animTargetRef.current = nextBot ? "bot" : "discord";
    setSwitching(true);
  }

  // Fires at 65% through the animation — swaps the dashboard under the overlay
  function handleSwitch() {
    const next = pendingRef.current;
    pendingRef.current = null;
    if (next !== null) setIsBotMode(next);
  }

  // Fires at 100% — removes the overlay
  function handleComplete() {
    switchingRef.current = false;
    setSwitching(false);
  }

  return (
    <>
      {switching && (
        <ProfileSwitchAnimation
          targetMode={animTargetRef.current}
          onSwitch={handleSwitch}
          onComplete={handleComplete}
        />
      )}

      {isBotMode
        ? <BotHome    onSwitchMode={() => triggerSwitch(false)} />
        : <DiscordHome onSwitchMode={() => triggerSwitch(true)}  />
      }
    </>
  );
}
