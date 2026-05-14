import { dashboardSnapshot } from "@/data/dashboard";
import { WaterfallChart } from "@/components/dashboard/charts/waterfall-chart";
import { SectionHeader } from "@/components/dashboard/shared/section-header";
import { formatCurrency } from "@/lib/format";

export function PromotionRecommendationPage() {
  const section = dashboardSnapshot.promotionRecommendation;

  return (
    <section className="mt-7 space-y-5">
      <SectionHeader title={section.title} subtitle={section.subtitle} />

      <div className="grid gap-5 xl:grid-cols-[1.55fr_0.95fr]">
        <div className="space-y-4">
          {section.items.map((item) => (
            <article
              key={item.id}
              className="grid gap-4 rounded-[30px] border border-[#eadfce] bg-white p-5 lg:grid-cols-[auto_1.1fr_1fr_auto]"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0f6a33] text-lg font-semibold text-white">
                  {item.rank}
                </span>
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#f6f1e7] text-lg font-semibold text-[#2d6f3e]">
                  {item.imageLabel}
                </div>
              </div>

              <div>
                <h3 className="text-[1.9rem] font-semibold text-[#173822]">{item.title}</h3>
                <p className="mt-2 text-base text-slate-500">{item.schedule}</p>
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#2c7a42]">
                  Reason
                </p>
                <p className="mt-2 text-lg leading-8 text-slate-600">{item.reason}</p>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-x border-[#eee3d5] px-0 lg:px-6">
                <MetricText label="Expected revenue uplift" value={formatCurrency(item.revenueUplift)} positive />
                <MetricText label="Discount cost" value={formatCurrency(item.discountCost)} negative />
                <MetricText label="Ingredient cost" value={formatCurrency(item.ingredientCost)} negative />
                <MetricText label="Avoided waste" value={formatCurrency(item.avoidedWaste)} positive />
              </div>

              <div className="rounded-[24px] bg-[#f5f7ef] px-6 py-5 text-right">
                <p className="text-base text-slate-500">Net profit impact</p>
                <p className="mt-4 text-[2rem] font-semibold text-[#26853f]">
                  +{formatCurrency(item.netProfitImpact)}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="space-y-4">
          <WaterfallChart bars={section.waterfallBars} title={section.waterfallTitle} />
          <div className="rounded-[26px] border border-[#eadfce] bg-[#f5f7ef] px-6 py-5">
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium text-slate-600">{section.totalImpactLabel}</p>
              <p className="text-[2rem] font-semibold text-[#26853f]">{section.totalImpactValue}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="rounded-2xl bg-[#09552a] px-6 py-4 text-lg font-semibold text-white">
              Apply Promotion
            </button>
            <button className="rounded-2xl border border-[#e2d7c8] bg-white px-6 py-4 text-lg font-semibold text-slate-700">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricText({
  label,
  value,
  positive,
  negative,
}: {
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
}) {
  const toneClass = positive ? "text-[#26853f]" : negative ? "text-[#d94b40]" : "text-slate-800";

  return (
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 text-[1.65rem] font-semibold ${toneClass}`}>
        {positive ? "+" : negative ? "-" : ""}
        {value}
      </p>
    </div>
  );
}
