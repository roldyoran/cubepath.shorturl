import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "@/db";

export async function runMigrations(): Promise<void> {
	console.log("[INIT] Running database migrations...");

	try {
		await migrate(db, { migrationsFolder: "./drizzle" });
		console.log("[INIT] Database migrations completed successfully");
	} catch (error) {
		console.error("[INIT] Database migration failed:", error);
		throw error;
	}
}
