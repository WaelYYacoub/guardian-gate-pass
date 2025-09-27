"use client";

import { useAuth } from "@/hooks/use-auth";
import type { UserRole } from "@/types";

interface Props {
  allowed: UserRole[];
  children: React.ReactNode;
}

export default function RoleGate({ allowed, children }: Props) {
  const { user } = useAuth();

  if (!user) return null;
  if (!allowed.includes(user.role)) return null;

  return <>{children}</>;
}
