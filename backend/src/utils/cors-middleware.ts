import type { Context, Next } from "hono";

export const corsMiddleware = (options?: {
	origin?: string | string[];
	methods?: string[];
	allowedHeaders?: string[];
	maxAge?: number;
}) => {
	return async (c: Context, next: Next): Promise<Response | void> => {
		const defaultOptions = {
			origin: "*",
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
			allowedHeaders: ["Content-Type", "Authorization"],
			maxAge: 86400,
		};

		const config = { ...defaultOptions, ...options };

		c.header(
			"Access-Control-Allow-Origin",
			Array.isArray(config.origin) ? config.origin.join(", ") : config.origin,
		);

		c.header("Access-Control-Allow-Methods", config.methods.join(", "));
		c.header("Access-Control-Allow-Headers", config.allowedHeaders.join(", "));
		c.header("Access-Control-Max-Age", config.maxAge.toString());

		if (config.origin !== "*") {
			c.header("Access-Control-Allow-Credentials", "true");
		}

		if (c.req.method === "OPTIONS") {
			c.status(204);
			return c.body(null);
		}

		await next();
	};
};
