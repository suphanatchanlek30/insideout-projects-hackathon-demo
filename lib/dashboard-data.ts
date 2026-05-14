import { createReadStream, readFileSync } from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline";
import { cache } from "react";

import type {
  AlertItem,
  BusinessImpactMetric,
  DashboardData,
  ForecastSeries,
  KpiCard,
  PromotionRecommendation,
  RecommendedOrderRow,
  RiskLevel,
  RiskTableRow,
  TopBarItem,
} from "@/types/dashboard";

const TARGET_STORE_ID = 3;
const LEAD_TIME_DAYS = 7;
const SAFETY_STOCK_DAYS = 2;
const FORECAST_DAYS = 14;
const OVERSTOCK_DAYS = 21;
const PROCUREMENT_COST_RATIO = 0.42;

interface StoreRow {
  store_id: number;
  neighborhood_type: string;
}

interface ProductRow {
  product_id: number;
  product_name: string;
  category: string;
  serve_type: string;
  base_price: number;
}

interface InventoryRow {
  product_id: number;
  date: string;
  units_sold: number;
  closing_stock: number;
}

interface ProductSummary {
  productId: number;
  productLabel: string;
  category: string;
  retailPrice: number;
  unitCost: number;
  currentStock: number;
  dailyUsage: number;
  daysCover: number;
  suggestedUnits: number;
  orderBy: string;
  riskLevel: RiskLevel;
  impactValue: number;
  excessUnits: number;
  excessValue: number;
}

const currencyFormatter = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
});

function getDataPath(fileName: string) {
  return path.join(process.cwd(), "data", fileName);
}

function titleCase(value: string) {
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ");
}

function parseDate(value: string) {
  return new Date(`${value}T00:00:00`);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getRiskLevel(daysCover: number): RiskLevel {
  if (daysCover <= 2) {
    return "high";
  }

  if (daysCover <= LEAD_TIME_DAYS) {
    return "medium";
  }

  return "low";
}

function formatOrderBy(lastDate: Date, daysCover: number) {
  if (daysCover <= LEAD_TIME_DAYS) {
    return "Today";
  }

  return dateFormatter.format(addDays(lastDate, Math.floor(daysCover - LEAD_TIME_DAYS)));
}

function parseStoreMap() {
  const file = readFileSync(getDataPath("STORE.csv"), "utf8").trim();
  const [, ...lines] = file.split(/\r?\n/);
  const stores = new Map<number, StoreRow>();

  for (const line of lines) {
    const [storeId, neighborhoodType] = line.split(",");
    stores.set(Number(storeId), {
      store_id: Number(storeId),
      neighborhood_type: neighborhoodType,
    });
  }

  return stores;
}

function parseProductMap() {
  const file = readFileSync(getDataPath("PRODUCT.csv"), "utf8").trim();
  const [, ...lines] = file.split(/\r?\n/);
  const products = new Map<number, ProductRow>();

  for (const line of lines) {
    const [productId, productName, category, serveType, basePrice] = line.split(",");
    products.set(Number(productId), {
      product_id: Number(productId),
      product_name: productName,
      category,
      serve_type: serveType,
      base_price: Number(basePrice),
    });
  }

  return products;
}

async function parseInventoryForStore(storeId: number) {
  const rowsByProduct = new Map<number, InventoryRow[]>();
  const dates = new Set<string>();
  const stream = createInterface({
    input: createReadStream(getDataPath("INVENTORY.csv")),
    crlfDelay: Infinity,
  });

  let isHeader = true;

  for await (const line of stream) {
    if (isHeader) {
      isHeader = false;
      continue;
    }

    const [, rowStoreId, productId, date, , , unitsSold, closingStock] = line.split(",");
    if (Number(rowStoreId) !== storeId) {
      continue;
    }

    const row: InventoryRow = {
      product_id: Number(productId),
      date,
      units_sold: Number(unitsSold),
      closing_stock: Number(closingStock),
    };

    dates.add(date);

    const existing = rowsByProduct.get(row.product_id) ?? [];
    existing.push(row);
    rowsByProduct.set(row.product_id, existing);
  }

  const sortedDates = Array.from(dates).sort((left, right) => left.localeCompare(right));

  for (const rows of rowsByProduct.values()) {
    rows.sort((left, right) => left.date.localeCompare(right.date));
  }

  return { rowsByProduct, sortedDates };
}

async function parsePromotionStats(storeId: number) {
  const byProduct = new Map<
    number,
    { promoTypes: Map<string, number>; discountTotal: number; count: number }
  >();
  const byType = new Map<string, number>();
  const stream = createInterface({
    input: createReadStream(getDataPath("PROMOTION.csv")),
    crlfDelay: Infinity,
  });

  let isHeader = true;

  for await (const line of stream) {
    if (isHeader) {
      isHeader = false;
      continue;
    }

    const [, , productId, rowStoreId, , , promoType, discountPct] = line.split(",");
    if (Number(rowStoreId) !== storeId) {
      continue;
    }

    const numericProductId = Number(productId);
    const current = byProduct.get(numericProductId) ?? {
      promoTypes: new Map<string, number>(),
      discountTotal: 0,
      count: 0,
    };

    current.count += 1;
    current.discountTotal += Number(discountPct);
    current.promoTypes.set(promoType, (current.promoTypes.get(promoType) ?? 0) + 1);
    byProduct.set(numericProductId, current);
    byType.set(promoType, (byType.get(promoType) ?? 0) + 1);
  }

  const fallbackPromoType =
    Array.from(byType.entries()).sort((left, right) => right[1] - left[1])[0]?.[0] ?? "ลดราคา";

  return { byProduct, fallbackPromoType };
}

function buildProductSummaries(
  rowsByProduct: Map<number, InventoryRow[]>,
  products: Map<number, ProductRow>,
  sortedDates: string[],
) {
  const lastDate = sortedDates[sortedDates.length - 1];
  const lastDateValue = parseDate(lastDate);
  const recentDates = new Set(sortedDates.slice(-FORECAST_DAYS));
  const summaries: ProductSummary[] = [];

  for (const [productId, rows] of rowsByProduct.entries()) {
    const product = products.get(productId);
    if (!product || rows.length === 0) {
      continue;
    }

    const latest = rows[rows.length - 1];
    const recentRows = rows.filter((row) => recentDates.has(row.date));
    const totalUsage = recentRows.reduce((sum, row) => sum + row.units_sold, 0);
    const dailyUsage = recentRows.length > 0 ? totalUsage / recentRows.length : 0;
    const normalizedUsage = dailyUsage > 0 ? dailyUsage : 0.1;
    const daysCover = latest.closing_stock / normalizedUsage;
    const targetStock = Math.ceil(normalizedUsage * (LEAD_TIME_DAYS + SAFETY_STOCK_DAYS));
    const suggestedUnits = Math.max(targetStock - latest.closing_stock, 0);
    const retailPrice = product.base_price;
    const unitCost = Math.round(retailPrice * PROCUREMENT_COST_RATIO);
    const shortfallBeforeDelivery = Math.max(
      Math.ceil(normalizedUsage * LEAD_TIME_DAYS - latest.closing_stock),
      0,
    );
    const healthyStock = Math.ceil(normalizedUsage * OVERSTOCK_DAYS);
    const excessUnits = Math.max(latest.closing_stock - healthyStock, 0);

    summaries.push({
      productId,
      productLabel: `${product.product_name} (${product.serve_type})`,
      category: product.category,
      retailPrice,
      unitCost,
      currentStock: latest.closing_stock,
      dailyUsage: normalizedUsage,
      daysCover,
      suggestedUnits,
      orderBy: formatOrderBy(lastDateValue, daysCover),
      riskLevel: getRiskLevel(daysCover),
      impactValue: shortfallBeforeDelivery * retailPrice,
      excessUnits,
      excessValue: excessUnits * unitCost,
    });
  }

  return { summaries, lastDate };
}

function buildTopBar(store: StoreRow, lastDate: string): TopBarItem[] {
  return [
    {
      label: "Store",
      value: `Store ${String(store.store_id).padStart(2, "0")} · ${titleCase(store.neighborhood_type)}`,
    },
    {
      label: "App Date",
      value: "14 May 2026",
    },
    {
      label: "Inventory Snapshot",
      value: dateFormatter.format(parseDate(lastDate)),
    },
    {
      label: "Lead Time",
      value: `${LEAD_TIME_DAYS} days`,
    },
  ];
}

function buildKpis(summaries: ProductSummary[]): KpiCard[] {
  const mustOrderToday = summaries.filter((item) => item.riskLevel === "high").length;
  const atRiskBeforeDelivery = summaries.filter(
    (item) => item.riskLevel === "high" || item.riskLevel === "medium",
  ).length;
  const avoidableWaste = summaries.reduce((sum, item) => sum + item.excessValue, 0);
  const lostSalesRisk = summaries.reduce((sum, item) => sum + item.impactValue, 0);

  return [
    {
      id: "must-order",
      label: "Must order today",
      value: `${mustOrderToday}`,
      detail: "items",
      tone: "red",
    },
    {
      id: "at-risk",
      label: "At-risk before delivery",
      value: `${atRiskBeforeDelivery}`,
      detail: "SKUs",
      tone: "amber",
    },
    {
      id: "avoidable-waste",
      label: "Avoidable waste",
      value: currencyFormatter.format(avoidableWaste),
      detail: "excess inventory value",
      tone: "green",
    },
    {
      id: "lost-sales",
      label: "Lost sales risk",
      value: currencyFormatter.format(lostSalesRisk),
      detail: "potential revenue loss",
      tone: "red",
    },
  ];
}

function buildAlerts(summaries: ProductSummary[]): AlertItem[] {
  const urgent = summaries
    .filter((item) => item.riskLevel === "high")
    .sort((left, right) => left.daysCover - right.daysCover)
    .slice(0, 2);
  const nearLeadTime = summaries
    .filter((item) => item.riskLevel === "medium")
    .sort((left, right) => left.daysCover - right.daysCover)[0];

  const alerts: AlertItem[] = urgent.map((item) => ({
    id: `urgent-${item.productId}`,
    tone: "red",
    title: `${item.productLabel} has ${numberFormatter.format(item.daysCover)} days of cover.`,
    description: `Daily usage is ${numberFormatter.format(item.dailyUsage)} units while current stock is ${item.currentStock} units.`,
    action: "Order today to keep the safety buffer intact.",
  }));

  if (nearLeadTime) {
    alerts.push({
      id: `lead-${nearLeadTime.productId}`,
      tone: "amber",
      title: `${nearLeadTime.productLabel} is approaching lead-time risk.`,
      description: `Projected cover is ${numberFormatter.format(nearLeadTime.daysCover)} days against a ${LEAD_TIME_DAYS}-day lead time.`,
      action: "Queue this item in the next replenishment cycle.",
    });
  }

  return alerts;
}

function buildRiskRows(summaries: ProductSummary[]): RiskTableRow[] {
  return summaries
    .filter((item) => item.dailyUsage > 0)
    .sort((left, right) => left.daysCover - right.daysCover)
    .slice(0, 8)
    .map((item) => ({
      id: `risk-${item.productId}`,
      productLabel: item.productLabel,
      category: item.category,
      currentStock: item.currentStock,
      dailyUsage: Number(item.dailyUsage.toFixed(1)),
      daysCover: Number(item.daysCover.toFixed(1)),
      orderBy: item.orderBy,
      riskLevel: item.riskLevel,
      impactValue: item.impactValue,
    }));
}

function buildForecast(summaries: ProductSummary[], lastDate: string) {
  const picked = summaries
    .filter((item) => item.dailyUsage > 0)
    .sort((left, right) => left.daysCover - right.daysCover)
    .slice(0, 3);
  const palette = ["#2563eb", "#ea580c", "#16a34a"];
  const startDate = parseDate(lastDate);

  const forecastDates = Array.from({ length: FORECAST_DAYS }, (_, index) =>
    shortDateFormatter.format(addDays(startDate, index)),
  );

  const forecastSeries: ForecastSeries[] = picked.map((item, index) => ({
    label: item.productLabel,
    color: palette[index] ?? "#64748b",
    values: Array.from({ length: FORECAST_DAYS }, (_, offset) =>
      Number(Math.max(item.currentStock - item.dailyUsage * offset, 0).toFixed(1)),
    ),
  }));

  return {
    forecastDates,
    forecastSeries,
    forecastSafetyStock: SAFETY_STOCK_DAYS,
  };
}

function buildRecommendedOrders(summaries: ProductSummary[]): RecommendedOrderRow[] {
  return summaries
    .filter((item) => item.suggestedUnits > 0)
    .sort((left, right) => right.impactValue - left.impactValue)
    .slice(0, 10)
    .map((item) => ({
      id: `order-${item.productId}`,
      productLabel: item.productLabel,
      category: item.category,
      currentStock: item.currentStock,
      dailyUsage: Number(item.dailyUsage.toFixed(1)),
      suggestedUnits: item.suggestedUnits,
      unitCost: item.unitCost,
      totalCost: item.suggestedUnits * item.unitCost,
      confidence: Math.max(65, Math.min(96, Math.round(85 - item.daysCover * 2))),
      rationale:
        item.riskLevel === "high"
          ? "High stockout risk before next delivery window."
          : "Restores coverage above lead time and safety stock.",
      status: "Pending",
    }));
}

function buildPromotionRecommendations(
  summaries: ProductSummary[],
  promotionStats: Awaited<ReturnType<typeof parsePromotionStats>>,
): PromotionRecommendation[] {
  return summaries
    .filter((item) => item.excessUnits > 0)
    .sort((left, right) => right.excessValue - left.excessValue)
    .slice(0, 4)
    .map((item) => {
      const stats = promotionStats.byProduct.get(item.productId);
      const promoType =
        stats &&
        Array.from(stats.promoTypes.entries()).sort((left, right) => right[1] - left[1])[0]?.[0];
      const averageDiscount = stats
        ? Math.round(stats.discountTotal / Math.max(stats.count, 1))
        : 15;

      return {
        id: `promo-${item.productId}`,
        productLabel: item.productLabel,
        promoType: promoType ?? promotionStats.fallbackPromoType,
        discountPct: averageDiscount,
        daysCover: Number(item.daysCover.toFixed(1)),
        expectedLiftPct: Math.min(35, Math.max(12, Math.round(item.daysCover / 2))),
        recoverableValue: Math.round(item.excessValue * 0.7),
        note: `Use ${averageDiscount}% ${promoType ?? promotionStats.fallbackPromoType} to accelerate sell-through on slow inventory.`,
      };
    });
}

function buildBusinessImpact(
  summaries: ProductSummary[],
  recommendedOrders: RecommendedOrderRow[],
  promotions: PromotionRecommendation[],
) {
  const wasteBefore = summaries.reduce((sum, item) => sum + item.excessValue, 0);
  const wasteAfter = Math.max(
    0,
    wasteBefore - promotions.reduce((sum, item) => sum + item.recoverableValue, 0),
  );
  const lostSalesBefore = summaries.reduce((sum, item) => sum + item.impactValue, 0);
  const lostSalesAfter = Math.max(
    0,
    lostSalesBefore - Math.round(recommendedOrders.reduce((sum, item) => sum + item.totalCost, 0) * 0.35),
  );
  const urgentBefore = summaries.filter((item) => item.riskLevel === "high").length;
  const urgentAfter = Math.max(0, urgentBefore - recommendedOrders.length);
  const serviceBefore =
    100 - (summaries.filter((item) => item.riskLevel !== "low").length / summaries.length) * 100;
  const serviceAfter = Math.min(99, serviceBefore + 18);

  const metrics: BusinessImpactMetric[] = [
    {
      id: "waste",
      label: "Avoidable waste",
      before: wasteBefore,
      withApp: wasteAfter,
      unit: "currency",
      positiveDirection: "down",
    },
    {
      id: "lost-sales",
      label: "Lost sales risk",
      before: lostSalesBefore,
      withApp: lostSalesAfter,
      unit: "currency",
      positiveDirection: "down",
    },
    {
      id: "urgent-skus",
      label: "Urgent SKUs",
      before: urgentBefore,
      withApp: urgentAfter,
      unit: "count",
      positiveDirection: "down",
    },
    {
      id: "service-level",
      label: "Service level",
      before: Number(serviceBefore.toFixed(1)),
      withApp: Number(serviceAfter.toFixed(1)),
      unit: "percent",
      positiveDirection: "up",
    },
  ];

  return {
    headlineValue: (wasteBefore - wasteAfter) + (lostSalesBefore - lostSalesAfter),
    headlineLabel: "Estimated monthly upside",
    metrics,
  };
}

export const getDashboardData = cache(async (): Promise<DashboardData> => {
  const stores = parseStoreMap();
  const products = parseProductMap();
  const store = stores.get(TARGET_STORE_ID);

  if (!store) {
    throw new Error(`Store ${TARGET_STORE_ID} not found in STORE.csv`);
  }

  const [{ rowsByProduct, sortedDates }, promotionStats] = await Promise.all([
    parseInventoryForStore(TARGET_STORE_ID),
    parsePromotionStats(TARGET_STORE_ID),
  ]);

  const { summaries, lastDate } = buildProductSummaries(rowsByProduct, products, sortedDates);
  const recommendedOrders = buildRecommendedOrders(summaries);
  const promotionRecommendations = buildPromotionRecommendations(summaries, promotionStats);

  return {
    storeLabel: `Store ${String(store.store_id).padStart(2, "0")} · ${titleCase(store.neighborhood_type)}`,
    neighborhoodLabel: titleCase(store.neighborhood_type),
    topBar: buildTopBar(store, lastDate),
    kpis: buildKpis(summaries),
    alerts: buildAlerts(summaries),
    ...buildForecast(summaries, lastDate),
    riskRows: buildRiskRows(summaries),
    recommendedOrders,
    promotionRecommendations,
    businessImpact: buildBusinessImpact(
      summaries,
      recommendedOrders,
      promotionRecommendations,
    ),
  };
});
