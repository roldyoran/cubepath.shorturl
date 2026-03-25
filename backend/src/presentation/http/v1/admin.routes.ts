import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { DeleteAllUrlsUseCase } from "@/application/url/delete-all-urls.usecase";
import { DeleteUrlUseCase } from "@/application/url/delete-url.usecase";
import { db } from "@/db";
import { UnauthorizedError } from "@/domain/app-error";
import { validationHook } from "@/infrastructure/http/error-handler";
import { UrlRepository } from "@/infrastructure/persistence/url.repository.impl";
import type { AppEnv } from "@/utils/context";
import { shortCodeSchema } from "@/utils/schemas";

const adminRoutes = new Hono<{ Variables: AppEnv }>();

adminRoutes.use("/*", async (c, next) => {
	const authHeader = c.req.header("Authorization");
	const apiKey = c.get("SERVICE_ADMIN_API_KEY");

	if (!authHeader || authHeader !== `Bearer ${apiKey}`) {
		throw new UnauthorizedError();
	}

	await next();
});

adminRoutes.delete(
	"/urls/:shortCode",
	zValidator("param", shortCodeSchema, validationHook),
	async (c) => {
		const { shortCode } = c.req.valid("param");
		const repo = new UrlRepository(db);
		const useCase = new DeleteUrlUseCase(repo);
		const deleted = await useCase.execute(shortCode);
		return c.json(deleted);
	},
);

adminRoutes.delete("/urls", async (c) => {
	const repo = new UrlRepository(db);
	const useCase = new DeleteAllUrlsUseCase(repo);
	await useCase.execute();
	return c.json({ message: "Todas las URLs han sido eliminadas" });
});

export { adminRoutes };
