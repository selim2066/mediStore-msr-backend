/*
  Warnings:

  - A unique constraint covering the columns `[orderId,medicineId]` on the table `order_items` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_orderId_fkey";

-- DropIndex
DROP INDEX "order_items_orderId_medicineId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "order_items_orderId_medicineId_key" ON "order_items"("orderId", "medicineId");

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
