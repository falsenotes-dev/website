"use server";
import postgres from "../db";

const baseQuery = {
  include: {
    author: {
      include: {
        _count: { select: { posts: true, Followers: true, Followings: true } },
      },
    },
    savedUsers: true,
    _count: {
      select: {
        likes: true,
        savedUsers: true,
        readedUsers: true,
        shares: true,
        comments: true,
      },
    },
    tags: {
      take: 1,
      include: {
        tag: true,
      },
    },
    publication: {
      include: {
        _count: { select: { posts: true, Followers: true, Followings: true } },
      },
    },
  },
};

export const getPosts = async ({
  search,
  page = 0,
  limit = 10,
}: {
  search?: string | undefined;
  page?: number;
  limit?: number;
}) => {
  const orderByQuery =
    typeof search !== undefined
      ? [
          {
            readedUsers: {
              _count: "desc" as const,
            },
          },
          {
            likes: {
              _count: "desc" as const,
            },
          },
          { views: "desc" as const },
        ]
      : { publishedAt: "desc" as const };
  const posts = await postgres.post.findMany({
    ...baseQuery,
    where:
      search !== undefined
        ? {
            OR: [
              {
                title: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                subtitle: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
            published: true,
          }
        : { published: true },
    take: limit,
    skip: page * limit,
    orderBy: orderByQuery,
  });

  return { posts: JSON.parse(JSON.stringify(posts)) };
};

export const getPost = async ({
  search,
  page = 0,
  limit = 10,
  whereQuery,
  id,
}: {
  search?: string | undefined;
  page?: number;
  limit?: number;
  whereQuery?: any;
  id: string | undefined;
}) => {
  const mainQuery =
    search !== undefined
      ? {
          ...whereQuery,
          title: {
            contains: search,
            mode: "insensitive",
          },
        }
      : { ...whereQuery };
  const posts = await postgres.post.findMany({
    ...baseQuery,
    where: { ...mainQuery, authorId: id },
    take: limit,
    skip: page * limit,
    orderBy: {
      publishedAt: "desc",
    },
  });

  // // Sort the posts in the application code
  // const sortedPosts = posts.sort((a, b) => {
  //   // If both posts are published, sort by publishedAt
  //   if (a.published && b.published) {
  //     return (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0);
  //   }
  //   // If one post is not published, sort by createdAt
  //   else {
  //     return b.createdAt.getTime() - a.createdAt.getTime();
  //   }
  // });

  return { posts: JSON.parse(JSON.stringify(posts)) };
};
export const getUserPost = async ({
  search,
  page = 0,
  limit = 10,
  whereQuery,
  id,
}: {
  search?: string | undefined;
  page?: number;
  limit?: number;
  whereQuery?: any;
  id: string | undefined;
}) => {
  const mainQuery =
    search !== undefined
      ? {
          ...whereQuery,
          title: {
            contains: search,
            mode: "insensitive",
          },
          published: true,
        }
      : { ...whereQuery, published: true };
  const posts = await postgres.post.findMany({
    ...baseQuery,
    where: { ...mainQuery, OR: [{ authorId: id }, { publicationId: id }] },
    take: limit,
    skip: page * limit,
    orderBy: {
      publishedAt: "desc",
    },
  });

  // // Sort the posts in the application code
  // const sortedPosts = posts.sort((a, b) => {
  //   // If both posts are published, sort by publishedAt
  //   if (a.published && b.published) {
  //     return (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0);
  //   }
  //   // If one post is not published, sort by createdAt
  //   else {
  //     return b.createdAt.getTime() - a.createdAt.getTime();
  //   }
  // });

  return { posts: JSON.parse(JSON.stringify(posts)) };
};

export const getFeaturedPosts = async ({
  limit = 10,
  page = 0,
}: {
  limit?: number;
  page?: number;
}) => {
  //fetch featured posts (recommended) for guest users
  const posts = await postgres.post.findMany({
    ...baseQuery,
    where: { published: true },
    take: limit,
    skip: page * limit,
    orderBy: {
      publishedAt: "desc",
    },
  });

  return { posts: JSON.parse(JSON.stringify(posts)) };
};

export const getPopularPostsOfTheWeek = async ({
  limit = 10,
  page = 0,
}: {
  limit?: number;
  page?: number;
}) => {
  //fetch popular posts of the week, by views and likes which duration is 7 days
  const posts = await postgres.post.findMany({
    ...baseQuery,
    where: {
      published: true,
      publishedAt: {
        gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      },
    },
    take: limit,
    skip: page * limit,
    orderBy: [
      {
        views: "desc",
      },
      {
        likes: {
          _count: "desc",
        },
      },
      {
        readedUsers: {
          _count: "desc",
        },
      },
    ],
  });

  return { posts: JSON.parse(JSON.stringify(posts)) };
};

export const getPopularPostsOfTheMonth = async ({
  limit = 10,
  page = 0,
}: {
  limit?: number;
  page?: number;
}) => {
  //fetch popular posts of the month, by views and likes which duration is 30 days
  const posts = await postgres.post.findMany({
    ...baseQuery,
    where: {
      published: true,
      publishedAt: {
        gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    take: limit,
    skip: page * limit,
    orderBy: [
      {
        views: "desc",
      },
      {
        likes: {
          _count: "desc",
        },
      },
      {
        readedUsers: {
          _count: "desc",
        },
      },
    ],
  });

  return { posts: JSON.parse(JSON.stringify(posts)) };
};
