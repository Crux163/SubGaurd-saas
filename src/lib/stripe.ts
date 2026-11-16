import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

export const FREE_TIER_LIMIT = 3;

export const PRICING_PLANS = {
  MONTHLY: {
    priceId: process.env.STRIPE_PRICE_PRO_MONTHLY || "price_monthly_placeholder",
    mode: "subscription" as const,
    label: "$7 / month",
  },
  LIFETIME: {
    priceId: process.env.STRIPE_PRICE_PRO_LIFETIME || "price_lifetime_placeholder",
    mode: "payment" as const,
    label: "$49 one-time",
  },
};
