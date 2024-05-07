import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const posts = await prismadb.post.findMany({
    where: { createdBy: userId },
  });

  return NextResponse.json({ data: posts, status: 201 });
}