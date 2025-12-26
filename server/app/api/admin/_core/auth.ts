import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function createSession(userId: number) {
  const sessionId = randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 jours

  await prisma.session.create({
    data: { id: sessionId, userId, expiresAt },
  });

  (await cookies()).set({
    name: "sessionId",
    value: sessionId,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getCurrentUser() {
  const sessionId = (await cookies()).get("sessionId")?.value;
  if (!sessionId) return null;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      user: {
        include: {
          roles: {
            include: {
              role: {
                include: { permissions: { include: { permission: true } } },
              },
            },
          },
        },
      },
    },
  });

  if (!session) return null;
  return session.user;
}

export async function destroySession() {
  const sessionId = (await cookies()).get("sessionId")?.value;
  if (!sessionId) return;

  await prisma.session.delete({ where: { id: sessionId } });

  (await cookies()).set({ name: "sessionId", value: "", maxAge: 0 });
}
