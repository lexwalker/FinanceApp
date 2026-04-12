"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { Category, TransactionFormValues, TransactionType } from "@/types/finance";

import { cn } from "@/lib/utils";

type TransactionFormProps = {
  categories: Category[];
  mode: "create" | "edit";
  initialValues?: TransactionFormValues;
  onSubmit: (values: TransactionFormValues) => void;
  submitLabel: string;
};

export function TransactionForm({
  categories,
  mode,
  initialValues,
  onSubmit,
  submitLabel,
}: TransactionFormProps) {
  const router = useRouter();
  const [type, setType] = useState<TransactionType>(initialValues?.type ?? "expense");
  const [amount, setAmount] = useState(`${initialValues?.amount ?? ""}`);
  const [categoryId, setCategoryId] = useState(initialValues?.categoryId ?? "food");
  const [date, setDate] = useState(
    initialValues?.date ? initialValues.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
  );
  const [note, setNote] = useState(initialValues?.note ?? "");
  const [isRequired, setIsRequired] = useState(initialValues?.isRequired ?? false);

  const filteredCategories = categories.filter((category) => category.kind === type);
  const selectedCategoryId = filteredCategories.some((category) => category.id === categoryId)
    ? categoryId
    : (filteredCategories[0]?.id ?? "food");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedAmount = Number(amount.replace(",", "."));

    if (!parsedAmount || parsedAmount <= 0) {
      return;
    }

    onSubmit({
      type,
      amount: parsedAmount,
      categoryId: selectedCategoryId,
      date: new Date(`${date}T12:00:00`).toISOString(),
      note: note.trim(),
      isRequired,
    });

    router.push("/history");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {(["expense", "income"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setType(item);
              setCategoryId(
                categories.find((category) => category.kind === item)?.id ?? selectedCategoryId,
              );

              if (item === "income") {
                setIsRequired(false);
              }
            }}
            className={cn(
              "rounded-[24px] border px-5 py-4 text-left transition",
              type === item
                ? "border-slate-950 bg-slate-950 text-white shadow-[0_20px_45px_-26px_rgba(15,23,42,0.8)]"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            )}
          >
            <p className="text-xs uppercase tracking-[0.2em] opacity-70">
              {item === "expense" ? "Расход" : "Доход"}
            </p>
            <p className="mt-2 text-lg font-semibold tracking-[-0.03em]">
              {item === "expense" ? "Списываю деньги" : "Получаю деньги"}
            </p>
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-600">Сумма</span>
          <input
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Например, 12500"
            className="h-14 rounded-2xl border border-slate-200 bg-white px-4 text-lg font-semibold text-slate-950 outline-none transition focus:border-slate-950"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-600">Дата</span>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="h-14 rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition focus:border-slate-950"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-600">Категория</span>
          <select
            value={selectedCategoryId}
            onChange={(event) => setCategoryId(event.target.value as Category["id"])}
            className="h-14 rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition focus:border-slate-950"
          >
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-600">Комментарий</span>
          <input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Короткая заметка"
            className="h-14 rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition focus:border-slate-950"
          />
        </label>
      </div>

      {type === "expense" ? (
        <label className="flex items-center justify-between gap-4 rounded-[24px] border border-slate-200 bg-white px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-950">Обязательная трата</p>
            <p className="text-sm leading-6 text-slate-500">
              Аренда, подписки, транспорт, связь и другие регулярные платежи.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsRequired((value) => !value)}
            className={cn(
              "relative h-8 w-14 rounded-full transition",
              isRequired ? "bg-slate-950" : "bg-slate-200",
            )}
          >
            <span
              className={cn(
                "absolute top-1 h-6 w-6 rounded-full bg-white shadow transition",
                isRequired ? "left-7" : "left-1",
              )}
            />
          </button>
        </label>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href={mode === "edit" ? "/history" : "/"}
          className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 px-5 text-sm font-medium text-slate-600 transition hover:bg-white"
        >
          Отмена
        </Link>
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_18px_30px_-18px_rgba(15,23,42,0.6)] transition hover:translate-y-[-1px]"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
