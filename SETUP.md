# SubGuard — 15-Minute Production Setup Guide

**SubGuard** is a market-ready micro-SaaS for tracking recurring subscriptions, flagging silent price hikes, and splitting household bills. It is architected for **zero-friction onboarding** (localStorage/demo mode before signup), **freemium monetization** (3 free tracked items, $7/mo or $49 Lifetime Pro tier), and **viral household growth** (one-click Savings Snapshot & Partner Invite links).

---

## Project Structure

```text
subguard-saas/
├── package.json                 # Next.js 15, React 19, Tailwind, Stripe, Prisma, Lucide
├── .env.example                 # Required environment variables template
├── prisma/
│   └── schema.prisma            # User, Subscription, HouseholdInvite, PriceHistory models
└── src/
    ├── lib/
    │   ├── stripe.ts            # Stripe client, Pro Monthly ($7) & Lifetime ($49) price config
    │   ├── prisma.ts            # Singleton Prisma client for serverless environments
    │   └── insights.ts          # Price-hike detector, annual burn calculator, CSV exporter
    ├── app/
    │   ├── layout.tsx           # Root layout with Inter font & metadata
    │   ├── page.tsx             # High-converting Landing Page (/) + Live Interactive Preview
    │   ├── app/
    │   │   └── page.tsx         # Full-screen Dashboard (/app) with zero-friction localStorage + sync
    │   └── api/
    │       ├── subscriptions/
    │       │   └── route.ts     # GET / POST / DELETE with 3-item Free Tier enforcement
    │       ├── stripe/
    │       │   ├── checkout/route.ts  # Creates Stripe Checkout Session (subscription or payment)
    │       │   └── webhook/route.ts   # Handles checkout.session.completed & subscription updates
    │       └── invite/
    │           └── route.ts     # Generates & redeems household partner invite tokens
```

---

## Step 1: Clone & Install Dependencies (2 mins)

```bash
unzip subguard-saas.zip -d subguard-saas
cd subguard-saas
npm install
cp .env.example .env.local
```

---

## Step 2: Connect Database & Authentication (5 mins)

### Option A: Supabase (Recommended — Free Tier)
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **Project Settings → Database → Connection String (URI)** and paste it into `.env.local` as `DATABASE_URL`.
3. Push the Prisma schema to your database:
   ```bash
   npx prisma db push
   ```
4. For **Authentication**, add [Clerk](https://clerk.com) (`npm install @clerk/nextjs`) or [Auth.js](https://authjs.dev) (`npm install next-auth`):
   - In `src/app/api/subscriptions/route.ts` and `src/app/api/stripe/checkout/route.ts`, replace the `getSessionUserId()` helper with `auth()` from Clerk or `getServerSession()` from NextAuth.
   - Because SubGuard uses **Zero-Friction Onboarding**, unauthenticated visitors use `localStorage` immediately; when they sign in, POST their local items to `/api/subscriptions` to sync seamlessly.

---

## Step 3: Plug In Stripe API Keys & Webhooks (5 mins)

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com) and create **two Products**:
   - **SubGuard Pro (Monthly):** `$7.00 / month` (recurring) → copy the `price_...` ID to `STRIPE_PRICE_PRO_MONTHLY`.
   - **SubGuard Pro (Lifetime):** `$49.00` (one-time) → copy the `price_...` ID to `STRIPE_PRICE_PRO_LIFETIME`.
2. Copy your **Secret Key** (`sk_live_...` or `sk_test_...`) to `STRIPE_SECRET_KEY` in `.env.local`.
3. Add a Webhook endpoint in Stripe pointing to `https://yourdomain.com/api/stripe/webhook` listening for:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy the Webhook Signing Secret (`whsec_...`) to `STRIPE_WEBHOOK_SECRET`.
5. For local testing, forward events with the Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

---

## Step 4: Deploy to Production in Under 3 Minutes

### Deploy to Vercel
1. Push your repository to GitHub.
2. Import the repo in [vercel.com/new](https://vercel.com/new).
3. Paste all variables from `.env.local` into **Vercel → Settings → Environment Variables** (set `NEXT_PUBLIC_APP_URL` to your production `https://` domain).
4. Click **Deploy**. Vercel automatically runs `prisma generate` and `next build`.

---

## Built-In Growth & Low-Maintenance Checklist
- **Automated Value:** Price-hike detection, renewal countdowns, and CSV/PDF exports run client-side and via stateless API routes—zero manual content creation required.
- **Paywall Conversion:** Free users hit a non-intrusive upgrade modal when adding their 4th item or clicking **Export PDF/CSV Audit**.
- **Viral Loop:** Every dashboard includes **Share Savings Snapshot** (social-ready savings summary) and **Invite Partner** (household bill-splitting link).
