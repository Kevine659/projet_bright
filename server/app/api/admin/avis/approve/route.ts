import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "../../_core/auth";
import { requirePermission } from "../../_core/guard";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "avis", "approve");

  const { id } = await req.json();

  const updated = await prisma.avisVoyageur.update({
    where: { id },
    data: { approuve: true },
  });

  return NextResponse.json(updated);
}
