import { Product } from "@prisma/client";
import { db } from "./db.js";

export async function createProduct(props: Partial<Product>) {
  const newProduct = await db.product.create({
    data: {
      image: props.image ?? "",
      name: props.name ?? "",
      price: props.price ?? 10.1,
      seName: props.seName ?? "",
    },
  });

  return newProduct;
}
