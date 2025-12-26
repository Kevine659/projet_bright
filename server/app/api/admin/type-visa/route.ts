import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "../_core/auth";
import { requirePermission } from "../_core/guard";
import { typeVisaCreateSchema, typeVisaUpdateSchema } from "./schema";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "type_visa", "view");

  const visas = await prisma.typeVisa.findMany();
  return NextResponse.json(visas);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "type_visa", "create");

  const body = await req.json();
  const data = typeVisaCreateSchema.parse(body);

  const visa = await prisma.typeVisa.create({ data });
  return NextResponse.json(visa);
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "type_visa", "update");

  const { id, ...payload } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  const data = typeVisaUpdateSchema.parse(payload);

  const visa = await prisma.typeVisa.update({
    where: { id },
    data,
  });

  return NextResponse.json(visa);
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "type_visa", "delete");

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  await prisma.typeVisa.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
