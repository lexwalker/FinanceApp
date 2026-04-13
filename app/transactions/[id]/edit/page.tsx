"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { TransactionForm } from "@/components/forms/transaction-form";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { PageHeader } from "@/components/shared/page-header";
import { useFinanceStore } from "@/stores/finance-store";

export default function EditTransactionPage() {
  const params = useParams<{ id: string }>();
  const { categories, transactions, updateTransaction, hasHydrated } = useFinanceStore();

  if (!hasHydrated) {
    return (
      <AppShell>
        <LoadingScreen />
      </AppShell>
    );
  }

  const transaction = transactions.find((item) => item.id === params.id);

  if (!transaction) {
    return (
      <AppShell>
        <EmptyState
          title="Операция не найдена"
          description="Запись могла быть удалена. Вернись в историю и выбери актуальную операцию."
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="grid gap-6">
        <PageHeader
          eyebrow="Редактирование"
          title="Изменить операцию"
          description="Скорректируй сумму, категорию, дату, комментарий и отметку обязательной траты."
          action={
            <Link
              href="/history"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Вернуться в историю
            </Link>
          }
        />

        <GlassCard className="mx-auto w-full max-w-4xl p-6 md:p-8">
          <TransactionForm
            categories={categories}
            mode="edit"
            initialValues={{
              type: transaction.type,
              amount: transaction.amount,
              categoryId: transaction.categoryId,
              date: transaction.date,
              note: transaction.note,
              isRequired: transaction.isRequired,
            }}
            onSubmit={(values) => updateTransaction(transaction.id, values)}
            submitLabel="Сохранить изменения"
          />
        </GlassCard>
      </div>
    </AppShell>
  );
}
