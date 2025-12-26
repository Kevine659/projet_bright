import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "../_core/auth";
import { requirePermission } from "../_core/guard";
import { createFiliereEtudeSchema, updateFiliereEtudeSchema } from "./schema";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "filiere_etude", "view");

  const filieres = await prisma.filiereEtude.findMany();
  return NextResponse.json(filieres);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "filiere_etude", "create");

  const body = await req.json();
  const data = createFiliereEtudeSchema.parse(body);

  const filiere = await prisma.filiereEtude.create({ data });
  return NextResponse.json(filiere);
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "filiere_etude", "update");

  const { id, ...payload } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  const data = updateFiliereEtudeSchema.parse(payload);

  const filiere = await prisma.filiereEtude.update({
    where: { id },
    data,
  });

  return NextResponse.json(filiere);
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "filiere_etude", "delete");

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  await prisma.filiereEtude.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
