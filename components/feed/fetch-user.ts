import db from "@/lib/db";
import { getSessionUser } from "../get-session-user";
import { getFollowings } from "@/lib/prisma/session";

export const fetchUsers = async ({
  id,
  limit = 3,
}: {
  id?: string | undefined;
  limit?: number | undefined;
}) => {
  const topUsers = await db.user.findMany({
    include: {
      Followers: true,
      Followings: true,
      _count: {
        select: {
          Followers: true,
          Followings: true,
          publicationsPosts: {
            where: {
              published: true,
            },
          },
          posts: {
            where: {
              published: true,
            },
          },
        },
      },
    },
    take: limit,
    where: id
      ? {
          id: {
            not: id,
          },
          Followers: {
            none: {
              followerId: id,
            },
          },
        }
      : {},
    orderBy: [
      {
        Followers: {
          _count: "desc",
        },
      },
      {
        posts: {
          _count: "desc",
        },
      },
    ],
  });

  return { users: JSON.parse(JSON.stringify(topUsers)) };
};
