"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { CategorySpend } from "@/types/finance";

import { EmptyState } from "../shared/empty-state";

type CategoryDonutChartProps = {
  data: CategorySpend[];
  centerLabel: string;
  centerValue: string;
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

export function CategoryDonutChart({
  data,
  centerLabel,
  centerValue,
}: CategoryDonutChartProps) {
  if (data.length === 0) {
    return (
      <EmptyState
        title="Пока нет расходов"
        description="Добавь несколько трат, и здесь появится структура категорий."
      />
    );
  }

  return (
    <div className="relative h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="name"
            innerRadius={86}
            outerRadius={116}
            strokeWidth={0}
            paddingAngle={3}
          >
            {data.map((entry) => (
              <Cell key={entry.categoryId} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 18,
              border: "1px solid rgba(148,163,184,0.2)",
              boxShadow: "0 20px 40px -22px rgba(15,23,42,0.4)",
              backgroundColor: "rgba(255,255,255,0.94)",
            }}
            formatter={(value) => formatTooltipValue(value)}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-sm text-slate-500">{centerLabel}</span>
        <span className="mt-1 text-3xl font-semibold tracking-[-0.05em] text-slate-950">
          {centerValue}
        </span>
      </div>
    </div>
  );
}
