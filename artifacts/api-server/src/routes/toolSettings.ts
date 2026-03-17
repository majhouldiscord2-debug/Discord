import { Router } from "express";
import { db, toolSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const DEFAULT_SETTINGS = {
  autoJoin: true,
  smartMention: true,
  dmMode: false,
  delay: 3,
  servers: ["Chill Zone", "Gaming HQ"],
  messages: ["Hey! Check this out 👋", "Join us for some fun!"],
};

router.get("/tool-settings/:toolId", async (req, res) => {
  const toolId = parseInt(req.params.toolId, 10);
  if (isNaN(toolId)) {
    return res.status(400).json({ error: "Invalid toolId" });
  }

  const rows = await db
    .select()
    .from(toolSettingsTable)
    .where(eq(toolSettingsTable.toolId, toolId));

  if (rows.length === 0) {
    return res.json({ toolId, ...DEFAULT_SETTINGS });
  }

  const row = rows[0];
  return res.json({
    toolId: row.toolId,
    autoJoin: row.autoJoin,
    smartMention: row.smartMention,
    dmMode: row.dmMode,
    delay: row.delay,
    servers: row.servers,
    messages: row.messages,
  });
});

router.put("/tool-settings/:toolId", async (req, res) => {
  const toolId = parseInt(req.params.toolId, 10);
  if (isNaN(toolId)) {
    return res.status(400).json({ error: "Invalid toolId" });
  }

  const { autoJoin, smartMention, dmMode, delay, servers, messages } = req.body;

  await db
    .insert(toolSettingsTable)
    .values({
      toolId,
      autoJoin: autoJoin ?? DEFAULT_SETTINGS.autoJoin,
      smartMention: smartMention ?? DEFAULT_SETTINGS.smartMention,
      dmMode: dmMode ?? DEFAULT_SETTINGS.dmMode,
      delay: delay ?? DEFAULT_SETTINGS.delay,
      servers: servers ?? DEFAULT_SETTINGS.servers,
      messages: messages ?? DEFAULT_SETTINGS.messages,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: toolSettingsTable.toolId,
      set: {
        autoJoin: autoJoin ?? DEFAULT_SETTINGS.autoJoin,
        smartMention: smartMention ?? DEFAULT_SETTINGS.smartMention,
        dmMode: dmMode ?? DEFAULT_SETTINGS.dmMode,
        delay: delay ?? DEFAULT_SETTINGS.delay,
        servers: servers ?? DEFAULT_SETTINGS.servers,
        messages: messages ?? DEFAULT_SETTINGS.messages,
        updatedAt: new Date(),
      },
    });

  return res.json({ success: true });
});

export default router;
