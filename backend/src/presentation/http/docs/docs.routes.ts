import { Hono } from "hono";
import { swaggerRouter } from "./swagger";
import { scalarRouter } from "./scalar";
import { getOpenAPIDocument } from "./openapi";
import type { AppEnv } from "@/utils/context";

const docsRouter = new Hono<{ Variables: AppEnv }>();

docsRouter.get("/openapi.json", (c) => {
	return c.json(getOpenAPIDocument());
});

docsRouter.route("/", swaggerRouter);
docsRouter.route("/", scalarRouter);

export { docsRouter };
