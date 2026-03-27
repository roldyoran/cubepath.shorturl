import type { MiddlewareHandler } from "hono";

export type AppEnv = {
	SERVICE_ADMIN_API_KEY: string;
};

export const checkEnvMiddleware: MiddlewareHandler<{
	Variables: AppEnv;
}> = async (c, next) => {
	c.set("SERVICE_ADMIN_API_KEY", process.env.SERVICE_ADMIN_API_KEY ?? "");
	await next();
};
