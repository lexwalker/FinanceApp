export function LoadingScreen() {
  return (
    <div className="grid gap-6">
      <div className="h-36 animate-pulse rounded-[32px] bg-white/70" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-36 animate-pulse rounded-[28px] bg-white/70" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="h-96 animate-pulse rounded-[32px] bg-white/70" />
        <div className="h-96 animate-pulse rounded-[32px] bg-white/70" />
      </div>
    </div>
  );
}
