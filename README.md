# Wobble — Daily Social Challenge Platform

Wobble is a **gamified platform** designed to help individuals overcome social anxiety and build confidence through **small, achievable daily social tasks**.
With a simple streak system and a clean, approachable UI, Wobble encourages users to step out of their comfort zones — one day at a time.

---

## 🌟 Features

* **Daily Social Challenges** — A new, unique task every day to encourage real-world interaction
* **Streak Tracking** — Stay motivated by keeping your streak alive
* **Secure Login** — Google OAuth for quick and safe authentication
* **Progress Tracking** — View past challenges, completion status, and growth over time
* **Responsive UI** — Built with TailwindCSS for a clean, mobile-friendly experience

---

## 🛠 Tech Stack

* **Frontend & Backend**: [Next.js](https://nextjs.org/) (API routes for backend logic)
* **Authentication**: Google OAuth via [NextAuth.js](https://next-auth.js.org/)
* **Database**: [Supabase](https://supabase.com/) (real-time storage and retrieval)
* **Styling**: [TailwindCSS](https://tailwindcss.com/)

---

## Getting Started

### 1️⃣ Clone the repo

```bash
git clone https://github.com/ayaanshk/wobble.git
cd wobble
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Set up environment variables

Create a `.env.local` file in the root and add:

```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
```

### 4️⃣ Run the development server

```bash
npm run dev
```

---

## 🌍 Deployment

You can easily deploy Wobble to [Vercel](https://vercel.com/):

1. Push your code to GitHub
2. Import your repo into Vercel
3. Add environment variables in Vercel dashboard
4. Deploy 

---

## 🤝 Contributing

Contributions are welcome!
If you’d like to improve Wobble, open a PR or submit an issue in the GitHub repo.

---

## 💡 Inspiration

Social anxiety can make everyday interactions feel overwhelming.
Wobble turns confidence-building into a game, helping users grow one small step at a time.

---

