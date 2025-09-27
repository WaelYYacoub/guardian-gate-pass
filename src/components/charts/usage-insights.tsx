// src/components/charts/usage-insights.tsx
"use client";

import React, { useMemo } from "react";
import type { Pass } from "@/types";

interface UsageInsightsProps {
  passes: Pass[];
}

const UsageInsights: React.FC<UsageInsightsProps> = ({ passes }) => {
  const insights = useMemo(() => {
    if (!passes || passes.length === 0) return null;

    // Convert passes to JSON-safe data for analysis
    const passDataString = JSON.stringify(
      passes.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(), // ✅ removed .toDate()
        expiresAt: p.expiresAt.toISOString(), // ✅ removed .toDate()
      }))
    );

    // Simple analysis: count passes by type and status
    const typeCount: Record<string, number> = {};
    const statusCount: Record<string, number> = {};

    passes.forEach((p) => {
      typeCount[p.type] = (typeCount[p.type] || 0) + 1;
      statusCount[p.status] = (statusCount[p.status] || 0) + 1;
    });

    return { typeCount, statusCount, total: passes.length };
  }, [passes]);

  if (!insights) return <p>No passes available for analysis.</p>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Usage Insights</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-md border p-4">
          <h4 className="font-medium mb-2">Pass Types</h4>
          <ul className="space-y-1">
            {Object.entries(insights.typeCount).map(([type, count]) => (
              <li key={type}>
                <strong>{type}</strong>: {count}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-md border p-4">
          <h4 className="font-medium mb-2">Statuses</h4>
          <ul className="space-y-1">
            {Object.entries(insights.statusCount).map(([status, count]) => (
              <li key={status}>
                <strong>{status}</strong>: {count}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mt-2">
        Total passes analyzed: {insights.total}
      </p>
    </div>
  );
};

export default UsageInsights;
