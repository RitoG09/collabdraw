
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { verifyUser } from "../api/auth";

export default function useProtection() {
  const router = useRouter();
  const [verified, setVerified] = useState<null | boolean>(null);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
  });
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setVerified(false);
      return;
    }

    const getUser = async () => {
      try {
        const response = await verifyUser(token);
        const { user } = response; //dest: user=response.user
        setUserData({
          username: user.username,
          email: user.email,
        });
        setVerified(true);
      } catch (error) {
        setVerified(false);
        router.push("/signin");
      }
    };

    getUser();
  }, [router]);
  return { verified, userData };
}
