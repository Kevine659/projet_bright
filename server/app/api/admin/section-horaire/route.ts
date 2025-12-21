import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "../_core/auth";
import { requirePermission } from "../_core/guard";
import {
  createSectionHoraireSchema,
  updateSectionHoraireSchema,
} from "./schema";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "section_horaire", "view");

  const sections = await prisma.sectionHoraire.findMany({
    include: { cours: true },
  });
  return NextResponse.json(sections);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "section_horaire", "create");

  const body = await req.json();
  const data = createSectionHoraireSchema.parse(body);

  const section = await prisma.sectionHoraire.create({ data });
  return NextResponse.json(section);
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "section_horaire", "update");

  const { id, ...payload } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  const data = updateSectionHoraireSchema.parse(payload);

  const section = await prisma.sectionHoraire.update({
    where: { id },
    data,
  });

  return NextResponse.json(section);
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "section_horaire", "delete");

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  await prisma.sectionHoraire.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
