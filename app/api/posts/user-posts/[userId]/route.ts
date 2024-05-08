import prismadb from "@/lib/prismadb";

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const userId = params.userId;

  const posts = await prismadb.post.findMany({
    where: {
      createdBy: userId,
    },
  });


  return Response.json({ posts, status: 200 });
}