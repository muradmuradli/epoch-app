import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: { commentId: string } }) {
	const { userId } = auth();

	if (!userId) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	const comment = await prismadb.comment.findFirst({
		where: { id: params.commentId },
	});

	if (!comment) {
		return Response.json({ error: "Comment not found", status: 404 });
	}

	const userLiked = comment.likes.includes(userId);

	await prismadb.comment.updateMany({
		where: { id: params.commentId },
		data: {
			likes: {
				set: userLiked ? comment.likes.filter((id) => id !== userId) : [...comment.likes, userId],
			},
		},
	});

	return Response.json({ status: 201 });
}
