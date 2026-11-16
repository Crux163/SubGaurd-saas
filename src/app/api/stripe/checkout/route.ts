import { NextRequest, NextResponse } from "next/server";
import { stripe, PRICING_PLANS } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { tier, userId, email } = (await req.json()) as {
      tier: "MONTHLY" | "LIFETIME";
      userId?: string;
      email?: string;
    };

    const plan = PRICING_PLANS[tier] || PRICING_PLANS.MONTHLY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: plan.mode,
      customer_email: email,
      line_items: [{ price: plan.priceId, quantity: 1 }],
      metadata: {
        userId: userId || "anonymous",
        tier,
      },
      success_url: `${appUrl}/app?upgraded=true&tier=${tier}`,
      cancel_url: `${appUrl}/app?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
