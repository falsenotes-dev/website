import { User } from "@prisma/client";
import db from "../db";
import { getFollowings } from "./session";

export const getTags = async ({
  id,
  page = 0,
  getStarted,
}: {
  id?: string | undefined;
  page?: number | undefined;
  getStarted?: boolean | undefined;
}) => {
  try {
    const whereClause =
      id !== undefined
        ? {
            followingtag: {
              none: {
                followerId: id,
              },
            },
            posts: getStarted
              ? {
                  some: {},
                }
              : undefined,
          }
        : {};

    const tags = await db.tag.findMany({
      where: whereClause,
      take: 10,
      skip: page * 10,
      orderBy: {
        posts: {
          _count: "desc",
        },
      },
      include: {
        _count: { select: { posts: true, followingtag: true } },
        followingtag: true,
      },
    });

    return { tags: JSON.parse(JSON.stringify(tags)) };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while fetching tags." };
  }
};

//popular tags which are not followed by the user
export const getPopularTags = async ({
  id,
  take = 5,
}: {
  id?: string | undefined;
  take?: number | undefined;
}) => {
  try {
    const whereClause =
      id !== undefined
        ? {
            followingtag: {
              none: {
                followerId: id,
              },
            },
          }
        : {};

    const tags = await db.tag.findMany({
      where: whereClause,
      take: take,
      orderBy: {
        followingtag: {
          _count: "desc",
        },
      },
      include: {
        _count: { select: { posts: true, followingtag: true } },
      },
    });

    return { tags: JSON.parse(JSON.stringify(tags)) };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while fetching tags." };
  }
};

export const searchTags = async ({
  search,
  page = 0,
  limit = 10,
}: {
  search: string | undefined;
  page?: number;
  limit?: number;
}) => {
  const tags = await db.tag.findMany({
    where:
      search !== undefined
        ? {
            name: {
              contains: search.replace(/\s+/g, "-").toLowerCase(),
              mode: "insensitive",
            },
          }
        : {},
    take: limit,
    skip: page * limit,
    include: {
      _count: { select: { posts: true, followingtag: true } },
    },
  });

  //sort by number of posts and then by number of followers
  if (typeof search === "string") {
    tags.sort((a, b) => {
      if (a._count.posts > b._count.posts) {
        return -1;
      }
      if (a._count.posts < b._count.posts) {
        return 1;
      }
      if (a._count.followingtag > b._count.followingtag) {
        return -1;
      }
      if (a._count.followingtag < b._count.followingtag) {
        return 1;
      }
      return 0;
    });
  }

  return { tags: JSON.parse(JSON.stringify(tags)) };
};

export async function getRelatedTags(tagName: string) {
  // Find all postTags that are related to the specific tag
  const postTags = await db.postTag.findMany({
    where: {
      tag: {
        name: tagName,
      },
    },
    select: {
      postId: true,
    },
  });

  // Find all postTags that are related to these posts
  const relatedPostTags = await db.postTag.findMany({
    where: {
      postId: {
        in: postTags.map((post: any) => post.postId),
      },
      NOT: {
        tag: {
          name: tagName,
        },
      },
    },
    select: {
      tag: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      postId: "desc",
    },
    take: 5,
  });

  // Extract all tags from these postTags
  let relatedTags = relatedPostTags.map((postTag: any) => postTag.tag);

  // Remove duplicates
  relatedTags = relatedTags.filter(
    (tag, index, self) => index === self.findIndex((t) => t.id === tag.id)
  );

  return { tags: JSON.parse(JSON.stringify(relatedTags)) };
}

export const getFollowersByUser = async ({
  id,
  page = 0,
  limit = 10,
}: {
  id: string | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}) => {
  const followers = await db.tag.findMany({
    where: { followingtag: { some: { followerId: id } } },
    take: limit,
    skip: page * limit,
    include: {
      _count: { select: { posts: true, followingtag: true } },
      followingtag: true,
    },
  });

  return { followers: JSON.parse(JSON.stringify(followers)) };
};

export const getFollowersByTag = async ({
  id,
  page = 0,
  limit = 10,
  session,
}: {
  id: string | undefined;
  page?: number | undefined;
  limit?: number | undefined;
  session: User["id"] | undefined;
}) => {
  const { followings: sessionFollowings } = await getFollowings({
    id: session,
  });
  const sessionFollowingIds = sessionFollowings
    ? [
        ...sessionFollowings.map((following: any) => following.following.id),
        session,
      ]
    : [session];
  const followers = await db.tagFollow.findMany({
    where: {
      tagId: id,
      ...(session && { followerId: { not: { in: sessionFollowingIds } } }),
    },
    take: limit,
    skip: page * limit,
    select: {
      follower: {
        include: {
          _count: {
            select: {
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
              Followers: true,
            },
          },
          Followers: true,
        },
      },
    },
    orderBy: {
      follower: {
        Followers: {
          _count: "desc",
        },
      },
    },
  });

  return { followers: JSON.parse(JSON.stringify(followers)) };
};
