import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AIInterview from "../_components/ai-interview";

export default function AIInterviewPage() {
  return (
    <div className="container mx-auto space-y-4 py-6">
      <div className="flex flex-col space-y-2 mx-2">
        <Link href="/interview">
          <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Interview Preparation
          </Button>
        </Link>

        <div>
          <h1 className="text-6xl font-bold gradient-title">AI Live Interview</h1>
          <p className="text-muted-foreground">
            Practice a live, conversational interview powered by AI.
          </p>
        </div>
      </div>

      <AIInterview />
    </div>
  );
}
