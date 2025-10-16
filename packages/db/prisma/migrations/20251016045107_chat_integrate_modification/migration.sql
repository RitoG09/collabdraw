-- DropForeignKey
ALTER TABLE "public"."Chat" DROP CONSTRAINT "Chat_roomId_fkey";

-- AlterTable
ALTER TABLE "public"."Chat" ALTER COLUMN "roomId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "public"."Chat" ADD CONSTRAINT "Chat_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("linkId") ON DELETE RESTRICT ON UPDATE CASCADE;
