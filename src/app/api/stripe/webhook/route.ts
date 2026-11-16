import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
  } catch (err) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${(err as Error).message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const tier = session.metadata?.tier === "LIFETIME" ? "PRO_LIFETIME" : "PRO_MONTHLY";

    if (userId && userId !== "anonymous") {
      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: tier,
          stripeCustomerId: typeof session.customer === "string" ? session.customer : undefined,
        },
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    if (typeof subscription.customer === "string") {
      await prisma.user.updateMany({
        where: { stripeCustomerId: subscription.customer, plan: "PRO_MONTHLY" },
        data: { plan: "FREE" },
      });
    }
  }

  return NextResponse.json({ received: true });
}
