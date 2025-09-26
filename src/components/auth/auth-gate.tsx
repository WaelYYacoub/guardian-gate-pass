"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import type { Role } from "@/types";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (user.role === "pending" || user.role === "rejected") {
        router.replace("/login?pending=1");
      }
    }
  }, [user, loading, router]);

  if (loading) return <div className="p-6 text-center">Checking access...</div>;
  return <>{children}</>;
}
