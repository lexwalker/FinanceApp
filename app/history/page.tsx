"use client";

import { useState } from "react";

import { TransactionList } from "@/components/history/transaction-list";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { PageHeader } from "@/components/shared/page-header";
import { getMonthOptions, sortTransactionsByDate } from "@/lib/finance";
import { formatMonthLabel } from "@/lib/format";
import { useFinanceStore } from "@/stores/finance-store";
import type { Category, TransactionType } from "@/types/finance";

export default function HistoryPage() {
  const { categories, transactions, deleteTransaction, hasHydrated } = useFinanceStore();
  const [typeFilter, setTypeFilter] = useState<"all" | TransactionType>("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | Category["id"]>("all");
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (!hasHydrated) {
    return (
      <AppShell>
        <LoadingScreen />
      </AppShell>
    );
  }

  const monthOptions = getMonthOptions(transactions);
  const filteredTransactions = sortTransactionsByDate(transactions).filter((transaction) => {
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    const matchesCategory = categoryFilter === "all" || transaction.categoryId === categoryFilter;
    const transactionMonth = transaction.date.slice(0, 7);
    const matchesMonth = monthFilter === "all" || transactionMonth === monthFilter;
    const normalizedNote = transaction.note.toLowerCase();
    const matchesSearch = normalizedNote.includes(searchQuery.trim().toLowerCase());

    return matchesType && matchesCategory && matchesMonth && matchesSearch;
  });

  return (
    <AppShell>
      <div className="grid gap-6">
        <PageHeader
          eyebrow="История"
          title="Все операции под контролем"
          description="Фильтруй по типу, категории и месяцу, ищи по комментариям, редактируй и удаляй операции без лишнего шума."
        />

        <GlassCard className="p-5 md:p-6">
          <div className="grid gap-4 xl:grid-cols-4">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-600">Тип</span>
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value as "all" | TransactionType)}
                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition focus:border-slate-950"
              >
                <option value="all">Все</option>
                <option value="income">Доходы</option>
                <option value="expense">Расходы</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-600">Категория</span>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value as "all" | Category["id"])}
                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition focus:border-slate-950"
              >
                <option value="all">Все категории</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-600">Месяц</span>
              <select
                value={monthFilter}
                onChange={(event) => setMonthFilter(event.target.value)}
                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition focus:border-slate-950"
              >
                <option value="all">Все месяцы</option>
                {monthOptions.map((month) => (
                  <option key={month} value={month}>
                    {formatMonthLabel(month)}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-600">Поиск по комментарию</span>
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Например, аренда или такси"
                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition focus:border-slate-950"
              />
            </label>
          </div>
        </GlassCard>

        <TransactionList
          transactions={filteredTransactions}
          categories={categories}
          onDelete={deleteTransaction}
          emptyTitle="Ничего не найдено"
          emptyDescription="По текущим фильтрам операций нет. Сбрось фильтры или добавь новую запись."
        />
      </div>
    </AppShell>
  );
}
