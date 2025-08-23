import { Prisma } from "@prisma/client";
import { db } from "./db.js";

class ProductsRepository {
  public async filterProducts(queries: {
    limit: number;
    page: number;
    sort?: "name" | "price" | "-name" | "-price";
    maxPrice: number;
    minPrice: number;
    category?: string;
    search: string;
  }) {
    const where: Prisma.ProductWhereInput = {};
    const orderBy: Prisma.ProductOrderByWithAggregationInput = {};
    // if (queries.category) {
    //   where.category = queries.category;
    // }

    if (queries.sort) {
      const direction = queries.sort.includes("-") ? "asc" : "desc";
      const sort = queries.sort.replace("-", "") as "name" | "price";
      orderBy[sort] = direction;
    }

    where.price = {};
    where.price.gte = queries.minPrice;
    where.price.lte = queries.maxPrice;

    return await db.product.findMany({
      skip: queries.limit * (queries.page - 1),
      where: {
        ...where,
        OR: [
          { name: { contains: queries.search, mode: "insensitive" } },
          { description: { contains: queries.search, mode: "insensitive" } },
        ],
      },
      orderBy,
    });
  }

  public async bySeName(seName: string) {
    return await db.product.findFirst({
      where: {
        seName: seName,
      },
    });
  }
}

const productsRepository = new ProductsRepository();
export default productsRepository;
