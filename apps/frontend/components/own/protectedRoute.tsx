"use client";

import React, { useEffect } from "react";
import useProtection from "../../hooks/useProtection";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { verified } = useProtection();

  useEffect(() => {
    if (verified === false) {
      router.push("/signin");
      console.log("signin route here");
      return;
    }
  }, [verified, router]);
  if (verified === null) return null;

  return <>{children}</>;
}
