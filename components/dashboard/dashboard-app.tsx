"use client";

import { useState } from "react";

import { dashboardSnapshot } from "@/data/dashboard";
import { Sidebar } from "@/components/dashboard/layout/sidebar";
import { Topbar } from "@/components/dashboard/layout/topbar";
import { AIRecommendedOrderPage } from "@/components/dashboard/pages/ai-recommended-order";
import { BusinessImpactPage } from "@/components/dashboard/pages/business-impact";
import { PromotionRecommendationPage } from "@/components/dashboard/pages/promotion-recommendation";
import { RiskCommandCenterPage } from "@/components/dashboard/pages/risk-command-center";
import type { DashboardPageKey } from "@/types/dashboard";

export function DashboardApp() {
  const [activePage, setActivePage] = useState<DashboardPageKey>("business-impact");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function handleSelectPage(page: DashboardPageKey) {
    setActivePage(page);
    setIsSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(21,83,45,0.08),transparent_24%),linear-gradient(180deg,#f8f5ef_0%,#f4efe7_52%,#efe8de_100%)]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)]">
        <Sidebar
          items={dashboardSnapshot.sidebar}
          activePage={activePage}
          onSelect={handleSelectPage}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="px-2 py-2 sm:px-3 sm:py-3 md:px-3 lg:px-4">
          <div className="min-h-full rounded-[26px] border border-[#e6dccf] bg-[#fdfaf6] p-2.5 shadow-[0_24px_80px_-56px_rgba(0,0,0,0.45)] sm:rounded-[30px] sm:p-3 md:p-4 lg:p-5">
            <div className="mb-2 flex items-center justify-between gap-3 lg:hidden">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-[#e3d8c8] bg-white px-3 py-2 text-sm font-semibold text-[#173822] shadow-sm"
              >
                <span aria-hidden="true">☰</span>
                Menu
              </button>
              <p className="truncate text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
                Cafe Amazon AI Dashboard
              </p>
            </div>

            <Topbar items={dashboardSnapshot.topbar} />

            {activePage === "risk-command-center" ? <RiskCommandCenterPage /> : null}
            {activePage === "ai-recommended-order" ? <AIRecommendedOrderPage /> : null}
            {activePage === "promotion-recommendation" ? <PromotionRecommendationPage /> : null}
            {activePage === "business-impact" ? <BusinessImpactPage /> : null}
          </div>
        </main>
      </div>
    </div>
  );
}
