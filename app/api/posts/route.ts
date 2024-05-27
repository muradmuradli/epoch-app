import prismadb from "@/lib/prismadb";
import { Post } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const title = req.nextUrl.searchParams.get("title");
	const topic = req.nextUrl.searchParams.get("topic");
	console.log(topic);

	let posts: Post[];

	if (title) {
		posts = await prismadb.post.findMany({
			where: {
				title: {
					contains: title as string,
					mode: "insensitive",
				},
			},
		});
	} else if (topic) {
		posts = await prismadb.post.findMany({
			where: {
				topic: topic as string,
			},
		});
	} else {
		posts = await prismadb.post.findMany();
	}

	return NextResponse.json({ posts, status: 200 });
}

export async function POST(req: Request) {
	const { title, image, description, content, topic, tags, id: userId } = await req.json();

	const post = await prismadb.post.create({
		data: {
			title,
			tags,
			description,
			topic,
			content,
			image,
			createdBy: userId,
		},
	});

	return Response.json({ data: post, status: 201 });
}
