"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getMonth, isThisYear } from "date-fns";
import type { Pass } from "@/types";

interface PassesByMonthChartProps {
  passes: Pass[];
}

export default function PassesByMonthChart({ passes }: PassesByMonthChartProps) {
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString("default", { month: "short" }),
    active: 0,
    expired: 0,
    revoked: 0,
  }));

  passes.forEach((pass) => {
    // ✅ Normalize Firestore Timestamp or JS Date
    const createdAtValue = pass.createdAt as any;
    const createdAtDate =
      createdAtValue instanceof Date
        ? createdAtValue
        : createdAtValue?.toDate?.() ?? new Date();

    if (isThisYear(createdAtDate)) {
      const monthIndex = getMonth(createdAtDate);
      if (pass.status === "active") monthlyData[monthIndex].active += 1;
      if (pass.status === "expired") monthlyData[monthIndex].expired += 1;
      if (pass.status === "revoked") monthlyData[monthIndex].revoked += 1;
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
