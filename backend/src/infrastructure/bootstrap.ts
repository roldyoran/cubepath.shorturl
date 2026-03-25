import { runMigrations } from "@/infrastructure/database/init-db";

const requiredEnvVars = ["DATABASE_URL", "SERVICE_ADMIN_API_KEY", "API_PORT"];

function checkEnvVars() {
	const missingVars: string[] = [];

	for (const key of requiredEnvVars) {
		if (!process.env[key]) {
			missingVars.push(key);
		}
	}

	if (missingVars.length > 0) {
		console.error(`[ENV] Variables de entorno faltantes: ${missingVars.join(", ")}`);
		process.exit(1);
	}

	console.log("[ENV] All environment variables loaded successfully");
}

checkEnvVars();

export async function startServer() {
	try {
		await runMigrations();
	} catch (error) {
		console.error("[INIT] Failed to run migrations:", error);
		process.exit(1);
	}
}
