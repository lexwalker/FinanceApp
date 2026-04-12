"use client";

import type { Category, Transaction } from "@/types/finance";

import { EmptyState } from "../shared/empty-state";
import { TransactionItem } from "./transaction-item";

type TransactionListProps = {
  transactions: Transaction[];
  categories: Category[];
  onDelete?: (id: string) => void;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function TransactionList({
  transactions,
  categories,
  onDelete,
  emptyTitle = "Операции не найдены",
  emptyDescription = "Попробуй изменить фильтры или добавь первую транзакцию.",
}: TransactionListProps) {
  if (transactions.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid gap-3">
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          category={categories.find((category) => category.id === transaction.categoryId)}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
