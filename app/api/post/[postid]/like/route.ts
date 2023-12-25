import { getSessionUser } from "@/components/get-session-user";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { postId } = await req.json();
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
    const isLiked = await db.like.findFirst({
      where: {
        postId,
        authorId: user.id,
      },
    });
    if (isLiked) {
      await db.like.delete({
        where: {
          id: isLiked.id,
        },
      });

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      if (isLiked.createdAt > oneWeekAgo) {
        const notification = await db.notification.findFirst({
          where: {
            senderId: user.id,
            receiverId: post.authorId,
            type: "postLike",
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
          },
        });

        if (notification) {
          await db.notification.delete({
            where: {
              id: notification.id,
            },
          });
        }
      }

      console.log("Deleted like");
    } else {
      await db.like.create({
        data: {
          post: {
            connect: {
              id: postId,
            },
          },
          author: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      const sender = await db.user.findUnique({
        where: {
          id: user.id,
        },
      });
      const receiver = await db.user.findUnique({
        where: {
          id: post.authorId,
        },
      });
      if (sender && receiver) {
        const message = `"${post.title}"`;
        const type = "postLike";

        await db.notification.create({
          data: {
            content: message,
            type,
            url: `/@${sender.username}/${post.url}`,
            receiverId: receiver.id,
            senderId: sender.id,
          },
        });
      }
      console.log("Created like");
    }
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}
