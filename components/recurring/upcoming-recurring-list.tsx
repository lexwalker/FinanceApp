import type { Category, UpcomingRecurringItem } from "@/types/finance";

import { formatCurrency, formatLongDate } from "@/lib/format";
import { cn } from "@/lib/utils";

import { CategoryPill } from "../shared/category-pill";
import { EmptyState } from "../shared/empty-state";

type UpcomingRecurringListProps = {
  items: UpcomingRecurringItem[];
  categories: Category[];
  emptyTitle?: string;
  emptyDescription?: string;
};

function formatDueLabel(daysUntil: number) {
  if (daysUntil === 0) {
    return "Сегодня";
  }

  if (daysUntil === 1) {
    return "Завтра";
  }

  return `Через ${daysUntil} дн.`;
}

export function UpcomingRecurringList({
  items,
  categories,
  emptyTitle = "Пока нет ближайших регулярных операций",
  emptyDescription = "Добавь recurring-платежи, и здесь появится ближайшая финансовая нагрузка.",
}: UpcomingRecurringListProps) {
  if (items.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => {
        const category = categories.find((entry) => entry.id === item.categoryId);

        return (
          <div
            key={item.recurringId}
            className="flex flex-col gap-4 rounded-[24px] border border-slate-200/80 bg-white/90 p-4 shadow-[0_12px_30px_-22px_rgba(15,23,42,0.35)] md:flex-row md:items-center md:justify-between"
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {category ? <CategoryPill category={category} compact /> : null}
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium",
                    item.type === "income" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700",
                  )}
                >
                  {formatDueLabel(item.daysUntil)}
                </span>
              </div>
              <div>
                <p className="text-lg font-semibold tracking-[-0.03em] text-slate-950">
                  {item.title}
                </p>
                <p className="text-sm leading-6 text-slate-500">
                  {formatLongDate(item.dueDate)}{item.note ? ` • ${item.note}` : ""}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-lg font-semibold tracking-[-0.03em] text-slate-950">
                {formatCurrency(item.amount)}
              </p>
              <p className="text-sm text-slate-500">
                {item.type === "income" ? "Ожидаемое поступление" : "Плановое списание"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
