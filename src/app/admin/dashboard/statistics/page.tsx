"use client";

import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import PassesByMonthChart from "@/components/charts/passes-by-month-chart";
import PassesStatusPieChart from "@/components/charts/passes-status-pie-chart";
import PassesByLocationChart from "@/components/charts/passes-by-location-chart";
import PassesByCompanyChart from "@/components/charts/passes-by-company-chart";

import { getPasses } from "@/lib/firestore";
import type { BasePass } from "@/types"; // ✅ use the union type we actually have

export default async function StatisticsPage() {
  const passes: BasePass[] = await getPasses();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Pass Statistics</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Passes Created per Month</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Suspense fallback={<p>Loading chart...</p>}>
              <PassesByMonthChart passes={passes} />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pass Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Suspense fallback={<p>Loading chart...</p>}>
              <PassesStatusPieChart passes={passes} />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Passes by Location</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Suspense fallback={<p>Loading chart...</p>}>
              <PassesByLocationChart passes={passes} />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Passes by Company</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Suspense fallback={<p>Loading chart...</p>}>
              <PassesByCompanyChart passes={passes} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
