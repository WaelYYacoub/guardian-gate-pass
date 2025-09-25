"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import type { UserRole } from "@/types";

/**
 * ✅ AuthGate
 * - Redirects to /login if user is not logged in
 * - Redirects to /login?pending=1 if user is pending or rejected
 */
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, role, loading } = useAuth(); // adjust to your hook's return values

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (role === "pending" || role === "rejected") {
        router.replace("/login?pending=1");
      }
    }
  }, [user, role, loading, router]);

  if (loading) return null; // or spinner

  return <>{children}</>;
}
