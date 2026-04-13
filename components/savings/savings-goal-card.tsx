import { PiggyBank } from "lucide-react";

import type { SavingsProgress } from "@/types/finance";

import { formatCurrency } from "@/lib/format";

import { GlassCard } from "../shared/glass-card";

type SavingsGoalCardProps = {
  progress: SavingsProgress;
};

export function SavingsGoalCard({ progress }: SavingsGoalCardProps) {
  return (
    <GlassCard className="p-6 md:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Копилка</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
            {progress.title}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">{progress.note}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
          <PiggyBank className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Накоплено</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
            {formatCurrency(progress.currentAmount)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Цель</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
            {formatCurrency(progress.targetAmount)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Осталось</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
            {formatCurrency(progress.remainingAmount)}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
          <span>Прогресс</span>
          <span>{progress.progress}%</span>
        </div>
        <div className="mt-2 h-3 rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-[linear-gradient(135deg,#f59e0b,#f97316)]"
            style={{ width: `${Math.max(Math.min(progress.progress, 100), 4)}%` }}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-4">
          <p className="text-sm text-slate-500">Ежемесячно в копилку</p>
          <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">
            {formatCurrency(progress.monthlyContribution)}
          </p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-4">
          <p className="text-sm text-slate-500">До цели</p>
          <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">
            {progress.monthsToTarget === null
              ? "Срок не задан"
              : progress.monthsToTarget === 0
                ? "Цель достигнута"
                : `${progress.monthsToTarget} мес.`}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
