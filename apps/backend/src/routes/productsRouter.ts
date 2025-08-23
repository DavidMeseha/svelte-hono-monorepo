import { Hono } from "hono";
import {
  getAllProducts,
  getProdutBySeName,
} from "../controllers/productsController.js";

const productsRouter = new Hono();

productsRouter.get("/", getAllProducts);
productsRouter.get("/:seName", getProdutBySeName);

export { productsRouter };
