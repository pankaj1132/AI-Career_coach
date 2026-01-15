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
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">
          Interview Preparation
        </h1>
        <div className="flex gap-2">
          <Link href="/interview/ai">
            <Button variant="default">AI Live Interview</Button>
          </Link>
          <Link href="/interview/mock">
            <Button variant="outline">Mock MCQ Quiz</Button>
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
