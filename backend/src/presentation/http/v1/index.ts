import { Hono } from "hono";
import type { AppEnv } from "@/utils/context";
import { adminRoutes } from "./admin.routes";
import { urlRoutes } from "./url.routes";

const v1Router = new Hono<{ Variables: AppEnv }>();

v1Router.route("/urls", urlRoutes);
v1Router.route("/admin", adminRoutes);

export { v1Router };
