import { Hono } from "hono";
import { productsRouter } from "./productsRouter.js";

const routes = new Hono();
routes.route("/products", productsRouter);

export { routes };
