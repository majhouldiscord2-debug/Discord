import { useState } from "react";
import DiscordHome from "@/discord/Home";
import BotHome from "@/bot/Home";

export default function Home() {
  const [isBotMode, setIsBotMode] = useState(false);

  return isBotMode
    ? <BotHome onSwitchMode={() => setIsBotMode(false)} />
    : <DiscordHome onSwitchMode={() => setIsBotMode(true)} />;
}
