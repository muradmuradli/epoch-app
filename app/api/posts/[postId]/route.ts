import prismadb from "@/lib/prismadb";
import { clerkClient } from "@clerk/nextjs";

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  const postId = params.postId;

  // Fetch the post along with its comments
  const post = await prismadb.post.findUnique({
    where: { id: postId },
    include: { comments: true },
  });

  if (!post) {
    return Response.json({ error: "Post not found", status: 404 });
  }

  // Fetch the user associated with the createdBy field and map to comments
  const comments = await Promise.all(
    post.comments.map(async (comment) => {
      const user = await clerkClient.users.getUser(comment.createdBy);
      return { ...comment, user };
    })
  );

  // Combine post with comments containing user info and return the response
  const postResponse = { ...post, comments };

  return Response.json({ post: postResponse, status: 200 });
}
