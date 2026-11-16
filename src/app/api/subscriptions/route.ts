import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FREE_TIER_LIMIT } from "@/lib/stripe";

// Replace with your auth provider (e.g. Clerk auth().userId or NextAuth getServerSession)
async function getSessionUserId(req: NextRequest): Promise<string | null> {
  return req.headers.get("x-demo-user-id");
}

export async function GET(req: NextRequest) {
  const userId = await getSessionUserId(req);
  if (!userId) return NextResponse.json({ subscriptions: [], plan: "FREE" });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscriptions: { orderBy: { nextRenewal: "asc" } } },
  });

  return NextResponse.json({
    plan: user?.plan ?? "FREE",
    subscriptions: user?.subscriptions ?? [],
  });
}

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { _count: { select: { subscriptions: true } } },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (user.plan === "FREE" && user._count.subscriptions >= FREE_TIER_LIMIT) {
    return NextResponse.json(
      { error: "FREE_LIMIT_REACHED", message: `Free tier supports up to ${FREE_TIER_LIMIT} tracked items.` },
      { status: 402 }
    );
  }

  const body = await req.json();
  const created = await prisma.subscription.create({
    data: {
      userId: user.id,
      name: String(body.name),
      category: String(body.category || "Software"),
      amount: Number(body.amount),
      previousAmount: body.previousAmount ? Number(body.previousAmount) : null,
      billingCycle: body.billingCycle || "MONTHLY",
      nextRenewal: new Date(body.nextRenewal),
      sharedWithHousehold: Boolean(body.sharedWithHousehold),
      status: body.status || "ACTIVE",
    },
  });

  return NextResponse.json({ subscription: created }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const userId = await getSessionUserId(req);
  const id = req.nextUrl.searchParams.get("id");
  if (!userId || !id) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  await prisma.subscription.deleteMany({ where: { id, userId } });
  return NextResponse.json({ deleted: true });
}
