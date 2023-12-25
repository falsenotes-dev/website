import { getSessionUser } from "@/components/get-session-user";
import { insertTag } from "@/lib/insert-tag";
import db from "@/lib/db";
import readingTime from "reading-time";
import { z } from "zod";

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

export async function PATCH(
  req: Request,
  { params }: { params: { postid: string } }
) {
  try {
    const { postid } = params;

    if (!(await verifyCurrentUserHasAccessToPost(postid))) {
      return new Response(null, { status: 403 });
    }
    const data = await req.json();

    if (!data) {
      return new Response("No data provided", { status: 400 });
    }

    const { title, content, coverImage, tags, url, subtitle } = data;
    const stats = readingTime(content);
    const readTime = stats.text;

    if (!title) {
      return new Response("No title provided", { status: 400 });
    }
    if (!content) {
      return new Response("No content provided", { status: 400 });
    }

    await db.postTag.deleteMany({
      where: {
        postId: postid,
      },
    });

    //check if draft is existing
    const draft = await db.draftPost.findFirst({
      where: {
        postId: postid,
      },
      select: {
        id: true,
      },
    });

    if (draft) {
      await db.draftPost.update({
        where: {
          id: draft.id,
        },
        data: {
          title,
          content,
          cover: coverImage || null,
          subtitle: subtitle || null,
        },
      });
    } else {
      await db.draftPost.create({
        data: {
          title,
          content,
          cover: coverImage || null,
          url,
          subtitle: subtitle || null,
          postId: postid,
        },
      });
    }

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
