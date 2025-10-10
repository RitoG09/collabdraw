import { usePathname } from "next/navigation";

export default function useSession() {
  const pathname = usePathname();
  const match = pathname.match(/^\/canvas\/room\/([^/]+)\/?$/);

  if (match) {
    return {
      mode: "collaboration" as const,
      roomId: match[1],
    };
  }

  return {
    mode: "solo" as const,
    roomId: null,
  };
}
