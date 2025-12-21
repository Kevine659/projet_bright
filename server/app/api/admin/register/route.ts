import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createSession } from "../_core/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.create({
    data: {
      email,
      password: bcrypt.hashSync(password, 10),
      isActive: true,
    },
  });

  await createSession(user.id);

  return NextResponse.json({ success: true });
}
