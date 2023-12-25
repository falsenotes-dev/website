import { getSessionUser } from "@/components/get-session-user";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { commentId } = await req.json();
    const user = await getSessionUser();
    if (!user) {
      console.log("No session user");
      return new Response(null, { status: 401 });
    }
    const comment = await db.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (!comment) {
      return new Response(null, { status: 404 });
    }
    const isLiked = await db.commentLike.findFirst({
      where: {
        commentId,
        authorId: user.id,
      },
    });
    if (isLiked) {
      await db.commentLike.delete({
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
            receiverId: comment.authorId,
            type: "commentLike",
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
    } else {
      const commentLike = await db.commentLike.create({
        data: {
          commentId,
          authorId: user.id,
        },
        include: {
          comment: {
            select: {
              post: {
                include: {
                  author: {
                    select: {
                      username: true,
                    },
                  },
                },
              },
              content: true,
            },
          },
        },
      });

      const sender = await db.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          id: true,
          username: true,
        },
      });

      const receiver = await db.user.findUnique({
        where: {
          id: comment.authorId,
        },
        select: {
          id: true,
        },
      });

      if (sender && receiver) {
        const message = `"${commentLike.comment.content}"`;
        const type = "commentLike";
        const url = `/@${commentLike.comment.post.author.username}/${commentLike.comment.post.url}?commentsOpen=true`;
        await db.notification.create({
          data: {
            content: message,
            type,
            url,
            receiverId: receiver?.id || "",
            senderId: sender?.id || "",
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
