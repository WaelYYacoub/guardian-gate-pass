"use client";

import { Pie, PieChart, Tooltip } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo, useState } from "react";
import { CardDescription } from "../ui/card";
import { useData } from "@/context/data-provider";

export function PassesStatusPieChart() {
  const { passes, loading } = useData();
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const chartData = useMemo(() => {
    if (!passes.length) return [];
    const counts = passes.reduce(
      (acc, pass) => {
        acc[pass.status] = (acc[pass.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return [
      { name: "Active", value: counts.active || 0, fill: "hsl(var(--chart-1))" },
      { name: "Expired", value: counts.expired || 0, fill: "hsl(var(--chart-2))" },
      { name: "Revoked", value: counts.revoked || 0, fill: "hsl(var(--chart-3))" },
    ].filter((item) => item.value > 0);
  }, [passes]);

  const totalPasses = useMemo(() => passes.length, [passes]);

  if (loading) {
    return (
      <div className="h-[250px] w-full flex items-center justify-center text-muted-foreground">
        Loading chart data...
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="h-[250px] w-full flex items-center justify-center text-muted-foreground">
        No pass data available.
      </div>
    );
  }

  return (
    <>
      <CardDescription>
        Total of {totalPasses} passes in the system
      </CardDescription>
      <ChartContainer config={{}} className="h-[250px] w-full">
        <PieChart>
          <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            strokeWidth={5}
            // 👇 cast to any to bypass wrong type defs in Recharts v3
            activeIndex={activeIndex as any}
            activeShape={{
              // simple highlight on hover
              outerRadius: 70,
            } as any}
            onMouseEnter={(_, idx) => setActiveIndex(idx)}
            onMouseLeave={() => setActiveIndex(undefined)}
          />
        </PieChart>
      </ChartContainer>
    </>
  );
}
