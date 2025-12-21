import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "../_core/auth";
import { requirePermission } from "../_core/guard";
import { createPromotionsSchema, updatePromotionsSchema } from "./schema";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "promotions", "view");

  const promos = await prisma.promotions.findMany({
    include: { pays: true, type_visa: true },
  });
  return NextResponse.json(promos);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "promotions", "create");

  const body = await req.json();
  const data = createPromotionsSchema.parse(body);

  const promo = await prisma.promotions.create({ data });
  return NextResponse.json(promo);
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "promotions", "update");

  const { id, ...payload } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  const data = updatePromotionsSchema.parse(payload);

  const promo = await prisma.promotions.update({
    where: { id },
    data,
  });

  return NextResponse.json(promo);
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "promotions", "delete");

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  await prisma.promotions.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
