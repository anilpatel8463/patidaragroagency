# Vercel Deployment Guide: FastAPI + React + PostgreSQL

This guide outlines how to deploy your **Patidar Agro Solution** application on Vercel using a serverless architecture.

## 1. Database Setup (Neon PostgreSQL)

Since Vercel doesn't host databases, I recommend using **[Neon](https://neon.tech)**. It is purpose-built for serverless environments and offers a generous free tier.

1.  **Create a Neon Account**: Go to [neon.tech](https://neon.tech) and sign up.
2.  **Get Connection String**: Copy the **Connection Details** string. It will look like:
    `postgresql://[user]:[password]@[hostname]/[db_name]?sslmode=require`
3.  **Save this**: You will need it as `DATABASE_URL` later.

---

## 2. Prepare for Deployment

The following necessary files have been created in your repository:
- `vercel.json`: Configuration for building and routing.
- `backend/api/index.py`: Entry point for Vercel functions.

---

## 3. Push to GitHub

```bash
git init
git add .
git commit -m "chore: prepare for vercel deployment"
git remote add origin https://github.com/YOUR_USERNAME/patidar-agro-solution.git
git branch -M main
git push -u origin main
```

---

## 4. Deploy on Vercel

1.  Import your GitHub repository into Vercel.
2.  **Environment Variables**:
    - `DATABASE_URL`: Your Neon string.
    - `SECRET_KEY`: Long random string.
    - `VITE_API_URL`: `/api`
    - `CORS_ORIGINS`: `["https://your-app.vercel.app"]`
3.  Click **Deploy**.

---

## 5. Running Database Migrations

Run locally against the production database:
```bash
cd backend
export DATABASE_URL="postgresql://..." 
alembic upgrade head
```
