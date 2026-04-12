import type { Category } from "@/types/finance";

export const defaultCategories: Category[] = [
  { id: "salary", name: "Зарплата", kind: "income", color: "#0f9d7a", icon: "wallet" },
  {
    id: "freelance",
    name: "Подработка",
    kind: "income",
    color: "#1e5eff",
    icon: "briefcase-business",
  },
  { id: "refund", name: "Возврат", kind: "income", color: "#0ea5a3", icon: "rotate-ccw" },
  { id: "gift_income", name: "Подарок", kind: "income", color: "#f59e0b", icon: "gift" },
  { id: "other_income", name: "Другое", kind: "income", color: "#64748b", icon: "sparkles" },
  { id: "food", name: "Еда", kind: "expense", color: "#f97316", icon: "utensils-crossed" },
  { id: "apartment", name: "Квартира", kind: "expense", color: "#2563eb", icon: "house" },
  { id: "subscriptions", name: "Подписки", kind: "expense", color: "#8b5cf6", icon: "tv-minimal" },
  { id: "transport", name: "Транспорт", kind: "expense", color: "#0891b2", icon: "car-taxi-front" },
  { id: "entertainment", name: "Развлечения", kind: "expense", color: "#ec4899", icon: "party-popper" },
  { id: "health", name: "Здоровье", kind: "expense", color: "#ef4444", icon: "heart-pulse" },
  { id: "clothes", name: "Одежда", kind: "expense", color: "#a16207", icon: "shirt" },
  { id: "gifts", name: "Подарки", kind: "expense", color: "#14b8a6", icon: "gift" },
  { id: "other_expense", name: "Другое", kind: "expense", color: "#64748b", icon: "ellipsis" },
];
