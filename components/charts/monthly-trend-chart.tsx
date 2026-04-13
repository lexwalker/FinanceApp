"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { MonthlyTrendItem } from "@/types/finance";

import { formatMonthLabel } from "@/lib/format";

import { EmptyState } from "../shared/empty-state";

type MonthlyTrendChartProps = {
  data: MonthlyTrendItem[];
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

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  if (data.length === 0) {
    return (
      <EmptyState
        title="Недостаточно данных"
        description="Добавь операции за несколько месяцев, чтобы увидеть динамику."
      />
    );
  }

  return (
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap={14}>
          <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.16)" />
          <XAxis
            dataKey="monthKey"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
            tickFormatter={(value) => formatMonthLabel(value).slice(0, 3)}
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
            labelFormatter={(value) => formatMonthLabel(value)}
          />
          <Bar dataKey="incomeTotal" name="Доход" fill="#10b981" radius={[12, 12, 6, 6]} />
          <Bar dataKey="expenseTotal" name="Расход" fill="#0f172a" radius={[12, 12, 6, 6]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
