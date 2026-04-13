import { PencilLine, PlusCircle, Trash2 } from "lucide-react";

import type { SavingsProgress } from "@/types/finance";

import { formatCurrency } from "@/lib/format";

type SavingsGoalListItemProps = {
  goal: SavingsProgress;
  isActive: boolean;
  onSelect: (id: string) => void;
  onAdd: (id: string, amount: number) => void;
  onDelete: (id: string) => void;
};

export function SavingsGoalListItem({
  goal,
  isActive,
  onSelect,
  onAdd,
  onDelete,
}: SavingsGoalListItemProps) {
  return (
    <div
      className={`rounded-[24px] border px-4 py-4 ${
        isActive ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white/90"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`font-semibold ${isActive ? "text-white" : "text-slate-950"}`}>{goal.title}</p>
          <p className={`mt-1 text-sm ${isActive ? "text-white/70" : "text-slate-500"}`}>{goal.note}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelect(goal.id)}
            className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${
              isActive
                ? "border-white/15 text-white hover:bg-white/10"
                : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            <PencilLine className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(goal.id)}
            className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${
              isActive
                ? "border-white/15 text-white hover:bg-white/10"
                : "border-rose-100 text-rose-500 hover:bg-rose-50"
            }`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div>
          <p className={`text-xs uppercase tracking-[0.18em] ${isActive ? "text-white/45" : "text-slate-400"}`}>Накоплено</p>
          <p className={`mt-2 text-lg font-semibold tracking-[-0.03em] ${isActive ? "text-white" : "text-slate-950"}`}>
            {formatCurrency(goal.currentAmount)}
          </p>
        </div>
        <div>
          <p className={`text-xs uppercase tracking-[0.18em] ${isActive ? "text-white/45" : "text-slate-400"}`}>Цель</p>
          <p className={`mt-2 text-lg font-semibold tracking-[-0.03em] ${isActive ? "text-white" : "text-slate-950"}`}>
            {formatCurrency(goal.targetAmount)}
          </p>
        </div>
        <div>
          <p className={`text-xs uppercase tracking-[0.18em] ${isActive ? "text-white/45" : "text-slate-400"}`}>Прогресс</p>
          <p className={`mt-2 text-lg font-semibold tracking-[-0.03em] ${isActive ? "text-white" : "text-slate-950"}`}>
            {goal.progress}%
          </p>
        </div>
      </div>

      <div className={`mt-4 h-2.5 rounded-full ${isActive ? "bg-white/10" : "bg-slate-100"}`}>
        <div
          className={`h-full rounded-full ${isActive ? "bg-white" : "bg-[linear-gradient(135deg,#f59e0b,#f97316)]"}`}
          style={{ width: `${Math.max(Math.min(goal.progress, 100), 4)}%` }}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {[5000, 10000, goal.monthlyContribution || 15000].map((amount, index) => (
          <button
            key={`${goal.id}-${amount}-${index}`}
            type="button"
            onClick={() => onAdd(goal.id, amount)}
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold ${
              isActive
                ? "bg-white text-slate-950"
                : "border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <PlusCircle className="h-4 w-4" />
            {formatCurrency(amount)}
          </button>
        ))}
      </div>
    </div>
  );
}
