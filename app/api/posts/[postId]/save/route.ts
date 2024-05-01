import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { postId: string } }) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const existingSavedPost = await prismadb.savedPost.findFirst({
    where: { userId, postId: params.postId },
  });

  if (existingSavedPost) {
    return new NextResponse(JSON.stringify({ saved: true }), { status: 200 });
  } else {
    return new NextResponse(JSON.stringify({ saved: false }), { status: 200 });
  }
}

export async function POST(request: Request, { params }: { params: { postId: string } }) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const existingSavedPost = await prismadb.savedPost.findFirst({
    where: { userId, postId: params.postId },
  });

  try {
    if (existingSavedPost) {
      await prismadb.savedPost.delete({ where: { id: existingSavedPost.id } });
      return new NextResponse("Post removed from saved", { status: 200 });
    } else {
      await prismadb.savedPost.create({
        data: {
          userId,
          postId: params.postId,
        },
      });
      return new NextResponse("Post saved successfully", { status: 201 });
    }
  } catch (error) {
    console.error("Error toggling saved post:", error);
    return new NextResponse("Failed to toggle saved post", { status: 500 });
  }
}
