import prismadb from "@/lib/prismadb";
import { auth, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { postId: string } }) {
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

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const postId = params.slug;
  const { userId } = await request.json();

  // Check if the user ID already exists in the likes array
  const post = await prismadb.post.findFirst({
    where: { id: postId },
  });

  if (!post) {
    return Response.json({ error: "Post not found", status: 404 });
  }

  const userLiked = post.likes.includes(userId);

  // Update the post with the user's ID added or removed from the likes array
  await prismadb.post.updateMany({
    where: { id: postId },
    data: {
      likes: {
        // Conditionally add or remove the user's ID from the likes array
        set: userLiked
          ? post.likes.filter((id) => id !== userId)
          : [...post.likes, userId],
      },
    },
  });

  return Response.json({ status: 201 });
}

export async function DELETE(req: Request, { params }: { params: { postId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // First, delete associated comments
    await prismadb.comment.deleteMany({
      where: {
        postId: params.postId
      }
    });

    await prismadb.post.deleteMany({
      where: {
        id: params.postId
      }
    })

    return new NextResponse("Post deleted!", { status: 200 })
  } catch (error) {
    console.log('[POSTS_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { postId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, topic, content, description, tags, image } = await req.json();

    // Update the post with the provided data
    const updatedPost = await prismadb.post.updateMany({
      where: { id: params.postId },
      data: {
        title,
        topic,
        content,
        description,
        tags,
        image,
        updatedAt: new Date(),
      },
    });

    if (!updatedPost) {
      return new NextResponse("Post not found", { status: 404 });
    }

    return new NextResponse("Post updated successfully!", { status: 200 });
  } catch (error) {
    console.log('[POSTS_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}