import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { CreateUrlUseCase } from "@/application/url/create-url.usecase";
import { GetAllUrlsUseCase } from "@/application/url/get-all-urls.usecase";
import { GetUrlByShortCodeUseCase } from "@/application/url/get-url-by-shortcode.usecase";
import { db } from "@/db";
import { NotFoundError } from "@/domain/app-error";
import { validationHook } from "@/infrastructure/http/error-handler";
import { UrlRepository } from "@/infrastructure/persistence/url.repository.impl";
import { createUrlSchema, shortCodeSchema } from "@/utils/schemas";

const urlRoutes = new Hono();

urlRoutes.get("/", async (c) => {
	const repo = new UrlRepository(db);
	const useCase = new GetAllUrlsUseCase(repo);
	const urls = await useCase.execute();
	return c.json(urls);
});

urlRoutes.post(
	"/",
	zValidator("json", createUrlSchema, validationHook),
	async (c) => {
		const { originalUrl, shortCode } = c.req.valid("json");
		const repo = new UrlRepository(db);
		const useCase = new CreateUrlUseCase(repo);
		const created = await useCase.execute({ originalUrl, shortCode });
		return c.json(created, 201);
	},
);

urlRoutes.get(
	"/:shortCode",
	zValidator("param", shortCodeSchema, validationHook),
	async (c) => {
		const { shortCode } = c.req.valid("param");
		const repo = new UrlRepository(db);
		const useCase = new GetUrlByShortCodeUseCase(repo);
		const url = await useCase.execute(shortCode);
		if (!url) {
			throw new NotFoundError("URL no encontrada");
		}
		return c.json(url);
	},
);

export { urlRoutes };
