"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { Pass } from "@/types";

export default function PassesByLocationChart({ passes }: { passes: Pass[] }) {
  const grouped: Record<string, number> = {};
  passes.forEach((p) => {
    const loc = (p as any).location || "Unknown";
    grouped[loc] = (grouped[loc] || 0) + 1;
  });

  const data = Object.keys(grouped).map(k => ({ location: k, count: grouped[k] }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="location" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#60a5fa" />
      </BarChart>
    </ResponsiveContainer>
  );
}
