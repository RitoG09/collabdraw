import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen w-screen flex items-center justify-center flex-col gap-4 bg-gradient-to-br from-red-100 via-yellow-100 to-red-200">
      <Image
        src="/404-err.jpg"
        alt="page not found"
        height={550}
        width={650}
        className=" border-4 rounded-md border-b-red-800 border-t-red-800 border-l-red-800 border-r-red-800"
      />
      <Button variant={"ghost"} size="lg">
        <Link href="/" className="text-red-800">
          Return back to Home
        </Link>
      </Button>
    </div>
  );
}
