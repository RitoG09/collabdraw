-- DropForeignKey
ALTER TABLE "public"."Shape" DROP CONSTRAINT "Shape_roomId_fkey";

-- AlterTable
ALTER TABLE "public"."Room" ALTER COLUMN "linkId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."Shape" ALTER COLUMN "roomId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "public"."Shape" ADD CONSTRAINT "Shape_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("linkId") ON DELETE RESTRICT ON UPDATE CASCADE;
