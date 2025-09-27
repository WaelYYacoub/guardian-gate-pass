"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import type { UserRole } from "@/types";

export default function AuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return null;

  if (!user) {
    router.push("/login");
    return null;
  }

  // ✅ If you want role-based restriction:
  // if (user.role !== "admin") router.push("/verifier");

  return <>{children}</>;
}
