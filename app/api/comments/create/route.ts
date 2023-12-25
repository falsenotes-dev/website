import { create } from "@/lib/notifications/create-notification";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const data = await req.json();
    if (!data) {
      return new Response("No data provided", { status: 400 });
    }

    const { post, content, author } = data;

    // await sql`
    //   INSERT INTO comments (blogpostid, content, authorid)
    //   VALUES (${post}, ${content}, ${author})
    //   RETURNING *
    // `;
    await db.comment.create({
      data: {
        content: content,
        authorId: author,
        postId: post,
        parentId: null,
      },
    });

    // Get the author of the post and the post details
    const authorDetails = await db.user.findUnique({
      where: {
        id: author,
      },
    });

    const postDetails = await db.post.findUnique({
      where: {
        id: post,
      },
      include: {
        author: true,
      },
    });

    // Replace content with converted markdown
    const comment = content.replace(/<[^>]*>?/gm, "");

    if (author !== postDetails?.author.id) {
      // Send a notification to the author of the post using api/notifications post method body json
      const message = `"${postDetails?.title}: ${comment}"`;
      const type = "comment";
      const url = `/@${postDetails?.author.username}/${postDetails?.url}?commentsOpen=true`;
      if (postDetails?.authorId && authorDetails?.id) {
        await create({
          content: message,
          type,
          url,
          receiverId: postDetails.authorId || "",
          senderId: authorDetails.id || "",
        });
      }
    }

    return new NextResponse("Comment created", { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
