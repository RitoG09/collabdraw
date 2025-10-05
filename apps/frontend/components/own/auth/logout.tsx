import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@/components/ui/button";

export default function Logout() {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("token");
    useUserStore.getState().setUser({ username: "", email: "" });
    router.push("/signin");
  };

  return (
    <div>
      <Button
        onClick={handleLogout}
        className="group flex items-center gap-2.5 rounded-lg bg-neutral-700/60 px-3 py-2 text-base text-neutral-200 backdrop-blur-sm transition-all duration-200 hover:bg-rose-500 hover:text-white hover:cursor-pointer"
      >
        <span>Logout</span>
        <LogOut className="size-4 transition-transform duration-200 group-hover:scale-110" />
      </Button>
    </div>
  );
}
