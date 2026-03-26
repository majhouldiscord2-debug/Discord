import { pgTable, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const toolSettingsTable = pgTable("tool_settings", {
  toolId: integer("tool_id").primaryKey(),
  autoJoin: boolean("auto_join").notNull().default(true),
  smartMention: boolean("smart_mention").notNull().default(true),
  dmMode: boolean("dm_mode").notNull().default(false),
  delay: integer("delay").notNull().default(3),
  servers: jsonb("servers").notNull().default([]),
  messages: jsonb("messages").notNull().default([]),
  serverConfigs: jsonb("server_configs"),
  safeMode: boolean("safe_mode").notNull().default(false),
  quickWave: boolean("quick_wave").notNull().default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertToolSettingsSchema = createInsertSchema(toolSettingsTable);
export type InsertToolSettings = z.infer<typeof insertToolSettingsSchema>;
export type ToolSettings = typeof toolSettingsTable.$inferSelect;
