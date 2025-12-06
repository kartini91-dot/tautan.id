Vercel deployment steps (quick)

This repo contains a static frontend in the `frontend/` folder and a Node/Express backend in `backend/`.

If you want to deploy the frontend to Vercel (recommended and free):

1) Add `vercel.json` (already added to repo) that tells Vercel to serve `frontend/` as a static site.

2) Install Vercel CLI (optional):

```bash
npm i -g vercel
```

3) Login to Vercel:

```bash
vercel login
```

4) From repo root run (first time):

```bash
vercel --prod
```

During the interactive setup, choose:
- Link to existing project or create a new one
- Set the "Root Directory" to `frontend` (if asked)
- Build & Output: none (static)

5) Or use the Vercel Dashboard:
- Go to https://vercel.com/dashboard
- Import Project -> Connect GitHub repository `kartini91-dot/tautan.id`
- When configuring the project, specify:
  - Framework Preset: Other
  - Root Directory: `frontend`
  - Output Directory: leave empty (static)

6) Deploy: Vercel will give you a URL like `https://tautan-frontend.vercel.app`.

Notes about backend:
- Express server in `backend/` cannot be deployed to Vercel as-is. You have 2 options:
  1. Keep backend on an external host (Render, Railway, AWS, DigitalOcean) and point frontend to its API endpoint.
  2. Convert backend endpoints into Vercel Serverless Functions under `api/` and adjust code. This requires refactoring.

If you want, I can:
- Help you run the `vercel --prod` command locally (you must be logged in)
- Or guide you through Dashboard import step-by-step

