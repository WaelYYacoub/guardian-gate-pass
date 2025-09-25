"use client";

import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import type { UserRole } from "@/types";

/**
 * ✅ RoleGate
 * - Only renders children if user role is included in `allow`
 */
interface RoleGateProps {
  allow: UserRole[];
  children: ReactNode;
  fallback?: ReactNode; // optional element if access denied
}

export default function RoleGate({ allow, children, fallback = null }: RoleGateProps) {
  const { role } = useAuth(); // adjust to your hook

  if (role && allow.includes(role)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
