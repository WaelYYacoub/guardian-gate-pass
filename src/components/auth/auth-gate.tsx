import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
// ⬇️ change this
import type { UserRole } from "@/types";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return null;
  if (!user) {
    router.push("/login");
    return null;
  }

  // Optional: role-based redirect
  const role = user.role as UserRole;
  if (role === "pending" || role === "rejected") {
    router.push("/unauthorized");
    return null;
  }

  return <>{children}</>;
}
