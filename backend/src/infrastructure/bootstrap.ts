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

async function wait(ms: number) {
	return new Promise((r) => setTimeout(r, ms));
}

/**
 * startServer with retry/backoff for migrations
 */
export async function startServer() {
	const maxAttempts = 10;
	let attempt = 0;
	let delayMs = 1000; // 1s initial

	while (attempt < maxAttempts) {
		try {
			console.log(`[INIT] Attempt ${attempt + 1} to run database migrations...`);
			await runMigrations();
			console.log("[INIT] Database migrations completed successfully");
			return;
		} catch (error) {
			attempt++;
			console.error(`[INIT] Migration attempt ${attempt} failed:`, error?.message ?? error);
			if (attempt >= maxAttempts) {
				console.error("[INIT] Exceeded max migration attempts, exiting.");
				process.exit(1);
			}
			console.log(`[INIT] Waiting ${delayMs}ms before retrying...`);
			await wait(delayMs);
			// exponential backoff with a cap to avoid excessively long waits
			delayMs = Math.min(delayMs * 2, 30000);
		}
	}
}
