import type { CardTone, KpiCardData } from "@/types/dashboard";

const toneStyles: Record<CardTone, string> = {
  danger: "bg-red-50 text-red-600 border-red-100",
  warning: "bg-amber-50 text-amber-600 border-amber-100",
  success: "bg-emerald-50 text-emerald-700 border-emerald-100",
  neutral: "bg-[#eef6e8] text-[#0d5b29] border-[#dcebd2]",
};

export function MetricCard({ card }: { card: KpiCardData }) {
  return (
    <article className="rounded-[22px] border border-[#eadfce] bg-white p-3.5 shadow-[0_12px_30px_-28px_rgba(0,0,0,0.6)] sm:rounded-[26px] sm:p-4.5">
      <div className="flex items-start gap-3 sm:gap-4">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-base font-semibold sm:h-14 sm:w-14 sm:text-xl ${toneStyles[card.tone]}`}
        >
          {card.icon}
        </span>
        <div>
          <p className="text-[0.78rem] text-slate-500 sm:text-sm">{card.label}</p>
          <p className="mt-1 text-[1.2rem] font-semibold leading-none text-[#173822] sm:text-[1.5rem]">{card.value}</p>
          <p className="mt-1.5 text-[0.68rem] leading-4 text-slate-500 sm:mt-2 sm:text-xs sm:leading-5">{card.description}</p>
        </div>
      </div>
    </article>
  );
}
