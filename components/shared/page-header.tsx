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
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          {eyebrow}
        </p>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 md:text-5xl">
            {title}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
            {description}
          </p>
        </div>
      </div>
      {action}
    </div>
  );
}
