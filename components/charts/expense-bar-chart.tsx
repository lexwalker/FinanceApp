"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { CategorySpend } from "@/types/finance";

import { EmptyState } from "../shared/empty-state";

type ExpenseBarChartProps = {
  data: CategorySpend[];
};

function formatTooltipValue(
  value: number | string | Array<number | string> | ReadonlyArray<number | string> | undefined,
) {
  const normalizedValue = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0);

  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(normalizedValue);
}

export function ExpenseBarChart({ data }: ExpenseBarChartProps) {
  if (data.length === 0) {
    return (
      <EmptyState
        title="Недостаточно данных"
        description="Добавь расходы, чтобы сравнить категории по сумме."
      />
    );
  }

  return (
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap={16}>
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
          />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: "rgba(15,23,42,0.04)" }}
            contentStyle={{
              borderRadius: 18,
              border: "1px solid rgba(148,163,184,0.2)",
              boxShadow: "0 20px 40px -22px rgba(15,23,42,0.4)",
              backgroundColor: "rgba(255,255,255,0.94)",
            }}
            formatter={(value) => formatTooltipValue(value)}
          />
          <Bar dataKey="amount" radius={[16, 16, 6, 6]}>
            {data.map((entry) => (
              <Cell key={entry.categoryId} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
