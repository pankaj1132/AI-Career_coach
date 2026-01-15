import { getIndustryInsights } from "@/actions/dashboard";
import DashboardView from "./_component/dashboard-view";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import { industries } from "@/data/industries";

export default async function DashboardPage({ searchParams }) {
  const { isOnboarded } = await getUserOnboardingStatus();

  // If not onboarded, redirect to onboarding page
  // Skip this check if already on the onboarding page
  if (!isOnboarded) {
    redirect("/onboarding");
  }

  // Optional: allow viewing insights for another industry via query param
  const industryParam = searchParams?.industry;

  const insights = await getIndustryInsights(industryParam);

  return (
    <div className="container mx-auto">
      <DashboardView insights={insights} industries={industries} />
    </div>
  );
}
