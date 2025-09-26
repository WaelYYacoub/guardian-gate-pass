"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { getMonth, isThisYear } from "date-fns";
import type { Pass } from "@/types";

export default function PassesByMonthChart({ passes }: { passes: Pass[] }) {
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString("default", { month: "short" }),
    active: 0, expired: 0, revoked: 0
  }));

  passes.forEach((p) => {
    const val: any = p.createdAt;
    const date = val?.toDate ? val.toDate() : val instanceof Date ? val : new Date();
    if (isThisYear(date)) {
      const m = getMonth(date);
      if (p.status === "active") monthlyData[m].active++;
      if (p.status === "expired") monthlyData[m].expired++;
      if (p.status === "revoked") monthlyData[m].revoked++;
    }
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={monthlyData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="active" fill="#4ade80" name="Active" />
        <Bar dataKey="expired" fill="#fbbf24" name="Expired" />
        <Bar dataKey="revoked" fill="#f87171" name="Revoked" />
      </BarChart>
    </ResponsiveContainer>
  );
}
