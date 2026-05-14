import type { CompareBar } from "@/types/dashboard";

export function CompareBarChart({ items }: { items: CompareBar[] }) {
  const maxValue = Math.max(...items.flatMap((item) => [item.before, item.after]), 1000);

  return (
    <div className="rounded-[22px] border border-[#eadfce] bg-white p-3.5 sm:rounded-[26px] sm:p-4">
      <div className="flex flex-wrap items-center gap-3 text-[0.68rem] text-slate-500 sm:gap-4 sm:text-xs">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-[#d6d3cf]" />
          <span>Before app (Historical)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-[#0b6a33]" />
          <span>With app (AI Co-pilot)</span>
        </div>
      </div>
      <div className="mt-3.5 grid gap-3.5 sm:mt-4 sm:gap-4">
        {items.map((item) => (
          <div key={item.label}>
            <p className="mb-2 text-[0.76rem] font-medium text-slate-700 sm:mb-2.5 sm:text-sm">{item.label}</p>
            <div className="grid gap-2">
              <div className="flex items-center gap-3">
                <div className="h-7 rounded-xl bg-[#d6d3cf] sm:h-8" style={{ width: `${(item.before / maxValue) * 100}%` }} />
                <span className="text-[0.68rem] font-semibold text-slate-600 sm:text-xs">{item.before.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-7 rounded-xl bg-[#0b6a33] sm:h-8" style={{ width: `${(item.after / maxValue) * 100}%` }} />
                <span className="text-[0.68rem] font-semibold text-[#0b6a33] sm:text-xs">{item.after.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
