"use client";

import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import type { UserRole } from "@/types";

interface Props {
  allowed: UserRole[];
  children: ReactNode;
}

export default function RoleGate({ allowed, children }: Props) {
  const { user } = useAuth();

  // If no user, block content
  if (!user) return null;

  // ✅ Narrow type so TS knows role is UserRole
  const role = user.role as UserRole | undefined;

  if (!role || !allowed.includes(role)) return null;

  return <>{children}</>;
}
