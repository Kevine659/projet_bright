import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { visaParPaysCreateSchema, visaParPaysUpdateSchema } from "./schema";

import { getCurrentUser } from "../_core/auth";
import { requirePermission } from "../_core/guard";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/wasm-compiler-edge";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "visa_par_pays", "view");

  const records = await prisma.visaParPays.findMany({
    include: {
      pays: true,
      type_visa: true,
    },
    orderBy: {
      pays: { nom_pays: "asc" },
    },
  });

  return NextResponse.json(records);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "visa_par_pays", "create");

  const body = await req.json();
  const data = visaParPaysCreateSchema.parse(body);

  try {
    const record = await prisma.visaParPays.create({
      data,
    });

    return NextResponse.json(record, { status: 201 });
  } catch (e: unknown) {
    // contrainte unique
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json(
        { error: "Ce visa existe déjà pour ce pays." },
        { status: 409 }
      );
    }

    throw e;
  }
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "visa_par_pays", "update");

  const { id, ...payload } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  const data = visaParPaysUpdateSchema.parse(payload);

  try {
    const record = await prisma.visaParPays.update({
      where: { id },
      data,
    });

    return NextResponse.json(record);
  } catch (e: unknown) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json(
        { error: "Doublon pays / visa interdit." },
        { status: 409 }
      );
    }

    throw e;
  }
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "visa_par_pays", "delete");

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  await prisma.visaParPays.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
