import { WalletCards } from "lucide-react";

import { GlassCard } from "./glass-card";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <GlassCard className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <WalletCards className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-900">{title}</h3>
        <p className="max-w-md text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </GlassCard>
  );
}
