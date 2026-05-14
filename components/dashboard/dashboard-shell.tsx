"use client";

import { useMemo, useState } from "react";

import type {
  AlertItem,
  DashboardData,
  DashboardPage,
  KpiCard,
  PromotionRecommendation,
  RecommendedOrderRow,
  RiskLevel,
  RiskTableRow,
} from "@/types/dashboard";

type OrderRowState = RecommendedOrderRow & { selected?: boolean };

const currencyFormatter = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

const sidebarItems: Array<{ id: DashboardPage; label: string; shortLabel: string }> = [
  { id: "risk-command-center", label: "Risk Command Center", shortLabel: "Risk" },
  { id: "ai-recommended-order", label: "AI Recommended Order", shortLabel: "Order" },
  {
    id: "promotion-recommendation",
    label: "Promotion Recommendation",
    shortLabel: "Promotion",
  },
  { id: "business-impact", label: "Business Impact", shortLabel: "Impact" },
];

const toneStyles: Record<KpiCard["tone"], string> = {
  red: "border-red-100 bg-red-50/80 text-red-700",
  amber: "border-amber-100 bg-amber-50/80 text-amber-700",
  green: "border-emerald-100 bg-emerald-50/80 text-emerald-700",
  slate: "border-slate-200 bg-white text-slate-700",
};

const riskStyles: Record<RiskLevel, string> = {
  high: "bg-red-100 text-red-700 ring-1 ring-inset ring-red-200",
  medium: "bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200",
  low: "bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-200",
};

export function DashboardShell({ data }: { data: DashboardData }) {
  const [activePage, setActivePage] = useState<DashboardPage>("risk-command-center");
  const [orders, setOrders] = useState<OrderRowState[]>(data.recommendedOrders);

  const selectedOrders = useMemo(
    () => orders.filter((item) => item.status === "Pending" && item.selected),
    [orders],
  );

  const selectedCost = selectedOrders.reduce((sum, item) => sum + item.totalCost, 0);

  function toggleOrderSelection(id: string) {
    setOrders((current) =>
      current.map((item) =>
        item.id === id && item.status === "Pending"
          ? { ...item, selected: !item.selected }
          : item,
      ),
    );
  }

  function approveSelectedOrders() {
    if (selectedOrders.length === 0) {
      return;
    }

    const selectedIds = new Set(selectedOrders.map((item) => item.id));
    setOrders((current) =>
      current.map((item) =>
        selectedIds.has(item.id) ? { ...item, status: "Approved", selected: false } : item,
      ),
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(28,84,45,0.08),_transparent_28%),linear-gradient(180deg,_#f7f3ea_0%,_#f5f1e8_55%,_#f2ece2_100%)] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="relative overflow-hidden bg-[linear-gradient(180deg,_#0d441f_0%,_#0a3319_55%,_#082713_100%)] px-5 py-6 text-white">
          <div className="absolute inset-x-0 bottom-0 h-52 bg-[radial-gradient(circle_at_bottom_left,_rgba(134,239,172,0.18),_transparent_55%)]" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-center gap-3 border-b border-white/10 pb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/8 ring-1 ring-white/10">
                <span className="text-2xl">🌿</span>
              </div>
              <div>
                <p className="font-serif text-3xl leading-none">Cafe Amazon AI</p>
                <p className="mt-1 text-sm text-emerald-100/80">Replenishment Co-pilot</p>
              </div>
            </div>

            <nav className="mt-8 space-y-2">
              {sidebarItems.map((item, index) => {
                const isActive = item.id === activePage;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActivePage(item.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                      isActive
                        ? "bg-emerald-400/16 text-white shadow-[inset_3px_0_0_0_rgba(134,239,172,0.9)] ring-1 ring-emerald-300/20"
                        : "text-emerald-50/80 hover:bg-white/6 hover:text-white"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold ${
                        isActive ? "bg-emerald-200/15" : "bg-white/6"
                      }`}
                    >
                      0{index + 1}
                    </div>
                    <div>
                      <p className="text-base font-semibold">{item.label}</p>
                      <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/55">
                        {item.shortLabel}
                      </p>
                    </div>
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-100/60">
                Prototype Scope
              </p>
              <p className="mt-3 text-sm leading-6 text-emerald-50/75">
                Single-page control center with four business views. Logic is driven by the
                local CSV dataset and optimized for manager demo flow.
              </p>
            </div>
          </div>
        </aside>

        <main className="px-4 py-4 md:px-6 md:py-5 lg:px-7 lg:py-6">
          <div className="rounded-[30px] border border-white/80 bg-white/80 p-4 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur md:p-5 lg:p-6">
            <TopBar items={data.topBar} />

            {activePage === "risk-command-center" ? (
              <RiskCommandCenter data={data} />
            ) : null}

            {activePage === "ai-recommended-order" ? (
              <RecommendedOrderView
                orders={orders}
                onToggle={toggleOrderSelection}
                onApprove={approveSelectedOrders}
                selectedCount={selectedOrders.length}
                selectedCost={selectedCost}
              />
            ) : null}

            {activePage === "promotion-recommendation" ? (
              <PromotionRecommendationView recommendations={data.promotionRecommendations} />
            ) : null}

            {activePage === "business-impact" ? (
              <BusinessImpactView data={data.businessImpact} />
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}

function TopBar({ items }: { items: DashboardData["topBar"] }) {
  return (
    <div className="grid gap-3 rounded-[28px] border border-[#ebe3d6] bg-[#fcfaf6] p-3 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-[#efe7db] bg-white px-4 py-3 shadow-sm"
        >
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
          <p className="mt-2 text-base font-semibold text-slate-900">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

function RiskCommandCenter({ data }: { data: DashboardData }) {
  return (
    <section className="mt-6">
      <SectionHeading
        eyebrow="Risk Overview"
        title="Today’s Risk Command Center"
        description="This is the first page a store manager should open. It immediately clarifies what needs action based on the latest inventory snapshot."
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.kpis.map((card) => (
          <KpiMetricCard key={card.id} card={card} />
        ))}
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[0.95fr_1.35fr]">
        <div className="space-y-4 rounded-[28px] border border-[#efe5d8] bg-[linear-gradient(180deg,_rgba(255,255,255,0.95),_rgba(252,246,242,0.9))] p-5 shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Alerts</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              Action required before next delivery
            </h3>
          </div>
          {data.alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>

        <div className="rounded-[28px] border border-[#efe5d8] bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-2 border-b border-[#f2eadf] pb-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Forecast</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                Projected product stock, next 14 days
              </h3>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              {data.forecastSeries.map((series) => (
                <div key={series.label} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: series.color }}
                  />
                  <span>{series.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <span className="h-px w-5 border-t-2 border-dashed border-red-400" />
                <span>Safety stock</span>
              </div>
            </div>
          </div>
          <ProjectedStockChart
            dates={data.forecastDates}
            series={data.forecastSeries}
            safetyStock={data.forecastSafetyStock}
          />
        </div>
      </div>

      <div className="mt-5 rounded-[28px] border border-[#efe5d8] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 border-b border-[#f2eadf] pb-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Risk Table</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">Ingredient risk overview</h3>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            Prioritized by lowest days of cover. This table is also the source used for the
            recommended order page.
          </p>
        </div>
        <RiskTable rows={data.riskRows} />
      </div>
    </section>
  );
}

function RecommendedOrderView({
  orders,
  selectedCount,
  selectedCost,
  onToggle,
  onApprove,
}: {
  orders: OrderRowState[];
  selectedCount: number;
  selectedCost: number;
  onToggle: (id: string) => void;
  onApprove: () => void;
}) {
  const approvedCount = orders.filter((item) => item.status === "Approved").length;

  return (
    <section className="mt-6">
      <SectionHeading
        eyebrow="Ordering"
        title="AI Recommended Order"
        description="Core product view for procurement decisions. Select the recommended lines, total the cost, and approve without sending anything to a backend."
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-[#efe5d8] bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Approval Basket</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                Select lines and approve in one step
              </h3>
            </div>
            <button
              type="button"
              onClick={onApprove}
              className="inline-flex items-center justify-center rounded-2xl bg-[#124c26] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/10 transition hover:bg-[#0f3f20]"
            >
              Approve selected
            </button>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full divide-y divide-[#efe5d8] text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="py-3 pr-4 font-medium">Pick</th>
                  <th className="py-3 pr-4 font-medium">Product</th>
                  <th className="py-3 pr-4 font-medium">Current</th>
                  <th className="py-3 pr-4 font-medium">Daily Usage</th>
                  <th className="py-3 pr-4 font-medium">Suggested</th>
                  <th className="py-3 pr-4 font-medium">Cost</th>
                  <th className="py-3 pr-4 font-medium">Confidence</th>
                  <th className="py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5eee3]">
                {orders.map((item) => (
                  <tr key={item.id} className="align-top">
                    <td className="py-4 pr-4">
                      <input
                        type="checkbox"
                        checked={Boolean(item.selected)}
                        disabled={item.status === "Approved"}
                        onChange={() => onToggle(item.id)}
                        className="h-4 w-4 rounded border-slate-300 text-[#124c26] focus:ring-[#124c26]"
                      />
                    </td>
                    <td className="py-4 pr-4">
                      <p className="font-semibold text-slate-900">{item.productLabel}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.rationale}</p>
                    </td>
                    <td className="py-4 pr-4">{item.currentStock}</td>
                    <td className="py-4 pr-4">{numberFormatter.format(item.dailyUsage)}</td>
                    <td className="py-4 pr-4">{item.suggestedUnits}</td>
                    <td className="py-4 pr-4">{currencyFormatter.format(item.totalCost)}</td>
                    <td className="py-4 pr-4">{item.confidence}%</td>
                    <td className="py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status === "Approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <InfoCard
            eyebrow="Current Selection"
            title={`${selectedCount} line${selectedCount === 1 ? "" : "s"}`}
            body={`Estimated purchase value ${currencyFormatter.format(selectedCost)}`}
          />
          <InfoCard
            eyebrow="Approved"
            title={`${approvedCount} line${approvedCount === 1 ? "" : "s"} approved`}
            body="Approved rows are locked to simulate a completed workflow without a real backend."
          />
          <InfoCard
            eyebrow="Logic"
            title="Lead time + safety stock"
            body="Suggested quantity restores nine days of coverage using the last 14 days of observed product usage."
          />
        </div>
      </div>
    </section>
  );
}

function PromotionRecommendationView({
  recommendations,
}: {
  recommendations: PromotionRecommendation[];
}) {
  const totalRecovery = recommendations.reduce((sum, item) => sum + item.recoverableValue, 0);

  return (
    <section className="mt-6">
      <SectionHeading
        eyebrow="Waste Reduction"
        title="Promotion Recommendation"
        description="This page shows that AI does more than replenishment. It also identifies slow-moving stock and proposes profitable promotion mechanics."
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {recommendations.map((item) => (
            <div
              key={item.id}
              className="rounded-[28px] border border-[#efe5d8] bg-white p-5 shadow-sm"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{item.promoType}</p>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">{item.productLabel}</h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <StatPill label="Days cover" value={`${numberFormatter.format(item.daysCover)} days`} />
                <StatPill label="Discount" value={`${item.discountPct}%`} />
                <StatPill label="Expected lift" value={`${item.expectedLiftPct}%`} />
                <StatPill
                  label="Recoverable"
                  value={currencyFormatter.format(item.recoverableValue)}
                />
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{item.note}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <InfoCard
            eyebrow="Waste Recovery"
            title={currencyFormatter.format(totalRecovery)}
            body="Estimated inventory value that can be recovered with targeted promotional mechanics."
          />
          <InfoCard
            eyebrow="Pitch Angle"
            title="AI links inventory to demand"
            body="Use this page to frame the system as a profit engine, not only an ordering assistant."
          />
        </div>
      </div>
    </section>
  );
}

function BusinessImpactView({ data }: { data: DashboardData["businessImpact"] }) {
  return (
    <section className="mt-6">
      <SectionHeading
        eyebrow="Outcome"
        title="Business Impact"
        description="Before app vs with app. This is the closing page of the pitch where benefits are translated into THB and operational improvement."
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[28px] border border-[#efe5d8] bg-[#124c26] p-6 text-white shadow-sm">
          <p className="text-xs uppercase tracking-[0.28em] text-emerald-100/70">Headline</p>
          <h3 className="mt-3 text-4xl font-semibold">
            {currencyFormatter.format(data.headlineValue)}
          </h3>
          <p className="mt-3 text-base text-emerald-50/85">{data.headlineLabel}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {data.metrics.map((metric) => {
            const delta =
              metric.positiveDirection === "down"
                ? metric.before - metric.withApp
                : metric.withApp - metric.before;

            return (
              <div
                key={metric.id}
                className="rounded-[28px] border border-[#efe5d8] bg-white p-5 shadow-sm"
              >
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{metric.label}</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-[#f7f3ec] p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Before app</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                      {formatMetricValue(metric.before, metric.unit)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-emerald-700">
                      With app
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-emerald-800">
                      {formatMetricValue(metric.withApp, metric.unit)}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-600">
                  Improvement:{" "}
                  <span className="font-semibold text-emerald-700">
                    {formatMetricValue(delta, metric.unit)}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{eyebrow}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#173722]">{title}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
}

function KpiMetricCard({ card }: { card: KpiCard }) {
  return (
    <div className="rounded-[28px] border border-[#efe5d8] bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${toneStyles[card.tone]}`}
        >
          <span className="text-lg font-semibold">{card.value.split(" ")[0]}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{card.label}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{card.value}</p>
          <p className="mt-1 text-sm text-slate-500">{card.detail}</p>
        </div>
      </div>
    </div>
  );
}

function AlertCard({ alert }: { alert: AlertItem }) {
  const styles =
    alert.tone === "red"
      ? "border-red-100 bg-red-50/80"
      : "border-amber-100 bg-amber-50/85";

  return (
    <div className={`rounded-[24px] border p-4 ${styles}`}>
      <p className="text-lg font-semibold text-slate-900">{alert.title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{alert.description}</p>
      <p className="mt-3 text-base font-semibold text-[#c2410c]">{alert.action}</p>
    </div>
  );
}

function ProjectedStockChart({
  dates,
  series,
  safetyStock,
}: {
  dates: string[];
  series: DashboardData["forecastSeries"];
  safetyStock: number;
}) {
  const width = 860;
  const height = 320;
  const padding = { top: 24, right: 20, bottom: 44, left: 48 };
  const maxValue = Math.max(1, safetyStock, ...series.flatMap((item) => item.values));
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  function x(index: number) {
    return padding.left + (index / Math.max(dates.length - 1, 1)) * innerWidth;
  }

  function y(value: number) {
    return padding.top + innerHeight - (value / maxValue) * innerHeight;
  }

  return (
    <div className="mt-5 overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[760px]">
        {[0, 0.25, 0.5, 0.75, 1].map((step) => {
          const value = maxValue * step;

          return (
            <g key={step}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={y(value)}
                y2={y(value)}
                stroke="#e9dfd0"
                strokeWidth="1"
              />
              <text
                x={padding.left - 10}
                y={y(value) + 4}
                textAnchor="end"
                fontSize="11"
                fill="#64748b"
              >
                {Math.round(value)}
              </text>
            </g>
          );
        })}

        <line
          x1={padding.left}
          x2={width - padding.right}
          y1={y(safetyStock)}
          y2={y(safetyStock)}
          stroke="#ef4444"
          strokeDasharray="8 6"
          strokeWidth="2"
        />

        {series.map((item) => (
          <g key={item.label}>
            <polyline
              fill="none"
              stroke={item.color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={item.values.map((value, index) => `${x(index)},${y(value)}`).join(" ")}
            />
            {item.values.map((value, index) => (
              <circle
                key={`${item.label}-${dates[index]}`}
                cx={x(index)}
                cy={y(value)}
                r="3.5"
                fill={item.color}
              />
            ))}
          </g>
        ))}

        {dates.map((date, index) => (
          <text
            key={date}
            x={x(index)}
            y={height - 16}
            textAnchor="middle"
            fontSize="11"
            fill="#64748b"
          >
            {date}
          </text>
        ))}
      </svg>
    </div>
  );
}

function RiskTable({ rows }: { rows: RiskTableRow[] }) {
  return (
    <div className="mt-5 overflow-x-auto">
      <table className="min-w-full divide-y divide-[#efe5d8] text-left text-sm">
        <thead className="text-slate-500">
          <tr>
            <th className="py-3 pr-4 font-medium">Product</th>
            <th className="py-3 pr-4 font-medium">Category</th>
            <th className="py-3 pr-4 font-medium">Current Stock</th>
            <th className="py-3 pr-4 font-medium">Daily Usage</th>
            <th className="py-3 pr-4 font-medium">Days Cover</th>
            <th className="py-3 pr-4 font-medium">Order-by</th>
            <th className="py-3 pr-4 font-medium">Risk</th>
            <th className="py-3 font-medium">Impact</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f5eee3]">
          {rows.map((row) => (
            <tr key={row.id} className="align-top">
              <td className="py-4 pr-4">
                <p className="font-semibold text-slate-900">{row.productLabel}</p>
              </td>
              <td className="py-4 pr-4 text-slate-600">{row.category}</td>
              <td className="py-4 pr-4">{row.currentStock}</td>
              <td className="py-4 pr-4">{numberFormatter.format(row.dailyUsage)}</td>
              <td className="py-4 pr-4 font-semibold">{numberFormatter.format(row.daysCover)}</td>
              <td className="py-4 pr-4">{row.orderBy}</td>
              <td className="py-4 pr-4">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    riskStyles[row.riskLevel]
                  }`}
                >
                  {row.riskLevel}
                </span>
              </td>
              <td className="py-4 font-semibold text-red-600">
                {currencyFormatter.format(row.impactValue)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InfoCard({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[28px] border border-[#efe5d8] bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{eyebrow}</p>
      <h3 className="mt-3 text-2xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#f7f3ec] px-4 py-3">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-2 text-base font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function formatMetricValue(value: number, unit: "currency" | "percent" | "count") {
  if (unit === "currency") {
    return currencyFormatter.format(value);
  }

  if (unit === "percent") {
    return `${numberFormatter.format(value)}%`;
  }

  return `${Math.round(value)}`;
}
