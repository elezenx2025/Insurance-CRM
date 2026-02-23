# Vercel Deployment Guide - Insurance CRM

## 1. Create PostgreSQL Database

Choose one of these providers (all offer free tiers):

- **Vercel Postgres**: [vercel.com/storage](https://vercel.com/storage) - Integrates directly with Vercel
- **Supabase**: [supabase.com](https://supabase.com) - Free PostgreSQL
- **Neon**: [neon.tech](https://neon.tech) - Serverless PostgreSQL

Copy your **connection string** (starts with `postgresql://`).

## 2. Push to GitHub

1. Create a new repository on [GitHub](https://github.com/new) (e.g., `InsuranceCRM`)
2. **Do not** initialize with README (repo already has code)
3. Run these commands in your project folder:

```bash
git remote add origin https://github.com/YOUR_USERNAME/InsuranceCRM.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## 3. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New** → **Project**
3. Import your **InsuranceCRM** repository
4. Vercel will auto-detect Next.js (no config changes needed)

## 4. Configure Environment Variables

In your Vercel project: **Settings** → **Environment Variables**

Add these variables (select **Production**, **Preview**, and **Development**):

| Variable | Value | Required |
|----------|-------|----------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db?sslmode=require` | ✅ Yes |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | ✅ Yes |
| `NEXTAUTH_SECRET` | Generate: `openssl rand -base64 32` | ✅ Yes |
| `JWT_SECRET` | Generate: `openssl rand -base64 64` | ✅ Yes |
| `API_BASE_URL` | `https://your-app.vercel.app/api` | ✅ Yes |
| `EMAIL_HOST` | `smtp.gmail.com` | Optional |
| `EMAIL_PORT` | `587` | Optional |
| `EMAIL_USER` | Your email | Optional |
| `EMAIL_PASS` | App password | Optional |
| `COMPANY_NAME` | `Insurance CRM System` | Optional |

**Important**: After first deploy, update `NEXTAUTH_URL` and `API_BASE_URL` with your actual Vercel URL.

## 5. Run Database Migrations

After first deploy, run migrations against your production database:

```bash
# Set DATABASE_URL to your production PostgreSQL URL, then:
npx prisma migrate deploy
```

Or add to Vercel **Build Command**: `prisma migrate deploy && prisma generate && next build`

## 6. Deploy

Click **Deploy** - Vercel will build and deploy automatically. Your app will be live at `https://your-project.vercel.app`.
