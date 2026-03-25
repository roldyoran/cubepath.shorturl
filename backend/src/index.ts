import { Hono } from "hono";
import { logger } from "hono/logger";
import { Scalar } from "@scalar/hono-api-reference";
import { startServer } from "@/infrastructure/bootstrap";
import { onError } from "@/infrastructure/http/error-handler";
import { redirectRoutes } from "@/presentation/http/redirect";
import { v1Router } from "@/presentation/http/v1";
import { getOpenAPIDocument } from "@/presentation/http/openapi";
import { checkEnvMiddleware, type AppEnv } from "@/utils/context";
import { corsMiddleware } from "@/utils/cors-middleware";

const PORT = parseInt(process.env.API_PORT ?? "5044", 10);

const app = new Hono<{ Variables: AppEnv }>();

app.use("*", checkEnvMiddleware);
app.use("*", corsMiddleware());
app.use(logger());

app.get("/", (c) => {
	return c.json({
		message: "Bienvenido al acortador de URLs creado por Roldyoran, este proyecto utiliza Hono, TypeScript y Bun, alojado en CubePath mediante una VPS nao. Gracias por visitarlo!",
		version: "1.0.0",
	});
});

app.get("/openapi.json", (c) => {
	return c.json(getOpenAPIDocument());
});

app.get("/scalar", Scalar({ url: "/openapi.json" }));
app.get("/docs", Scalar({ url: "/openapi.json" }));

app.route("/v1", v1Router);
app.route("/", redirectRoutes);

app.onError(onError);

startServer().then(() => {
	console.log(`[SERVER] Starting on http://localhost:${PORT}`);
});

export default {
	port: PORT,
	fetch: app.fetch,
};