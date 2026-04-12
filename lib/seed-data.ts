import { defaultCategories } from "@/features/transactions/categories";
import type { BudgetTarget, Category, Transaction } from "@/types/finance";

type SeedState = {
  categories: Category[];
  transactions: Transaction[];
  budgetTargets: BudgetTarget[];
};

function isoDate(daysOffset: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString();
}

export function createSeedState(): SeedState {
  const now = new Date().toISOString();

  return {
    categories: defaultCategories,
    budgetTargets: [
      { categoryId: "food", limit: 22000, createdAt: now, updatedAt: now },
      { categoryId: "apartment", limit: 42000, createdAt: now, updatedAt: now },
      { categoryId: "subscriptions", limit: 5000, createdAt: now, updatedAt: now },
      { categoryId: "transport", limit: 7000, createdAt: now, updatedAt: now },
      { categoryId: "entertainment", limit: 9000, createdAt: now, updatedAt: now },
      { categoryId: "health", limit: 6000, createdAt: now, updatedAt: now },
      { categoryId: "clothes", limit: 12000, createdAt: now, updatedAt: now },
      { categoryId: "gifts", limit: 5000, createdAt: now, updatedAt: now },
    ],
    transactions: [
      {
        id: "tx-1",
        type: "income",
        amount: 145000,
        categoryId: "salary",
        date: isoDate(-11),
        note: "Основная зарплата",
        isRequired: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "tx-2",
        type: "income",
        amount: 18000,
        categoryId: "freelance",
        date: isoDate(-4),
        note: "Фриланс за лендинг",
        isRequired: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "tx-3",
        type: "expense",
        amount: 42000,
        categoryId: "apartment",
        date: isoDate(-10),
        note: "Аренда квартиры",
        isRequired: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "tx-4",
        type: "expense",
        amount: 18000,
        categoryId: "food",
        date: isoDate(-6),
        note: "Продукты и доставки",
        isRequired: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "tx-5",
        type: "expense",
        amount: 3900,
        categoryId: "subscriptions",
        date: isoDate(-8),
        note: "Подписки и облака",
        isRequired: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "tx-6",
        type: "expense",
        amount: 6200,
        categoryId: "transport",
        date: isoDate(-5),
        note: "Такси и метро",
        isRequired: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "tx-7",
        type: "expense",
        amount: 7600,
        categoryId: "entertainment",
        date: isoDate(-3),
        note: "Кино и ужин",
        isRequired: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "tx-8",
        type: "expense",
        amount: 5400,
        categoryId: "health",
        date: isoDate(-2),
        note: "Аптека и анализы",
        isRequired: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "tx-9",
        type: "expense",
        amount: 9200,
        categoryId: "clothes",
        date: isoDate(-1),
        note: "Кроссовки",
        isRequired: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "tx-10",
        type: "expense",
        amount: 5700,
        categoryId: "food",
        date: isoDate(-34),
        note: "Продукты в прошлом месяце",
        isRequired: false,
        createdAt: now,
        updatedAt: now,
      },
    ],
  };
}
