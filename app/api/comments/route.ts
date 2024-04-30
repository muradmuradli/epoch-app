import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { content, postId } = await req.json();

    if (!content) {
      return new NextResponse("Content is required", { status: 400 })
    }

    const comment = await prismadb.comment.create({
      data: {
       content, postId, createdBy: userId
      }
    })

    return NextResponse.json(comment);

  } catch (error) {
    console.log('[STORES_POST]', error);
    return new NextResponse("Internal error", { status: 500 })
  }
}