import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const topics = await prismadb.post.findMany({
		select: {
			topic: true,
		},
		distinct: ["topic"],
	});

	const uniqueTopics = topics.map((post) => post.topic);

	return NextResponse.json({ topics: uniqueTopics, status: 200 });
}
