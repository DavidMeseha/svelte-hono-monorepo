import { Product } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export const products: Partial<Product>[] = [
  {
    name: "iPhone 15 Pro",
    description: "6.1-inch Super Retina XDR display, A17 Pro chip",
    price: 999.01 as unknown as Decimal,
    seName: "iPhone-15-Pro",
    stock: 50,
    image: "http://localhost:3000/images/Laotio_100_xd.webp",
  },
  {
    name: "Sony WH-1000XM5",
    description: "Noise-cancelling wireless headphones",
    price: 399.99 as unknown as Decimal,
    seName: "SONY-WH-1000XM5",
    stock: 30,
    image: "http://localhost:3000/images/no_image_placeholder.jpg",
  },
];
