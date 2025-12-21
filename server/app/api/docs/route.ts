import { NextResponse } from "next/server";
import { generateOpenApi } from "@/lib/openapi";

export async function GET() {
  try {
    const document = generateOpenApi();
    return NextResponse.json(document);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const stack = err instanceof Error ? err.stack : undefined;
    return NextResponse.json(
      { error: message, stack },
      { status: 500 }
    );
  }
}
