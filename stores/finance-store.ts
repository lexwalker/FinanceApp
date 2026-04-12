"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { createSeedState } from "@/lib/seed-data";
import type {
  BudgetTarget,
  Category,
  Transaction,
  TransactionFormValues,
} from "@/types/finance";

type FinanceState = {
  categories: Category[];
  transactions: Transaction[];
  budgetTargets: BudgetTarget[];
  hasHydrated: boolean;
};

type FinanceActions = {
  addTransaction: (values: TransactionFormValues) => void;
  updateTransaction: (id: string, values: TransactionFormValues) => void;
  deleteTransaction: (id: string) => void;
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
      name: "clean-finance-mvp",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        categories: state.categories,
        transactions: state.transactions,
        budgetTargets: state.budgetTargets,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
