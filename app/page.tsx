import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function Home() {
  const dashboardData = await getDashboardData();

  return <DashboardShell data={dashboardData} />;
}
