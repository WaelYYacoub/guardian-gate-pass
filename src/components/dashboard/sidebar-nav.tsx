"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function SidebarNav() {
  const { user } = useAuth();

  return (
    <aside className="w-64 border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <p className="text-sm text-muted-foreground">
          Welcome, {user?.fullName ?? "User"}
        </p>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        <Link href="/verifier" className="block p-2 hover:bg-muted rounded">Verifier</Link>
        <Link href="/admin/dashboard" className="block p-2 hover:bg-muted rounded">Dashboard</Link>
        <Link href="/admin/dashboard/statistics" className="block p-2 hover:bg-muted rounded">Statistics</Link>
      </nav>
    </aside>
  );
}
