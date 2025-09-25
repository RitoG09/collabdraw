// import { dancingScript } from "@/app/layout";
import { cn } from "../../lib/utils";
import { Dancing_Script } from "next/font/google";
import Image from "next/image";

const dancingScript = Dancing_Script({
  weight: "700",
  subsets: ["latin"],
});

export const Logo = ({
  className,
  uniColor,
}: {
  className?: string;
  uniColor?: boolean;
}) => {
  return (
    <>
      <Image src="/logo.svg" alt="logo" height={50} width={30} />
      <text fontSize="50" fontWeight="600" fill="currentColor">
        Collab{" "}
        <tspan
          className={`${dancingScript.className} text-red-800 font-extrabold`}
          fontSize="25"
        >
          Draw
        </tspan>
      </text>
    </>
  );
};
