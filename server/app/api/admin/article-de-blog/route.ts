import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "../_core/auth";
import { requirePermission } from "../_core/guard";
import { createArticleDeBlogSchema, updateArticleDeBlogSchema } from "./schema";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "article_blog", "view");

  const articles = await prisma.articleDeBlog.findMany();
  return NextResponse.json(articles);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "article_blog", "create");

  const body = await req.json();
  const data = createArticleDeBlogSchema.parse(body);

  const article = await prisma.articleDeBlog.create({ data });
  return NextResponse.json(article);
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "article_blog", "update");

  const { id, ...payload } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  const data = updateArticleDeBlogSchema.parse(payload);

  const article = await prisma.articleDeBlog.update({
    where: { id },
    data,
  });

  return NextResponse.json(article);
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  requirePermission(user, "article_blog", "delete");

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  await prisma.articleDeBlog.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
