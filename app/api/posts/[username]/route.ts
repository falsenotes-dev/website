import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    // Get the 'slug' route parameter from the request object
    const username = params.username;
    const postUrl = req.nextUrl.searchParams.get("url");

    if (username === undefined || username === null) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (postUrl === undefined || postUrl === null) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    // Execute a query to fetch the specific user by name
    const author = await db.user.findFirst({
      where: {
        username: username,
      },
    });
    const authorID = author?.id;

    const result = await db.post.findFirst({
      where: {
        url: postUrl,
        authorId: authorID,
      },
      include: {
        comments: true,
        tags: true,
        likes: true,
        savedUsers: true,
        author: {
          include: {
            _count: {
              select: {
                posts: true,
                Followers: true,
                Followings: true,
              },
            },
            posts: {
              take: 4,
            },
          },
        },
      },
    });
    if (!result) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    // Return the user as JSON with status 200
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const username = params.username;
  const postid = req.nextUrl.searchParams.get("postid");

  if (username === undefined || username === null) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (postid === undefined || postid === null) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  try {
    const author = await db.user.findFirst({
      where: {
        username: username,
      },
      select: {
        id: true,
      },
    });
    const authorID = author?.id;

    //check if the post belongs to the user
    const result = await db.post.findFirst({
      where: {
        id: postid,
        authorId: authorID,
      },
    });
    if (!result) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    //check if the post has comments and tags
    const comments = await db.comment.findMany({
      where: {
        postId: postid,
      },
    });
    const tags = await db.postTag.findMany({
      where: {
        postId: postid,
      },
    });
    const likes = await db.like.findMany({
      where: {
        postId: postid,
      },
    });
    const saved = await db.bookmark.findMany({
      where: {
        postId: postid,
      },
    });
    if (comments.length !== 0) {
      await db.comment.deleteMany({
        where: {
          postId: postid,
        },
      });
    }
    if (tags.length !== 0) {
      await db.postTag.deleteMany({
        where: {
          postId: postid,
        },
      });
    }
    if (likes.length !== 0) {
      await db.like.deleteMany({
        where: {
          postId: postid,
        },
      });
    }
    if (saved.length !== 0) {
      await db.bookmark.deleteMany({
        where: {
          postId: postid,
        },
      });
    }
    await db.post.delete({
      where: {
        id: postid,
      },
    });
    return NextResponse.json({ message: "Post deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
