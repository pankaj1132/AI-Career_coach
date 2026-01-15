-- CreateTable
CREATE TABLE "AiInterviewFeedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiInterviewFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiInterviewFeedback_userId_idx" ON "AiInterviewFeedback"("userId");

-- AddForeignKey
ALTER TABLE "AiInterviewFeedback" ADD CONSTRAINT "AiInterviewFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
