export type DashboardPageKey =
  | "risk-command-center"
  | "ai-recommended-order"
  | "promotion-recommendation"
  | "business-impact";

export type CardTone = "danger" | "warning" | "success" | "neutral";
export type RiskLevel = "สูง" | "กลาง" | "ต่ำ";

export interface SidebarItem {
  key: DashboardPageKey;
  label: string;
  icon: string;
}

export interface TopBarItem {
  label: string;
  value: string;
  subvalue?: string;
  icon: string;
}

export interface KpiCardData {
  id: string;
  label: string;
  value: string;
  description: string;
  icon: string;
  tone: CardTone;
}

export interface AlertCardData {
  id: string;
  title: string;
  description: string;
  actionText: string;
  tone: "red" | "amber";
}

export interface LineSeries {
  label: string;
  color: string;
  values: number[];
}

export interface RiskItem {
  id: string;
  ingredient: string;
  currentStock: string;
  dailyUsage: string;
  daysCover: string;
  orderBy: string;
  risk: RiskLevel;
  impact: string;
}

export interface OrderItem {
  id: string;
  ingredient: string;
  currentStock: string;
  dailyUsage: string;
  daysCover: string;
  orderBy: string;
  arrival: string;
  moq: string;
  recommendedQty: string;
  estimatedCost: number;
  reason: string;
  approved?: boolean;
}

export interface PromotionItem {
  id: string;
  rank: number;
  title: string;
  schedule: string;
  reason: string;
  revenueUplift: number;
  discountCost: number;
  ingredientCost: number;
  avoidedWaste: number;
  netProfitImpact: number;
  imageLabel: string;
}

export interface WaterfallBar {
  label: string;
  value: number;
  tone: "positive" | "negative" | "total";
}

export interface BusinessMetric {
  id: string;
  label: string;
  value: string;
  icon: string;
}

export interface CompareBar {
  label: string;
  before: number;
  after: number;
}

export interface BusinessTableRow {
  id: string;
  label: string;
  baseline: string;
  projected: string;
  difference: string;
}

export interface DashboardSnapshot {
  sidebar: SidebarItem[];
  topbar: TopBarItem[];
  riskCommandCenter: {
    title: string;
    subtitle: string;
    kpis: KpiCardData[];
    alerts: AlertCardData[];
    chartLabels: string[];
    chartSeries: LineSeries[];
    safetyStockLabel: string;
    riskItems: RiskItem[];
  };
  aiRecommendedOrder: {
    title: string;
    subtitle: string;
    summaryCards: KpiCardData[];
    managerReasonOptions: string[];
    items: OrderItem[];
  };
  promotionRecommendation: {
    title: string;
    subtitle: string;
    items: PromotionItem[];
    waterfallTitle: string;
    waterfallBars: WaterfallBar[];
    totalImpactLabel: string;
    totalImpactValue: string;
  };
  businessImpact: {
    title: string;
    subtitle: string;
    metrics: BusinessMetric[];
    compareBars: CompareBar[];
    savingsList: Array<{ label: string; value: string; icon: string }>;
    tableRows: BusinessTableRow[];
  };
}
