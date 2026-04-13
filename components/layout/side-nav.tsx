"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarClock,
  CirclePlus,
  Goal,
  History,
  LayoutDashboard,
  PiggyBank,
  ReceiptText,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Главная", icon: LayoutDashboard },
  { href: "/budgets", label: "Лимиты", icon: PiggyBank },
  { href: "/analytics", label: "Аналитика", icon: BarChart3 },
  { href: "/history", label: "История", icon: History },
  { href: "/recurring", label: "Регулярные", icon: CalendarClock },
  { href: "/savings", label: "Копилка", icon: Goal },
  { href: "/required", label: "Обязательные", icon: ReceiptText },
  { href: "/summary", label: "Сводка", icon: Sparkles },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden min-h-screen w-72 shrink-0 flex-col border-r border-white/60 bg-white/55 px-6 py-8 backdrop-blur-2xl lg:flex">
        <div className="rounded-[28px] bg-slate-950 px-5 py-5 text-white shadow-[0_20px_60px_-28px_rgba(15,23,42,0.7)]">
          <p className="text-xs uppercase tracking-[0.24em] text-white/60">Clean Finance</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.05em]">Финансы под контролем</h2>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Баланс, сравнение месяцев, лимиты, копилка и регулярные платежи в одном спокойном интерфейсе.
          </p>
        </div>

        <nav className="mt-8 grid gap-2">
          {navigation.map((item) => {
            const isActive =
              item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-slate-950 !text-white shadow-[0_18px_30px_-22px_rgba(15,23,42,0.75)] [&_*]:!text-white"
                    : "text-slate-600 hover:bg-white hover:text-slate-950",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/transactions/new"
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] px-4 py-3 text-sm font-semibold !text-white shadow-[0_18px_30px_-18px_rgba(29,78,216,0.55)] transition hover:translate-y-[-1px] [&_*]:!text-white"
        >
          <CirclePlus className="h-4 w-4" />
          Новая операция
        </Link>
      </aside>

      <nav className="fixed inset-x-4 bottom-4 z-40 rounded-[28px] border border-white/70 bg-white/90 p-2 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.45)] backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-8 gap-1">
          {navigation.map((item) => {
            const isActive =
              item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-medium",
                  isActive ? "bg-slate-950 !text-white [&_*]:!text-white" : "text-slate-500",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
