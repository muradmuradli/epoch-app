import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { commentId: string }}) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    console.log('hey there');

    await prismadb.comment.deleteMany({
      where: {
        id: params.commentId
      }
    })

    return new NextResponse("Comment deleted!", { status: 200 })
  } catch (error) {
    console.log('[COMMENTS_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 })
  }
}