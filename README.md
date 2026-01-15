## AI Career Coach

AI Career Coach is a Next.js application that helps users improve their career profile with:

- AI‑powered resume builder
- AI cover letter generator
- Interview preparation dashboard
- Mock MCQ interview quizzes
- AI live interview (chat + optional voice)

### Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- Prisma + PostgreSQL (Neon)
- Clerk (authentication)
- Google Gemini API

### Getting Started (Local)

1. Clone the repo:

	```bash
	git clone https://github.com/<your-github-username>/ai-career-coach.git
	cd ai-career-coach
	```

2. Install dependencies:

	```bash
	npm install
	```

3. Create a `.env` file in the project root and set:

	```bash
	DATABASE_URL=...
	NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
	CLERK_SECRET_KEY=...
	NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
	NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
	NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
	NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
	GEMINI_API_KEY=...
	```

4. Run database migrations:

	```bash
	npx prisma migrate dev
	```

5. Start the dev server:

	```bash
	npm run dev
	```

### Deployment (Vercel)

- Push this project to GitHub (or another Git provider).
- Create a new project on Vercel and import the repo.
- Add the same environment variables in **Project → Settings → Environment Variables**.
- Vercel will build and deploy automatically.

### Author

- Name: Pankaj Saini
- GitHub: https://github.com/pankaj1132
- LinkedIn: https://www.linkedin.com/in/pankaj-saini1132/


