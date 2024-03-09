"use server";
import { getSessionUser } from "@/components/get-session-user";
import db from "../db";
import { getFollowings } from "./session";
import { User } from "@prisma/client";

const getLikes = async ({ id }: { id: string | undefined }) => {
  const likes = await db.like.findMany({
    where: { authorId: id },
    select: {
      post: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  return { likes: likes.map((like) => like.post.id) };
};

const getBookmarks = async ({ id }: { id: string | undefined }) => {
  const bookmarks = await db.bookmark.findMany({
    where: { userId: id },
    select: {
      post: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  return { bookmarks: bookmarks.map((bookmark) => bookmark.post.id) };
};

const getHistory = async ({ id }: { id: string | undefined }) => {
  const history = await db.readingHistory.findMany({
    where: { userId: id, erased: false },
    select: {
      post: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  return { history: history.map((history) => history.post.id) };
};

const getHistoryAuthorPost = async ({ id }: { id: string | undefined }) => {
  const historyAuthor = await db.readingHistory.findMany({
    where: { userId: id, erased: false },
    select: {
      post: {
        select: {
          authorId: true,
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  return { history: historyAuthor.map((history) => history.post.id) };
};

const getFollowingTags = async ({ id }: { id: string | undefined }) => {
  const followingTags = await db.tagFollow.findMany({
    where: { followerId: id },
    select: {
      tag: {
        select: {
          posts: {
            select: {
              postId: true,
            },
            take: 3,
          },
        },
      },
    },
  });

  return {
    followingTags: followingTags.flatMap((followingTag) =>
      followingTag.tag.posts.map((post) => post.postId)
    ),
  };
};

const getFollowingsUsers = async ({ id }: { id: string | undefined }) => {
  const { followings: sessionFollowingsArray } = await getFollowings({ id });
  const sessionFollowings = sessionFollowingsArray?.followings?.map(
    (following: any) => following.following
  );

  const followings = await db.tagFollow.findMany({
    where: {
      followerId: {
        in: sessionFollowings?.map((following: any) => following.id),
      },
    },
    select: {
      tag: {
        select: {
          posts: {
            select: {
              postId: true,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 3,
          },
        },
      },
    },
  });

  return {
    followings: followings.flatMap((following) =>
      following.tag.posts.map((post) => post.postId)
    ),
  };
};

const getTags = async ({ id }: { id: string | undefined }) => {
  const tags = await db.tagFollow.findMany({
    where: { followerId: id },
    select: {
      tag: {
        select: {
          posts: {
            select: {
              postId: true,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 3,
          },
        },
      },
    },
  });

  return {
    postTags: tags.flatMap((tag) => tag.tag.posts.map((post) => post.postId)),
  };
};

const baseQuery = {
  orderBy: { publishedAt: "desc" },
  select: {
    id: true,
    title: true,
    subtitle: true,
    url: true,
    cover: true,
    published: true,
    createdAt: true,
    updatedAt: true,
    publishedAt: true,
    readingTime: true,
    allowLikes: true,
    allowComments: true,
    views: true,
    author: {
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
        bio: true,
        verified: true,
        falsemember: true,
        createdAt: true,
        _count: { select: { Followers: true, Followings: true } },
      },
    },
    likes: true,
    savedUsers: { select: { userId: true } },
    _count: {
      select: {
        likes: true,
        savedUsers: true,
        lists: true,
        readedUsers: true,
        shares: true,
        comments: true,
      },
    },
    tags: {
      take: 1,
      select: {
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

export const getForYou = async ({
  page = 0,
  limit = 10,
}: {
  page?: number;
  limit?: number | undefined;
}) => {
  const user = await getSessionUser();
  if (!user) return null;
  const { id } = user;

  // Get interests (likes, bookmarks, history, tags, followings, followingTags) in parallel
  const [
    userLikes,
    userBookmarks,
    userHistory,
    userTags,
    userFollowings,
    userFollowingTags,
  ] = await Promise.all([
    getLikes({ id }),
    getBookmarks({ id }),
    getHistory({ id }),
    getTags({ id }),
    getFollowingsUsers({ id }),
    getFollowingTags({ id }),
  ]);

  const interests = [
    ...userLikes.likes,
    ...userBookmarks.bookmarks,
    ...userHistory.history,
    ...userTags.postTags,
    ...userFollowings.followings,
    ...userFollowingTags.followingTags,
  ];

  // Remove duplicates and fetch posts in one go
  const uniqueInterests = [...new Set(interests)];
  const posts = await fetchPostsByInterests({
    interests: uniqueInterests,
    userId: id,
  });

  return fetchFeed({
    where: { id: { in: posts }, published: true },
    ...baseQuery,
    take: Number(limit),
    skip: page * Number(limit),
  });
};

const fetchPostsByInterests = async ({
  interests,
  userId,
}: {
  interests: any[];
  userId: User["id"];
}) => {
  // Combine queries to fetch posts by tags and history
  const [postsByTags, postsByHistory] = await Promise.all([
    db.post.findMany({
      where: { tags: { some: { tagId: { in: interests } } } },
      select: { id: true },
    }),
    db.post.findMany({
      where: { authorId: userId, id: { in: interests } },
      select: { id: true },
    }),
  ]);

  return [
    ...new Set([...postsByTags, ...postsByHistory].map((post) => post.id)),
  ];
};

const fetchFeed = async (query: any) => {
  try {
    const feed = await db.post.findMany(query);
    return { feed: JSON.parse(JSON.stringify(feed)) };
  } catch (error) {
    return { error };
  }
};

export const getFeed = async ({
  page = 0,
  tab,
  limit = 10,
}: {
  page?: number | undefined;
  tab?: string | undefined;
  limit?: number | undefined;
}) => {
  const user = await getSessionUser();
  if (!user) {
    return null;
  }
  const { id } = user;
  if (!tab) {
    return await getForYou({ page });
  }

  if (tab) {
    if (tab == "following") {
      const following = await db.follow.findMany({
        select: { followingId: true },
        where: { followerId: id },
      });
      const followingIds = following.map((user) => user.followingId);
      return fetchFeed({
        ...baseQuery,
        take: Number(limit),
        skip: page * Number(limit),
        where: { authorId: { in: followingIds }, published: true },
        select: {
          ...baseQuery.select,
          author: {
            include: {
              Followers: true,
              Followings: true,
            },
          },
        },
      });
    }
  }
};
