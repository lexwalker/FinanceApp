type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-8">
      <div className="max-w-4xl space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          {eyebrow}
        </p>
        <div className="space-y-3">
          <h1 className="max-w-5xl text-3xl font-semibold leading-[0.96] tracking-[-0.05em] text-slate-950 text-balance md:text-5xl xl:text-6xl">
            {title}
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
            {description}
          </p>
        </div>
      </div>

      {action ? (
        <div className="flex items-start lg:justify-end">
          <div className="w-full sm:w-auto">{action}</div>
        </div>
      ) : null}
    </div>
  );
}
