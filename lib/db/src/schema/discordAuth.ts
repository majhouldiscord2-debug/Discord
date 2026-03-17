import { pgTable, integer, text, timestamp } from "drizzle-orm/pg-core";

export const discordAuthTable = pgTable("discord_auth", {
  id: integer("id").primaryKey().default(1),
  token: text("token").notNull(),
  tokenType: text("token_type").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type DiscordAuth = typeof discordAuthTable.$inferSelect;
