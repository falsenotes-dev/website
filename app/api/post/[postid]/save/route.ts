import { getSessionUser } from "@/components/get-session-user";
import db from "@/lib/db";

export async function POST(res: Request) {
  try {
    const { postId } = await res.json();
    const user = await getSessionUser();
    if (!user) {
      console.log("No session user");
      return new Response(null, { status: 401 });
    }
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) {
      return new Response(null, { status: 404 });
    }
    const isSaved = await db.bookmark.findFirst({
      where: {
        postId,
        userId: user.id,
      },
    });
    if (isSaved) {
      await db.bookmark.delete({
        where: {
          id: isSaved.id,
        },
      });
      console.log("Deleted bookmark");
    } else {
      await db.bookmark.create({
        data: {
          post: {
            connect: {
              id: postId,
            },
          },
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
      console.log("Created bookmark");
    }
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}
