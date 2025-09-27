// src/components/charts/passes-status-pie-chart.tsx
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { Pass } from "@/types";

type Props = { passes: Pass[] };

export default function PassesStatusPieChart({ passes }: Props) {
  const data = [
    { name: "Active", value: passes.filter((p) => p.status === "active").length },
    { name: "Expired", value: passes.filter((p) => p.status === "expired").length },
    { name: "Revoked", value: passes.filter((p) => p.status === "revoked").length },
  ];

  const COLORS = ["#22c55e", "#f97316", "#ef4444"];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={80}
          label
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
