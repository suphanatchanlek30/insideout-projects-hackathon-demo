export type DashboardPage =
  | "risk-command-center"
  | "ai-recommended-order"
  | "promotion-recommendation"
  | "business-impact";

export type RiskLevel = "high" | "medium" | "low";

export interface TopBarItem {
  label: string;
  value: string;
}

export interface KpiCard {
  id: string;
  label: string;
  value: string;
  detail: string;
  tone: "red" | "amber" | "green" | "slate";
}

export interface AlertItem {
  id: string;
  tone: "red" | "amber";
  title: string;
  description: string;
  action: string;
}

export interface ForecastSeries {
  label: string;
  color: string;
  values: number[];
}

export interface RiskTableRow {
  id: string;
  productLabel: string;
  category: string;
  currentStock: number;
  dailyUsage: number;
  daysCover: number;
  orderBy: string;
  riskLevel: RiskLevel;
  impactValue: number;
}

export interface RecommendedOrderRow {
  id: string;
  productLabel: string;
  category: string;
  currentStock: number;
  dailyUsage: number;
  suggestedUnits: number;
  unitCost: number;
  totalCost: number;
  confidence: number;
  rationale: string;
  status: "Pending" | "Approved";
}

export interface PromotionRecommendation {
  id: string;
  productLabel: string;
  promoType: string;
  discountPct: number;
  daysCover: number;
  expectedLiftPct: number;
  recoverableValue: number;
  note: string;
}

export interface BusinessImpactMetric {
  id: string;
  label: string;
  before: number;
  withApp: number;
  unit: "currency" | "percent" | "count";
  positiveDirection: "up" | "down";
}

export interface BusinessImpactSummary {
  headlineValue: number;
  headlineLabel: string;
  metrics: BusinessImpactMetric[];
}

export interface DashboardData {
  storeLabel: string;
  neighborhoodLabel: string;
  topBar: TopBarItem[];
  kpis: KpiCard[];
  alerts: AlertItem[];
  forecastDates: string[];
  forecastSeries: ForecastSeries[];
  forecastSafetyStock: number;
  riskRows: RiskTableRow[];
  recommendedOrders: RecommendedOrderRow[];
  promotionRecommendations: PromotionRecommendation[];
  businessImpact: BusinessImpactSummary;
}
