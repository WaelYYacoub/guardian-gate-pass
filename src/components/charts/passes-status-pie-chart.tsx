"use client";

import { Pie, PieChart, Tooltip } from "recharts";
import { useMemo, useState } from "react";
import { CardDescription } from "../ui/card";
import { useData } from "@/context/data-provider";

export default function PassesStatusPieChart() {
  const { passes, loading } = useData();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const chartData = useMemo(() => {
    if (!passes.length) return [];
    const counts = passes.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return [
      { name: "Active", value: counts.active || 0, fill: "hsl(var(--chart-1))" },
      { name: "Expired", value: counts.expired || 0, fill: "hsl(var(--chart-2))" },
      { name: "Revoked", value: counts.revoked || 0, fill: "hsl(var(--chart-3))" }
    ].filter(i => i.value > 0);
  }, [passes]);

  if (loading) return <div className="h-[250px] flex items-center justify-center">Loading chart...</div>;
  if (!chartData.length) return <div className="h-[250px] flex items-center justify-center">No data</div>;

  return (
    <>
      <CardDescription>Total of {passes.length} passes</CardDescription>
      <PieChart width={300} height={300}>
        <Tooltip />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={hoverIndex !== null ? 90 : 80}
          strokeWidth={5}
          onMouseEnter={(_, idx) => setHoverIndex(idx)}
          onMouseLeave={() => setHoverIndex(null)}
        />
      </PieChart>
    </>
  );
}
