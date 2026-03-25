import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { RedirectUrlUseCase } from "@/application/url/redirect-url.usecase";
import { db } from "@/db";
import { NotFoundError } from "@/domain/app-error";
import { validationHook } from "@/infrastructure/http/error-handler";
import { UrlRepository } from "@/infrastructure/persistence/url.repository.impl";
import { shortCodeSchema } from "@/utils/schemas";

const redirectRoutes = new Hono();

redirectRoutes.get(
	"/:shortCode",
	zValidator("param", shortCodeSchema, validationHook),
	async (c) => {
		const { shortCode } = c.req.valid("param");
		const repo = new UrlRepository(db);
		const useCase = new RedirectUrlUseCase(repo);
		const url = await useCase.execute(shortCode);
		if (!url) {
			throw new NotFoundError(
				`No existe una URL para el código "${shortCode}"`,
			);
		}
		return c.redirect(url.originalUrl, 302);
	},
);

export { redirectRoutes };
