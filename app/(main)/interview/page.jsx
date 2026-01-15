import Link from "next/link";
import { getAssessments } from "@/actions/interview";
import StatsCards from "./_components/stats-cards";
import PerformanceChart from "./_components/performace-chart";
import QuizList from "./_components/quiz-list";
import { Button } from "@/components/ui/button";
import { getRecentAIInterviewFeedback } from "@/actions/ai-interview";

export default async function InterviewPrepPage() {
  const assessments = await getAssessments();
  const recentFeedback = await getRecentAIInterviewFeedback();

  return (
    <div className="px-4 pb-8 pt-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="gradient-title text-3xl font-bold sm:text-5xl md:text-6xl">
          Interview Preparation
        </h1>
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <Link href="/interview/ai">
            <Button className="w-full sm:w-auto" variant="default">
              AI Live Interview
            </Button>
          </Link>
          <Link href="/interview/mock">
            <Button className="w-full sm:w-auto" variant="outline">
              Mock MCQ Quiz
            </Button>
          </Link>
        </div>
      </div>
      <div className="space-y-6">
        <StatsCards assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <QuizList assessments={assessments} />
        {recentFeedback && recentFeedback.length > 0 && (
          <div className="rounded-lg border bg-muted/40 p-4">
            <h2 className="mb-2 text-lg font-semibold">
              Recent AI Interview Feedback
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              {recentFeedback.map((item) => (
                <div key={item.id} className="rounded-md bg-background/60 p-3">
                  <p className="whitespace-pre-wrap">{item.feedback}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-wide opacity-60">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
