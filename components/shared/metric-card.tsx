import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { formatCurrency, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

import { GlassCard } from "./glass-card";

type MetricCardProps = {
  label: string;
  value: number;
  tone?: "default" | "positive" | "negative";
  helper?: string;
  percent?: number;
  format?: "currency" | "number";
};

export function MetricCard({
  label,
  value,
  tone = "default",
  helper,
  percent,
  format = "currency",
}: MetricCardProps) {
  const Icon =
    tone === "positive" ? ArrowUpRight : tone === "negative" ? ArrowDownRight : Minus;
  const formattedValue =
    format === "currency"
      ? formatCurrency(value)
      : new Intl.NumberFormat("ru-RU", {
          maximumFractionDigits: 0,
        }).format(value);

  return (
    <GlassCard className="h-full p-4 md:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-2xl font-semibold tracking-[-0.04em] text-slate-950 md:text-3xl">
            {formattedValue}
          </p>
          {helper ? <p className="text-sm text-slate-500">{helper}</p> : null}
        </div>
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-2xl",
            tone === "positive" && "bg-emerald-50 text-emerald-600",
            tone === "negative" && "bg-rose-50 text-rose-600",
            tone === "default" && "bg-slate-100 text-slate-500",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {typeof percent === "number" ? (
        <div className="mt-5 flex items-center gap-3">
          <div className="h-2 flex-1 rounded-full bg-slate-100">
            <div
              className={cn(
                "h-full rounded-full",
                tone === "positive" && "bg-emerald-500",
                tone === "negative" && "bg-rose-500",
                tone === "default" && "bg-slate-900",
              )}
              style={{ width: `${Math.max(Math.min(percent, 100), 4)}%` }}
            />
          </div>
          <span className="text-sm font-medium text-slate-600">{formatPercent(percent)}</span>
        </div>
      ) : null}
    </GlassCard>
  );
}
