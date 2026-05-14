import { useMemo, useState } from "react";

import { dashboardSnapshot } from "@/data/dashboard";
import { MetricCard } from "@/components/dashboard/cards/metric-card";
import { SectionHeader } from "@/components/dashboard/shared/section-header";
import { formatCurrency } from "@/lib/format";

export function AIRecommendedOrderPage() {
  const section = dashboardSnapshot.aiRecommendedOrder;
  const [items, setItems] = useState(section.items.map((item) => ({ ...item, selected: true })));
  const [managerReason, setManagerReason] = useState(section.managerReasonOptions[0]);

  const selectedItems = useMemo(
    () => items.filter((item) => item.selected && !item.approved),
    [items],
  );

  const selectedCost = selectedItems.reduce((sum, item) => sum + item.estimatedCost, 0);
  const approvedCount = items.filter((item) => item.approved).length;

  function toggleItem(id: string) {
    setItems((current) =>
      current.map((item) =>
        item.id === id && !item.approved ? { ...item, selected: !item.selected } : item,
      ),
    );
  }

  function approveOrders() {
    if (selectedItems.length === 0) {
      return;
    }

    const ids = new Set(selectedItems.map((item) => item.id));
    setItems((current) =>
      current.map((item) =>
        ids.has(item.id) ? { ...item, approved: true, selected: false } : item,
      ),
    );
  }

  const summaryCards = [
    { ...section.summaryCards[0], value: formatCurrency(selectedCost) },
    {
      ...section.summaryCards[1],
      value: `${selectedItems.length} รายการ`,
      description: `อนุมัติแล้ว ${approvedCount} รายการ`,
    },
    ...section.summaryCards.slice(2),
  ];

  return (
    <section className="mt-7 space-y-5">
      <SectionHeader title={section.title} subtitle={section.subtitle} />

      <div className="grid gap-4 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <MetricCard key={card.id} card={card} />
        ))}
      </div>

      <section className="rounded-[30px] border border-[#eadfce] bg-white p-5">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-y border-[#efe6d8] bg-[#faf7f2] text-sm text-slate-500">
              <tr>
                <th className="px-4 py-4 font-medium">Approve</th>
                <th className="px-4 py-4 font-medium">Ingredient</th>
                <th className="px-4 py-4 font-medium">Current Stock</th>
                <th className="px-4 py-4 font-medium">Daily Usage</th>
                <th className="px-4 py-4 font-medium">Days Cover</th>
                <th className="px-4 py-4 font-medium">Order-by</th>
                <th className="px-4 py-4 font-medium">Arrival</th>
                <th className="px-4 py-4 font-medium">MOQ</th>
                <th className="px-4 py-4 font-medium">Recommended Qty</th>
                <th className="px-4 py-4 font-medium">Estimated Cost</th>
                <th className="px-4 py-4 font-medium">Reason</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-[#f3ecdf] text-base text-slate-700">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={Boolean(item.selected)}
                      disabled={Boolean(item.approved)}
                      onChange={() => toggleItem(item.id)}
                      className="h-5 w-5 rounded border-slate-300 accent-[#0d6933]"
                    />
                  </td>
                  <td className="px-4 py-4 font-semibold text-[#183b23]">{item.ingredient}</td>
                  <td className="px-4 py-4">{item.currentStock}</td>
                  <td className="px-4 py-4">{item.dailyUsage}</td>
                  <td className="px-4 py-4 font-semibold text-[#e98a22]">{item.daysCover}</td>
                  <td className="px-4 py-4 text-[#19723a]">{item.orderBy}</td>
                  <td className="px-4 py-4">{item.arrival}</td>
                  <td className="px-4 py-4">{item.moq}</td>
                  <td className="px-4 py-4">
                    <div className="inline-flex rounded-2xl border border-[#e6dccf] px-4 py-2">
                      {item.recommendedQty}
                    </div>
                  </td>
                  <td className="px-4 py-4">{formatCurrency(item.estimatedCost)}</td>
                  <td className="px-4 py-4">
                    <div className="max-w-[12rem]">
                      <p>{item.reason}</p>
                      {item.approved ? (
                        <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                          Approved
                        </span>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_0.95fr]">
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={approveOrders}
              className="rounded-2xl bg-[#09552a] px-8 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-[#074622]"
            >
              Approve Selected Orders
            </button>
            <button
              type="button"
              className="rounded-2xl border border-[#e2d7c8] bg-white px-8 py-4 text-lg font-semibold text-slate-700"
            >
              Export to PDF
            </button>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-500">Manager reason (optional)</span>
            <select
              value={managerReason}
              onChange={(event) => setManagerReason(event.target.value)}
              className="rounded-2xl border border-[#e2d7c8] bg-white px-4 py-4 text-base text-slate-700 outline-none"
            >
              {section.managerReasonOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>
    </section>
  );
}
