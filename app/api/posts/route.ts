import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // get the parameter (in our case title) you want to sort the posts with
  const title = req.nextUrl.searchParams.get('title');

  // sort the posts according to the titles and return them
  const posts = await prismadb.post.findMany({
    where: {
      title: {
        contains: title as string,
        mode: 'insensitive'
      },
    },
  });

  return NextResponse.json({ data: posts, status: 201 });
}