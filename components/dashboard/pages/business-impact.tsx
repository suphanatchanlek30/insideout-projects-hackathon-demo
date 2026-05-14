import { dashboardSnapshot } from "@/data/dashboard";
import { CompareBarChart } from "@/components/dashboard/charts/compare-bar-chart";
import { SectionHeader } from "@/components/dashboard/shared/section-header";

export function BusinessImpactPage() {
  const section = dashboardSnapshot.businessImpact;

  return (
    <section className="mt-4 space-y-3.5 sm:mt-5 sm:space-y-4">
      <SectionHeader title={section.title} subtitle={section.subtitle} />

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-3.5 xl:grid-cols-4">
        {section.metrics.map((metric) => (
          <article
            key={metric.id}
            className="rounded-[20px] border border-[#eadfce] bg-white p-3.5 shadow-[0_12px_30px_-28px_rgba(0,0,0,0.55)] sm:rounded-[24px] sm:p-4"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef6e8] text-base text-[#0e5a2a] ring-4 ring-[#f4f0e8] sm:h-12 sm:w-12 sm:text-lg">
                {metric.icon}
              </span>
              <div>
                <p className="text-[0.72rem] text-slate-500 sm:text-sm">{metric.label}</p>
                <p className="mt-1 text-[1.1rem] font-semibold text-[#173822] sm:mt-1.5 sm:text-[1.45rem]">{metric.value}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="grid gap-3.5 xl:grid-cols-[1.45fr_0.95fr]">
        <CompareBarChart items={section.compareBars} />

        <section className="rounded-[22px] border border-[#eadfce] bg-white p-3.5 shadow-[0_12px_30px_-28px_rgba(0,0,0,0.45)] sm:rounded-[26px] sm:p-4">
          <h3 className="text-[1.15rem] font-semibold text-[#173822] sm:text-[1.45rem]">Savings breakdown</h3>
          <div className="mt-3 divide-y divide-[#efe6d8]">
            {section.savingsList.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2.5 sm:py-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef6e8] text-[#0e5a2a] sm:h-10 sm:w-10">
                    {item.icon}
                  </span>
                  <span className="text-[0.78rem] text-slate-700 sm:text-sm">{item.label}</span>
                </div>
                <span className="text-[0.95rem] font-semibold text-[#18743a] sm:text-[1.2rem]">{item.value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-[22px] border border-[#eadfce] bg-white p-3.5 shadow-[0_12px_30px_-28px_rgba(0,0,0,0.45)] sm:rounded-[26px] sm:p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-y border-[#e8ddcc] bg-[#f7f2ea] text-[0.68rem] text-slate-500 sm:text-xs">
              <tr>
                <th className="px-3 py-2.5 font-medium sm:px-4 sm:py-3">Metric</th>
                <th className="px-3 py-2.5 font-medium sm:px-4 sm:py-3">Baseline (Historical)</th>
                <th className="px-3 py-2.5 font-medium sm:px-4 sm:py-3">With Co-pilot (Projected)</th>
                <th className="px-3 py-2.5 font-medium sm:px-4 sm:py-3">Difference</th>
              </tr>
            </thead>
            <tbody>
              {section.tableRows.map((row) => (
                <tr key={row.id} className="border-b border-[#f3ecdf] text-[0.76rem] text-slate-700 sm:text-sm">
                  <td className="px-3 py-2.5 font-semibold text-[#183b23] sm:px-4 sm:py-3">{row.label}</td>
                  <td className="px-3 py-2.5 sm:px-4 sm:py-3">{row.baseline}</td>
                  <td className="px-3 py-2.5 sm:px-4 sm:py-3">{row.projected}</td>
                  <td className={`px-3 py-2.5 font-semibold sm:px-4 sm:py-3 ${row.difference.startsWith("-") ? "text-[#1a7a3b]" : "text-[#1a7a3b]"}`}>
                    {row.difference}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
