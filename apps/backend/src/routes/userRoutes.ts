import { Hono } from "hono";
import { getUserDetails } from "../controllers/userController.js";

const productsRouter = new Hono();

productsRouter.get("/", getUserDetails);

export { productsRouter };
