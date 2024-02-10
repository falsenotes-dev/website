import db from "@/lib/db";
import { getSessionUser } from "../get-session-user";
import { getFollowingTags, getFollowings } from "@/lib/prisma/session";

export const fetchUsers = async ({
  id,
  limit = 3,
}: {
  id?: string | undefined;
  limit?: number | undefined;
}) => {
  //if id not defined, get the current user's followed tags
  const followedTags = !id
    ? []
    : (await getFollowingTags({ id: id })).followingTags;

  //fetch posts' authors according to the followed tags and other user who followed that tag
  const followedTagsAuthors = await Promise.all(
    followedTags.map((tagFollower: any) =>
      db.user.findMany({
        where: {
          tagfollower: {
            some: {
              tagId: tagFollower.tagId,
            },
          },
          id: {
            not: id,
          },
        },
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
      })
    )
  );
  const tagsPosts = await db.post.findMany({
    where: {
      published: true,
      tags: {
        some: {
          id: {
            in: followedTags.map((tagFollower: any) => tagFollower.tagId),
          },
        },
      },
    },
    select: {
      authorId: true,
    },
  });

  const authors = await db.user.findMany({
    where: {
      id: {
        in: tagsPosts.map((post) => post.authorId),
      },
    },
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

  const users = [
    ...authors,
    ...followedTagsAuthors.reduce((acc, val) => acc.concat(val), []),
  ];

  //remove duplicates and the current user
  const uniqueUsers = users.filter(
    (user, index, self) =>
      index === self.findIndex((u) => u.id === user.id) && user.id !== id
  );

  //sort the users by followers and posts count
  const sortedUsers = uniqueUsers.sort((a, b) => {
    const aFollowers = a.Followers._count;
    const bFollowers = b.Followers._count;
    const aPosts = a._count.posts;
    const bPosts = b._count.posts;
    return bFollowers - aFollowers || bPosts - aPosts;
  });

  const userFollowings = id ? (await getFollowings({ id })).followings : [];

  //remove the users that the current user is following
  const filteredUsers = sortedUsers.filter(
    (user) =>
      !userFollowings.find(
        (following: any) => following.following.id == user.id
      ) && user.id !== id
  );

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

  filteredUsers.length > limit && filteredUsers.splice(limit);

  return { users: JSON.parse(JSON.stringify(id ? filteredUsers : topUsers)) };
};
