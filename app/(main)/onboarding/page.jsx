import { industries } from "@/data/industries";
import OnboardingForm from "./_components/onboarding-form";

// Allow users to (re)fill or update their profile anytime
export default async function OnboardingPage() {
  return (
    <main>
      <OnboardingForm industries={industries} />
    </main>
  );
}
