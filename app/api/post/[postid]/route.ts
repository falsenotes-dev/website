import { getSessionUser } from "@/components/get-session-user";
import { insertTag } from "@/lib/insert-tag";
import db from "@/lib/db";
import { Post } from "@prisma/client";
import readingTime from "reading-time";
import { z } from "zod";

export async function PATCH(
  req: Request,
  { params }: { params: { postid: string } }
) {
  try {
    const { postid } = params;

    const session = await getSessionUser();

    if (!session) {
      return new Response(null, { status: 401 });
    }

    if (!(await verifyCurrentUserHasAccessToPost(postid))) {
      return new Response(null, { status: 403 });
    }
    const data = await req.json();

    if (!data) {
      return new Response("No data provided", { status: 400 });
    }

    const {
      title,
      content,
      coverImage,
      published,
      tags,
      url,
      commentsOn,
      likesOn,
      subtitle,
      pinned,
    } = data;
    const stats = readingTime(content);
    const readTime = stats.text;

    if (!title) {
      return new Response("No title provided", { status: 400 });
    }
    if (!content) {
      return new Response("No content provided", { status: 400 });
    }

    const oldData = await db.post.findFirst({
      where: {
        id: postid,
      },
      select: {
        published: true,
      },
    });

    //if pinned is true, then we need to unpin all other posts
    if (pinned) {
      await db.post.updateMany({
        where: {
          authorId: session.id,
        },
        data: {
          pinned: false,
        },
      });
    }

    await db.post.update({
      where: {
        id: postid,
      },
      data: {
        title: title,
        content: content,
        cover: coverImage || null,
        published: published,
        url: url,
        subtitle: subtitle || null,
        readingTime: readTime,
        allowComments: commentsOn,
        allowLikes: likesOn,
        pinned: pinned,
        ...(oldData?.published === false &&
          published === true && { publishedAt: new Date() }),
        ...(oldData?.published === true &&
          published === true && { modifiedAt: new Date(), updated: true }),
      },
    });

    await db.postTag.deleteMany({
      where: {
        postId: postid,
      },
    });

    await insertTag(tags, postid);

    return new Response(null, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }
    console.error(error);
    return new Response(null, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { postid: string } }
) {
  if (params.postid === "undefined") {
    return new Response("No postid provided", { status: 400 });
  }
  const { postid } = params;

  if (!postid) {
    return new Response("No postid provided", { status: 400 });
  }

  try {
    const post = await db.post.findUnique({
      where: {
        id: postid,
      },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    if (!(await verifyCurrentUserHasAccessToPost(post.id))) {
      return new Response(null, { status: 403 });
    }

    const postWithRelations = await db.post.findUnique({
      where: { id: post.id },
      include: {
        comments: true,
        likes: true,
        drafts: true,
        tags: true,
        readedUsers: true,
        savedUsers: true,
        shares: true,
      },
    });

    // Disconnect all connections of the post
    if (postWithRelations) {
      await db.post.update({
        where: { id: post.id },
        data: {
          comments: {
            disconnect: postWithRelations.comments,
          },
          likes: {
            disconnect: postWithRelations.likes,
          },
          drafts: {
            disconnect: postWithRelations.drafts,
          },
          tags: {
            disconnect: postWithRelations.tags,
          },
          readedUsers: {
            disconnect: postWithRelations.readedUsers,
          },
          savedUsers: {
            disconnect: postWithRelations.savedUsers,
          },
          shares: {
            disconnect: postWithRelations.shares,
          },
        },
      });

      await await db.like.deleteMany({
        where: {
          postId: post.id,
        },
      });
      await db.draftPost.deleteMany({
        where: {
          postId: post.id,
        },
      });
      await db.postTag.deleteMany({
        where: {
          postId: post.id,
        },
      });
      await db.readingHistory.deleteMany({
        where: {
          postId: post.id,
        },
      });
      await db.bookmark.deleteMany({
        where: {
          postId: post.id,
        },
      });
      await db.postShare.deleteMany({
        where: {
          postId: post.id,
        },
      });
    }

    // Delete the post.
    await db.post.delete({
      where: {
        id: post.id,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }
    console.error(error);
    return new Response(null, { status: 500 });
  }
}

async function verifyCurrentUserHasAccessToPost(postId: string) {
  try {
    const session = await getSessionUser();
    const count = await db.post.count({
      where: {
        id: postId,
        authorId: session?.id,
      },
    });

    return count > 0;
  } catch (error) {
    console.error(error);
    return false;
  }
}
