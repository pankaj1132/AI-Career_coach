"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// history: [{ role: "user" | "assistant", content: string }]
export async function continueAIInterview(history, userMessage) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      experience: true,
      skills: true,
      bio: true,
    },
  });

  if (!user) throw new Error("User not found");

  const systemPrompt = `You are an AI interviewer conducting a realistic online interview.
User profile:
- Industry: ${user.industry || "unknown"}
- Experience (years): ${user.experience ?? "not specified"}
- Skills: ${(user.skills || []).join(", ") || "not provided"}
- Bio: ${user.bio || "not provided"}

Guidelines:
1. Ask one question at a time.
2. Mix technical, behavioural and situational questions.
3. Keep questions short and clear.
4. After the candidate answers, provide brief feedback and then ask the next question.
5. Use a conversational tone, but stay professional.
6. LIMIT each response to max 4-6 sentences.
7. Do not show JSON or code fences, just plain text.
`;

  const historyText = (history || [])
    .map((m) => `${m.role === "user" ? "Candidate" : "Interviewer"}: ${m.content}`)
    .join("\n");

  const prompt = `${systemPrompt}

Conversation so far:
${historyText}
Candidate: ${userMessage}

As the interviewer, respond with feedback on the last answer (if any) and then ask the next question.`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    return {
      reply: responseText,
    };
  } catch (error) {
    if (error?.status === 429 || error?.statusText === "Too Many Requests") {
      throw new Error(
        "AI interview quota exceeded for today on the free Gemini plan. Please try again later or use the Mock MCQ Quiz instead."
      );
    }

    throw error;
  }
}

// Generate and store final feedback for an interview session
export async function finishAIInterview(history) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      id: true,
      industry: true,
      experience: true,
      skills: true,
    },
  });

  if (!user) throw new Error("User not found");

  const transcript = (history || [])
    .map((m) => `${m.role === "user" ? "Candidate" : "Interviewer"}: ${m.content}`)
    .join("\n");

  const prompt = `You are an experienced technical interviewer.
Candidate profile:
- Industry: ${user.industry || "unknown"}
- Experience: ${user.experience ?? "not specified"} years
- Skills: ${(user.skills || []).join(", ") || "not provided"}

Here is the full interview transcript:
${transcript}

Provide concise feedback in plain text (no markdown):
1) Overall impression (1 short paragraph)
2) 3 main strengths (bulleted list style)
3) 3 key improvement areas (bulleted list style)
4) Suggested next steps to prepare.
Keep it under 250 words.`;

  try {
    const result = await model.generateContent(prompt);
    const feedbackText = result.response.text().trim();
    // Use raw SQL so this works even if Prisma Client
    // hasn't been regenerated for the AiInterviewFeedback model
    await db.$executeRaw`
      INSERT INTO "AiInterviewFeedback" ("id", "userId", "feedback")
      VALUES (${crypto.randomUUID()}, ${user.id}, ${feedbackText})
    `;

    return { feedback: feedbackText };
  } catch (error) {
    if (error?.status === 429 || error?.statusText === "Too Many Requests") {
      throw new Error(
        "AI interview feedback quota exceeded for today on the Gemini plan. Please try again later."
      );
    }

    throw error;
  }
}

export async function getRecentAIInterviewFeedback() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  });

  if (!user) throw new Error("User not found");

  const rows = await db.$queryRaw`
    SELECT "id", "feedback", "createdAt"
    FROM "AiInterviewFeedback"
    WHERE "userId" = ${user.id}
    ORDER BY "createdAt" DESC
    LIMIT 3
  `;

  return rows;
}
