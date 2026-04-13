"use client";

import { useMemo, useState } from "react";

import type { Category, RecurringFormValues, TransactionType } from "@/types/finance";

import { cn } from "@/lib/utils";

type RecurringFormProps = {
  categories: Category[];
  onSubmit: (values: RecurringFormValues) => void;
};

export function RecurringForm({ categories, onSubmit }: RecurringFormProps) {
  const [type, setType] = useState<TransactionType>("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [scheduleDay, setScheduleDay] = useState("10");
  const [note, setNote] = useState("");
  const [isRequired, setIsRequired] = useState(true);
  const [isActive, setIsActive] = useState(true);

  const filteredCategories = useMemo(
    () => categories.filter((category) => category.kind === type),
    [categories, type],
  );
  const [categoryId, setCategoryId] = useState<Category["id"]>(filteredCategories[0]?.id ?? "food");
  const selectedCategoryId = filteredCategories.some((category) => category.id === categoryId)
    ? categoryId
    : (filteredCategories[0]?.id ?? "food");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedAmount = Number(amount.replace(",", "."));
    const parsedDay = Number(scheduleDay.replace(",", "."));

    if (!title.trim() || !parsedAmount || parsedAmount <= 0 || !parsedDay) {
      return;
    }

    onSubmit({
      title: title.trim(),
      type,
      amount: parsedAmount,
      categoryId: selectedCategoryId,
      scheduleDay: parsedDay,
      note: note.trim(),
      isRequired: type === "expense" ? isRequired : false,
      isActive,
    });

    setTitle("");
    setAmount("");
    setScheduleDay("10");
    setNote("");
    setIsRequired(type === "expense");
    setIsActive(true);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {(["expense", "income"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setType(item);
              setCategoryId(categories.find((category) => category.kind === item)?.id ?? "food");

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
              {item === "expense" ? "Регулярное списание" : "Регулярное поступление"}
            </p>
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-600">Название</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Например, аренда или зарплата"
            className="h-14 rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition focus:border-slate-950"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-600">Сумма</span>
          <input
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Например, 12000"
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
          <span className="text-sm font-medium text-slate-600">День месяца</span>
          <input
            inputMode="numeric"
            value={scheduleDay}
            onChange={(event) => setScheduleDay(event.target.value)}
            placeholder="От 1 до 31"
            className="h-14 rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition focus:border-slate-950"
          />
        </label>

        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-600">Комментарий</span>
          <input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Короткое пояснение для себя"
            className="h-14 rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition focus:border-slate-950"
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {type === "expense" ? (
          <label className="flex items-center justify-between gap-4 rounded-[24px] border border-slate-200 bg-white px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-slate-950">Обязательный платеж</p>
              <p className="text-sm leading-6 text-slate-500">
                Используй для аренды, подписок, связи и других фиксированных списаний.
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
        ) : (
          <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-4 text-sm leading-6 text-slate-500">
            Регулярные доходы помогут заранее видеть реальный запас денег на месяц.
          </div>
        )}

        <label className="flex items-center justify-between gap-4 rounded-[24px] border border-slate-200 bg-white px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-950">Активен в этом месяце</p>
            <p className="text-sm leading-6 text-slate-500">
              Отключай правило, если платеж временно неактуален.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsActive((value) => !value)}
            className={cn(
              "relative h-8 w-14 rounded-full transition",
              isActive ? "bg-slate-950" : "bg-slate-200",
            )}
          >
            <span
              className={cn(
                "absolute top-1 h-6 w-6 rounded-full bg-white shadow transition",
                isActive ? "left-7" : "left-1",
              )}
            />
          </button>
        </label>
      </div>

      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_18px_30px_-18px_rgba(15,23,42,0.6)] transition hover:translate-y-[-1px]"
      >
        Добавить регулярную операцию
      </button>
    </form>
  );
}
