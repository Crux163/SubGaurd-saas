import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { inviterId } = await req.json();
  if (!inviterId) return NextResponse.json({ error: "Missing inviterId" }, { status: 400 });

  const token = crypto.randomBytes(12).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.householdInvite.create({
    data: { token, inviterId, expiresAt },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return NextResponse.json({ inviteUrl: `${appUrl}/app?invite=${token}` });
}
