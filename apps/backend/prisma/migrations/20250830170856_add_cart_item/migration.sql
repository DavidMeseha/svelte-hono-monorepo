/*
  Warnings:

  - A unique constraint covering the columns `[se_name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `se_name` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."categories" ADD COLUMN     "se_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "categories_se_name_key" ON "public"."categories"("se_name");

-- AddForeignKey
ALTER TABLE "public"."cart_items" ADD CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
