"use client";

import { useAuth } from "@/hooks/use-auth";
import type { Role } from "@/types";

interface Props {
  allowed: Role[];
  children: React.ReactNode;
}

export default function RoleGate({ allowed, children }: Props) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6 text-center">Checking role...</div>;
  if (!user || !allowed.includes(user.role)) return <div className="p-6 text-center text-red-500">Access Denied</div>;

  return <>{children}</>;
}
