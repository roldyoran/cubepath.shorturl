import { Hono } from "hono";
import { Scalar } from "@scalar/hono-api-reference";
import type { AppEnv } from "@/utils/context";

const scalarRouter = new Hono<{ Variables: AppEnv }>();

scalarRouter.get("/scalar", Scalar({ url: "/openapi.json" }));

export { scalarRouter };
