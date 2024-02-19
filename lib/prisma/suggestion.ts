"use server";

import { User } from "@prisma/client";
import db from "../db";
import { getFollowingTags, getFollowings } from "./session";
import { getSessionUser } from "@/components/get-session-user";

// get suggested users for a session user to follow
export async function suggestedUsers({
  id,
  limit = 5,
}: {
  id: User["id"];
  limit?: number;
}) {
  const { followingTags: usersTags } = await getFollowingTags({ id });

  const session = await getSessionUser();
  const { followings: sessionFollowings } = await getFollowings({
    id: session?.id,
  });

  const users = await db.user.findMany({
    where: {
      tagfollower: {
        some: {
          tagId: {
            in: usersTags.map((tag: any) => tag.tagId),
          },
        },
      },
      AND: [
        {
          id: {
            not: id,
          },
        },
        {
          id: {
            notIn: sessionFollowings.map(
              (following: any) => following.following.id
            ),
          },
        },
        {
          id: {
            not: session?.id,
          },
        },
      ],
    },
    include: {
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

  return { users: JSON.parse(JSON.stringify(users)) };
}
