-- DropForeignKey
ALTER TABLE "table_reservations" DROP CONSTRAINT "table_reservations_userId_fkey";

-- AlterTable
ALTER TABLE "table_reservations" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "table_reservations" ADD CONSTRAINT "table_reservations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
