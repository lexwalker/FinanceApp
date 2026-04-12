"use client";

import { TransactionForm } from "@/components/forms/transaction-form";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { PageHeader } from "@/components/shared/page-header";
import { useFinanceStore } from "@/stores/finance-store";

export default function NewTransactionPage() {
  const { categories, addTransaction, hasHydrated } = useFinanceStore();

  if (!hasHydrated) {
    return (
      <AppShell>
        <LoadingScreen />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="grid gap-6">
        <PageHeader
          eyebrow="Create Transaction"
          title="Добавить доход или расход"
          description="MVP-форма с суммой, категорией, датой, комментарием и флагом обязательной траты. Всё хранится локально и доступно сразу."
        />

        <GlassCard className="mx-auto w-full max-w-4xl p-6 md:p-8">
          <TransactionForm
            categories={categories}
            mode="create"
            onSubmit={addTransaction}
            submitLabel="Сохранить транзакцию"
          />
        </GlassCard>
      </div>
    </AppShell>
  );
}
