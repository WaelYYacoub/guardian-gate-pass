"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { Pass } from "@/types";

export default function PassesByCompanyChart({ passes }: { passes: Pass[] }) {
  const grouped: Record<string, number> = {};
  passes.forEach((p) => {
    const comp = (p as any).ownerCompany || (p as any).visitorCompany || "Unknown";
    grouped[comp] = (grouped[comp] || 0) + 1;
  });

  const data = Object.keys(grouped).map(k => ({ company: k, count: grouped[k] }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="company" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#34d399" />
      </BarChart>
    </ResponsiveContainer>
  );
}
