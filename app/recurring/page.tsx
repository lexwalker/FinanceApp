"use client";

import { AppShell } from "@/components/layout/app-shell";
import { RecurringForm } from "@/components/recurring/recurring-form";
import { RecurringItem } from "@/components/recurring/recurring-item";
import { UpcomingRecurringList } from "@/components/recurring/upcoming-recurring-list";
import { EmptyState } from "@/components/shared/empty-state";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { calculateRecurringOverview } from "@/lib/finance";
import { formatCurrency } from "@/lib/format";
import { useFinanceStore } from "@/stores/finance-store";

export default function RecurringPage() {
  const {
    categories,
    transactions,
    recurringTransactions,
    addRecurringTransaction,
    toggleRecurringTransaction,
    deleteRecurringTransaction,
    syncRecurringTransactions,
    hasHydrated,
  } = useFinanceStore();

  if (!hasHydrated) {
    return (
      <AppShell>
        <LoadingScreen />
      </AppShell>
    );
  }

  const recurringOverview = calculateRecurringOverview(recurringTransactions, transactions);
  const sortedRecurring = [...recurringTransactions].sort((left, right) => {
    if (left.isActive !== right.isActive) {
      return left.isActive ? -1 : 1;
    }

    return left.scheduleDay - right.scheduleDay;
  });

  return (
    <AppShell>
      <div className="grid gap-6">
        <PageHeader
          eyebrow="Регулярные"
          title="Предсказуемые деньги месяца"
          description="Сохраняй аренду, подписки, зарплату и другие повторяющиеся операции. Приложение автоматически создаст их в текущем месяце, когда наступит дата."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Активных правил" value={recurringOverview.activeCount} format="number" helper="Сколько регулярных операций сейчас действует" />
          <MetricCard label="Плановые доходы" value={recurringOverview.monthlyIncomePlanned} tone="positive" helper="Все ожидаемые регулярные поступления" />
          <MetricCard label="Плановые расходы" value={recurringOverview.monthlyExpensePlanned} tone="negative" helper="Все регулярные списания месяца" />
          <MetricCard label="Автосоздано в месяце" value={recurringOverview.autoCreatedCount} format="number" helper={`На сумму ${formatCurrency(recurringOverview.autoCreatedAmount)}`} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <GlassCard className="p-6 md:p-7">
            <p className="text-sm text-slate-500">Новая регулярная операция</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Добавь то, что повторяется каждый месяц
            </h2>

            <div className="mt-6">
              <RecurringForm categories={categories} onSubmit={addRecurringTransaction} />
            </div>
          </GlassCard>

          <div className="grid gap-6">
            <GlassCard className="p-6 md:p-7">
              <p className="text-sm text-slate-500">Ближайшие операции</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Что будет в ближайшие дни
              </h2>

              <div className="mt-6">
                <UpcomingRecurringList
                  items={recurringOverview.upcomingItems}
                  categories={categories}
                  emptyDescription="Когда появятся повторяющиеся платежи, здесь будет видно ближайшую нагрузку."
                />
              </div>
            </GlassCard>

            <GlassCard className="p-6 md:p-7">
              <p className="text-sm text-slate-500">Автоматическое создание</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Как это работает
              </h2>

              <div className="mt-6 grid gap-3 text-sm leading-7 text-slate-600">
                <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 px-4 py-4">
                  Когда в текущем месяце наступает дата регулярной операции, приложение автоматически добавляет её в историю.
                </div>
                <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 px-4 py-4">
                  Если похожая операция уже есть в этом месяце, дубликат не создаётся.
                </div>
                <button
                  type="button"
                  onClick={syncRecurringTransactions}
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_18px_30px_-18px_rgba(15,23,42,0.6)] transition hover:translate-y-[-1px]"
                >
                  Проверить и добавить актуальные операции
                </button>
              </div>
            </GlassCard>
          </div>
        </div>

        <GlassCard className="p-6 md:p-7">
          <p className="text-sm text-slate-500">Все правила</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
            Регулярные операции
          </h2>

          <div className="mt-6 grid gap-3">
            {sortedRecurring.length === 0 ? (
              <EmptyState
                title="Пока нет регулярных операций"
                description="Добавь аренду, подписки, зарплату или другие повторяющиеся движения денег."
              />
            ) : (
              sortedRecurring.map((item) => (
                <RecurringItem
                  key={item.id}
                  item={item}
                  category={categories.find((category) => category.id === item.categoryId)}
                  onToggle={toggleRecurringTransaction}
                  onDelete={deleteRecurringTransaction}
                />
              ))
            )}
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}
