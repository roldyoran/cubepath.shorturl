import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const urlsTable = pgTable("urls", {
	id: serial("id").primaryKey(),
	originalUrl: text("original_url").notNull(),
	shortCode: text("short_code").notNull().unique(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	visits: integer("visits").notNull().default(0),
});

export type InsertUrl = typeof urlsTable.$inferInsert;
export type SelectUrl = typeof urlsTable.$inferSelect;
