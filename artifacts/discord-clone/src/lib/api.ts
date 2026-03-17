const API_BASE = "/api";

export interface ToolSettings {
  toolId: number;
  autoJoin: boolean;
  smartMention: boolean;
  dmMode: boolean;
  delay: number;
  servers: string[];
  messages: string[];
}

export async function getToolSettings(toolId: number): Promise<ToolSettings> {
  const res = await fetch(`${API_BASE}/tool-settings/${toolId}`);
  if (!res.ok) throw new Error("Failed to load settings");
  return res.json();
}

export async function saveToolSettings(settings: ToolSettings): Promise<void> {
  const res = await fetch(`${API_BASE}/tool-settings/${settings.toolId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error("Failed to save settings");
}
