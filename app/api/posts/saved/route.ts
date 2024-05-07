import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const savedPosts = await prismadb.savedPost.findMany({
    where: { userId },
    select: { postId: true },
  });

  const postIds = savedPosts.map((savedPost) => savedPost.postId);

  const posts = await prismadb.post.findMany({
    where: { id: { in: postIds } }, // Filter by postIds
  });

  return NextResponse.json({ data: posts, status: 201 });
}