import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "../_core/auth";
import { requirePermission } from "../_core/guard";
import { PaysSchema, updatePaysSchema } from "./schema";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "pays", "view");

  const pays = await prisma.pays.findMany();
  return NextResponse.json(pays);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "pays", "create");

  const body = await req.json();
  const data = PaysSchema.parse(body);

  const newPays = await prisma.pays.create({ data });
  return NextResponse.json(newPays);
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "pays", "update");

  const { id, ...payload } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  const data = updatePaysSchema.parse(payload);

  const pays = await prisma.pays.update({
    where: { id },
    data,
  });

  return NextResponse.json(pays);
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "pays", "delete");

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  await prisma.pays.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
