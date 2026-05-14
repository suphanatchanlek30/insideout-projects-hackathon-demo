import { dashboardSnapshot } from "@/data/dashboard";
import { AlertCard } from "@/components/dashboard/cards/alert-card";
import { MetricCard } from "@/components/dashboard/cards/metric-card";
import { LineChart } from "@/components/dashboard/charts/line-chart";
import { SectionHeader } from "@/components/dashboard/shared/section-header";

const riskToneClass = {
  สูง: "bg-red-600 text-white",
  กลาง: "bg-amber-500 text-white",
  ต่ำ: "bg-[#37923b] text-white",
};

export function RiskCommandCenterPage() {
  const section = dashboardSnapshot.riskCommandCenter;

  return (
    <section className="mt-7 space-y-5">
      <SectionHeader title={section.title} subtitle={section.subtitle} />

      <div className="grid gap-4 xl:grid-cols-4">
        {section.kpis.map((card) => (
          <MetricCard key={card.id} card={card} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.35fr]">
        <div className="space-y-4">
          {section.alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>

        <section className="rounded-[30px] border border-[#eadfce] bg-white p-5">
          <h3 className="text-[1.9rem] font-semibold text-[#173822]">
            แนวโน้ม stock ของวัตถุดิบ 14 วันข้างหน้า
          </h3>
          <LineChart
            labels={section.chartLabels}
            series={section.chartSeries}
            safetyStockLabel={section.safetyStockLabel}
          />
        </section>
      </div>

      <section className="rounded-[30px] border border-[#eadfce] bg-white p-5">
        <h3 className="text-[1.9rem] font-semibold text-[#173822]">ภาพรวมวัตถุดิบที่มีความเสี่ยง</h3>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-y border-[#efe6d8] bg-[#faf7f2] text-sm text-slate-500">
              <tr>
                <th className="px-4 py-4 font-medium">วัตถุดิบ</th>
                <th className="px-4 py-4 font-medium">Current Stock</th>
                <th className="px-4 py-4 font-medium">Daily Usage</th>
                <th className="px-4 py-4 font-medium">Days Cover</th>
                <th className="px-4 py-4 font-medium">Order-by</th>
                <th className="px-4 py-4 font-medium">Risk</th>
                <th className="px-4 py-4 font-medium">Impact</th>
              </tr>
            </thead>
            <tbody>
              {section.riskItems.map((item) => (
                <tr key={item.id} className="border-b border-[#f3ecdf] text-base text-slate-700">
                  <td className="px-4 py-4 font-semibold text-[#183b23]">{item.ingredient}</td>
                  <td className="px-4 py-4">{item.currentStock}</td>
                  <td className="px-4 py-4">{item.dailyUsage}</td>
                  <td className="px-4 py-4 font-semibold">{item.daysCover}</td>
                  <td className="px-4 py-4">{item.orderBy}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${riskToneClass[item.risk]}`}>
                      {item.risk}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-semibold text-red-600">{item.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
