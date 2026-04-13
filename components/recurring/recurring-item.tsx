import { PauseCircle, PlayCircle, Trash2 } from "lucide-react";

import type { Category, RecurringTransaction } from "@/types/finance";

import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

import { CategoryPill } from "../shared/category-pill";

type RecurringItemProps = {
  item: RecurringTransaction;
  category?: Category;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export function RecurringItem({ item, category, onToggle, onDelete }: RecurringItemProps) {
  return (
    <div className="grid gap-4 rounded-[24px] border border-slate-200/80 bg-white/90 p-4 shadow-[0_12px_30px_-22px_rgba(15,23,42,0.35)] md:grid-cols-[1fr_auto] md:items-center">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {category ? <CategoryPill category={category} compact /> : null}
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium",
              item.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600",
            )}
          >
            {item.isActive ? "Активно" : "Пауза"}
          </span>
          {item.isRequired ? (
            <span className="rounded-full bg-slate-950 px-2.5 py-1 text-xs font-medium text-white">
              Обязательный
            </span>
          ) : null}
        </div>

        <div>
          <p className="text-lg font-semibold tracking-[-0.03em] text-slate-950">{item.title}</p>
          <p className="text-sm leading-6 text-slate-500">
            {item.note || "Без комментария"} • {item.type === "income" ? "доход" : "расход"} • {item.scheduleDay} числа каждого месяца
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 justify-between md:justify-end">
        <div className="text-right">
          <p className="text-lg font-semibold tracking-[-0.03em] text-slate-950">
            {formatCurrency(item.amount)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onToggle(item.id)}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
        >
          {item.isActive ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-100 text-rose-500 transition hover:bg-rose-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
