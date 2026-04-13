"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { syncRecurringTransactions } from "@/lib/finance";
import { createSeedState } from "@/lib/seed-data";
import type {
  BudgetTarget,
  Category,
  RecurringFormValues,
  RecurringTransaction,
  SavingsGoal,
  SavingsGoalFormValues,
  Transaction,
  TransactionFormValues,
} from "@/types/finance";

type FinanceState = {
  categories: Category[];
  transactions: Transaction[];
  budgetTargets: BudgetTarget[];
  recurringTransactions: RecurringTransaction[];
  savingsGoals: SavingsGoal[];
  hasHydrated: boolean;
};

type FinanceActions = {
  addTransaction: (values: TransactionFormValues) => void;
  updateTransaction: (id: string, values: TransactionFormValues) => void;
  deleteTransaction: (id: string) => void;
  addRecurringTransaction: (values: RecurringFormValues) => void;
  toggleRecurringTransaction: (id: string) => void;
  deleteRecurringTransaction: (id: string) => void;
  syncRecurringTransactions: () => void;
  addSavingsGoal: (values: SavingsGoalFormValues) => void;
  updateSavingsGoal: (id: string, values: SavingsGoalFormValues) => void;
  deleteSavingsGoal: (id: string) => void;
  adjustSavingsGoal: (id: string, amount: number) => void;
  setBudgetTarget: (categoryId: Category["id"], limit: number) => void;
  setHydrated: (value: boolean) => void;
};

type FinanceStore = FinanceState & FinanceActions;

const seedState = createSeedState();

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set) => ({
      ...seedState,
      hasHydrated: false,
      setHydrated: (value) => set({ hasHydrated: value }),
      addTransaction: (values) =>
        set((state) => {
          const now = new Date().toISOString();
          const nextTransaction: Transaction = {
            ...values,
            id: crypto.randomUUID(),
            isRequired: values.type === "expense" ? values.isRequired : false,
            createdAt: now,
            updatedAt: now,
          };

          return {
            transactions: [nextTransaction, ...state.transactions],
          };
        }),
      updateTransaction: (id, values) =>
        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.id === id
              ? {
                  ...transaction,
                  ...values,
                  isRequired: values.type === "expense" ? values.isRequired : false,
                  updatedAt: new Date().toISOString(),
                }
              : transaction,
          ),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((transaction) => transaction.id !== id),
        })),
      addRecurringTransaction: (values) =>
        set((state) => {
          const now = new Date().toISOString();
          const nextRecurring: RecurringTransaction = {
            ...values,
            id: crypto.randomUUID(),
            frequency: "monthly",
            isRequired: values.type === "expense" ? values.isRequired : false,
            scheduleDay: Math.min(Math.max(Math.round(values.scheduleDay), 1), 31),
            createdAt: now,
            updatedAt: now,
          };
          const synced = syncRecurringTransactions(
            state.transactions,
            [nextRecurring, ...state.recurringTransactions],
          );

          return {
            recurringTransactions: [nextRecurring, ...state.recurringTransactions],
            transactions: synced.transactions,
          };
        }),
      toggleRecurringTransaction: (id) =>
        set((state) => {
          const recurringTransactions = state.recurringTransactions.map((item) =>
            item.id === id
              ? {
                  ...item,
                  isActive: !item.isActive,
                  updatedAt: new Date().toISOString(),
                }
              : item,
          );
          const synced = syncRecurringTransactions(state.transactions, recurringTransactions);

          return {
            recurringTransactions,
            transactions: synced.transactions,
          };
        }),
      deleteRecurringTransaction: (id) =>
        set((state) => ({
          recurringTransactions: state.recurringTransactions.filter((item) => item.id !== id),
        })),
      syncRecurringTransactions: () =>
        set((state) => ({
          transactions: syncRecurringTransactions(
            state.transactions,
            state.recurringTransactions,
          ).transactions,
        })),
      addSavingsGoal: (values) =>
        set((state) => ({
          savingsGoals: [
            {
              id: crypto.randomUUID(),
              title: values.title.trim() || "Новая цель",
              targetAmount: Math.max(0, Math.round(values.targetAmount)),
              currentAmount: Math.max(0, Math.round(values.currentAmount)),
              monthlyContribution: Math.max(0, Math.round(values.monthlyContribution)),
              note: values.note.trim(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...state.savingsGoals,
          ],
        })),
      updateSavingsGoal: (id, values) =>
        set((state) => ({
          savingsGoals: state.savingsGoals.map((goal) =>
            goal.id === id
              ? {
                  ...goal,
                  title: values.title.trim() || goal.title,
                  targetAmount: Math.max(0, Math.round(values.targetAmount)),
                  currentAmount: Math.max(0, Math.round(values.currentAmount)),
                  monthlyContribution: Math.max(0, Math.round(values.monthlyContribution)),
                  note: values.note.trim(),
                  updatedAt: new Date().toISOString(),
                }
              : goal,
          ),
        })),
      deleteSavingsGoal: (id) =>
        set((state) => ({
          savingsGoals: state.savingsGoals.filter((goal) => goal.id !== id),
        })),
      adjustSavingsGoal: (id, amount) =>
        set((state) => ({
          savingsGoals: state.savingsGoals.map((goal) =>
            goal.id === id
              ? {
                  ...goal,
                  currentAmount: Math.max(0, goal.currentAmount + Math.round(amount)),
                  updatedAt: new Date().toISOString(),
                }
              : goal,
          ),
        })),
      setBudgetTarget: (categoryId, limit) =>
        set((state) => {
          const normalizedLimit = Number.isFinite(limit) ? Math.max(0, Math.round(limit)) : 0;
          const existingTarget = state.budgetTargets.find(
            (budgetTarget) => budgetTarget.categoryId === categoryId,
          );

          if (existingTarget) {
            return {
              budgetTargets: state.budgetTargets.map((budgetTarget) =>
                budgetTarget.categoryId === categoryId
                  ? {
                      ...budgetTarget,
                      limit: normalizedLimit,
                      updatedAt: new Date().toISOString(),
                    }
                  : budgetTarget,
              ),
            };
          }

          return {
            budgetTargets: [
              ...state.budgetTargets,
              {
                categoryId,
                limit: normalizedLimit,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
          };
        }),
    }),
    {
      name: "clean-finance-store",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState) => {
        const state = persistedState as Partial<FinanceState> & {
          savingsGoal?: SavingsGoal;
        };

        return {
          ...seedState,
          ...state,
          savingsGoals: state.savingsGoals
            ? state.savingsGoals
            : state.savingsGoal
              ? [state.savingsGoal]
              : seedState.savingsGoals,
        };
      },
      partialize: (state) => ({
        categories: state.categories,
        transactions: state.transactions,
        budgetTargets: state.budgetTargets,
        recurringTransactions: state.recurringTransactions,
        savingsGoals: state.savingsGoals,
      }),
      onRehydrateStorage: () => (state) => {
        state?.syncRecurringTransactions();
        state?.setHydrated(true);
      },
    },
  ),
);
