import { formatCurrency } from "@/lib/format";
import type { WaterfallBar } from "@/types/dashboard";

export function WaterfallChart({ bars, title }: { bars: WaterfallBar[]; title: string }) {
  const chartMax = Math.max(...bars.map((bar) => Math.abs(bar.value)), 1000);

  return (
    <section className="rounded-[22px] border border-[#eadfce] bg-white p-3.5 sm:rounded-[26px] sm:p-4">
      <h3 className="text-[1.15rem] font-semibold text-[#173822] sm:text-[1.45rem]">{title}</h3>
      <div className="mt-3.5 grid gap-3.5 sm:mt-4 sm:gap-4">
        {bars.map((bar) => {
          const widthPercent = `${Math.max((Math.abs(bar.value) / chartMax) * 100, 20)}%`;
          const toneClass =
            bar.tone === "negative"
              ? "bg-[#d94b40]"
              : bar.tone === "total"
                ? "bg-[#2a8f49]"
                : "bg-[#31914a]";

          return (
            <div key={bar.label} className="grid grid-cols-[1fr_2.3fr_auto] items-center gap-3 sm:grid-cols-[1.2fr_3fr_auto] sm:gap-4">
              <p className="text-[0.72rem] leading-5 text-slate-600 sm:text-sm">{bar.label}</p>
              <div className="h-9 rounded-xl bg-[#f4eee4] p-1 sm:h-11">
                <div className={`h-full rounded-[0.8rem] ${toneClass}`} style={{ width: widthPercent }} />
              </div>
              <p className={`text-[0.78rem] font-semibold sm:text-base ${bar.value < 0 ? "text-[#d94b40]" : "text-[#19723a]"}`}>
                {bar.value < 0 ? "-" : "+"}
                {formatCurrency(Math.abs(bar.value))}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
