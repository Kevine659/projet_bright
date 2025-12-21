import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "../_core/auth";
import { requirePermission } from "../_core/guard";
import { createOffreEmploiSchema, updateOffreEmploiSchema } from "./schema";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "offre_emploi", "view");

  const offres = await prisma.offreEmploi.findMany({
    include: { visa_pays: true },
  });
  return NextResponse.json(offres);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "offre_emploi", "create");

  const body = await req.json();
  const data = createOffreEmploiSchema.parse(body);

  const offre = await prisma.offreEmploi.create({ data });
  return NextResponse.json(offre);
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "offre_emploi", "update");

  const { id, ...payload } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  const data = updateOffreEmploiSchema.parse(payload);

  const offre = await prisma.offreEmploi.update({
    where: { id },
    data,
  });

  return NextResponse.json(offre);
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "offre_emploi", "delete");

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  await prisma.offreEmploi.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
