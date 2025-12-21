import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "../_core/auth";
import { requirePermission } from "../_core/guard";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "avis", "view");

  const { searchParams } = new URL(req.url);
  const approuve = searchParams.get("approuve");

  const avis = await prisma.avisVoyageur.findMany({
    where: approuve !== null ? { approuve: approuve === "true" } : undefined,
    orderBy: { date_soumission: "desc" },
  });

  return NextResponse.json(avis);
}
