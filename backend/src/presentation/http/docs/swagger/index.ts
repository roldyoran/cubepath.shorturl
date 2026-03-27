import { Hono } from "hono";
import { swaggerUI } from "@hono/swagger-ui";
import type { AppEnv } from "@/utils/context";

const swaggerRouter = new Hono<{ Variables: AppEnv }>();

swaggerRouter.get("/docs", swaggerUI({ url: "/openapi.json" }));
swaggerRouter.get("/swagger", swaggerUI({ url: "/openapi.json" }));

export { swaggerRouter };
