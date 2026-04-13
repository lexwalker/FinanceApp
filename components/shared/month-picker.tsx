import { formatMonthLabel } from "@/lib/format";

type MonthPickerProps = {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  label?: string;
};

export function MonthPicker({
  value,
  options,
  onChange,
  label = "Период",
}: MonthPickerProps) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition focus:border-slate-950"
      >
        {options.map((monthKey) => (
          <option key={monthKey} value={monthKey}>
            {formatMonthLabel(monthKey)}
          </option>
        ))}
      </select>
    </label>
  );
}
