import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "../_core/auth";
import { requirePermission } from "../_core/guard";
import { createCoursLangueSchema, updateCoursLangueSchema } from "./schema";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "cours_langue", "view");

  const cours = await prisma.coursLangue.findMany({
    include: { sections: true },
  });
  return NextResponse.json(cours);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "cours_langue", "create");

  const body = await req.json();
  const data = createCoursLangueSchema.parse(body);

  const cours = await prisma.coursLangue.create({ data });
  return NextResponse.json(cours);
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "cours_langue", "update");

  const { id, ...payload } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  const data = updateCoursLangueSchema.parse(payload);

  const cours = await prisma.coursLangue.update({
    where: { id },
    data,
  });

  return NextResponse.json(cours);
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "cours_langue", "delete");

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  await prisma.coursLangue.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
