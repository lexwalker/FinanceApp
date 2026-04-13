import Link from "next/link";
import { PencilLine, Trash2 } from "lucide-react";

import type { Category, Transaction } from "@/types/finance";

import { formatCurrency, formatLongDate } from "@/lib/format";
import { cn } from "@/lib/utils";

import { CategoryPill } from "../shared/category-pill";

type TransactionItemProps = {
  transaction: Transaction;
  category: Category | undefined;
  onDelete?: (id: string) => void;
};

export function TransactionItem({
  transaction,
  category,
  onDelete,
}: TransactionItemProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[24px] border border-slate-200/70 bg-white/90 p-4 shadow-[0_12px_30px_-22px_rgba(15,23,42,0.35)] md:flex-row md:items-center md:justify-between">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {category ? <CategoryPill category={category} compact /> : null}
          {transaction.isRequired ? (
            <span className="rounded-full bg-slate-950 px-2.5 py-1 text-xs font-medium text-white">
              Обязательная
            </span>
          ) : null}
          {transaction.recurringSourceId ? (
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
              Авто из recurring
            </span>
          ) : null}
          <span className="text-xs text-slate-400">{formatLongDate(transaction.date)}</span>
        </div>
        <div>
          <p className="text-lg font-semibold tracking-[-0.03em] text-slate-950">
            {formatCurrency(transaction.amount)}
          </p>
          <p className="text-sm leading-6 text-slate-500">
            {transaction.note || "Без комментария"}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 md:justify-end">
        <span
          className={cn(
            "rounded-full px-3 py-1.5 text-sm font-medium",
            transaction.type === "income"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700",
          )}
        >
          {transaction.type === "income" ? "Доход" : "Расход"}
        </span>

        <div className="flex items-center gap-2">
          <Link
            href={`/transactions/${transaction.id}/edit`}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
          >
            <PencilLine className="h-4 w-4" />
          </Link>
          {onDelete ? (
            <button
              type="button"
              onClick={() => onDelete(transaction.id)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-100 text-rose-500 transition hover:bg-rose-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
