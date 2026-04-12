import type { Category } from "@/types/finance";

import { cn } from "@/lib/utils";

import { categoryIconMap } from "./icon-map";

type CategoryPillProps = {
  category: Category;
  compact?: boolean;
};

export function CategoryPill({ category, compact = false }: CategoryPillProps) {
  const IconComponent = categoryIconMap[category.icon] ?? categoryIconMap.sparkles;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 text-slate-700",
        compact ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
      )}
    >
      <span
        className="flex h-6 w-6 items-center justify-center rounded-full"
        style={{ backgroundColor: `${category.color}18`, color: category.color }}
      >
        <IconComponent className="h-3.5 w-3.5" />
      </span>
      {category.name}
    </span>
  );
}
