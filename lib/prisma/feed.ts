"use server";
import { getSessionUser } from "@/components/get-session-user";
import db from "../db";
import { getFollowings } from "./session";

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
    take: 10,
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
    take: 10,
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
    take: 10,
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
    take: 10,
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
            take: 1,
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
            take: 1,
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
  if (!user) {
    return null;
  }
  const { id } = user;

  //get user's interests
  const [
    { likes: userLikes },
    { bookmarks: userBookmarks },
    { history: userHistory },
    { postTags: userTags },
    { followings: userFollowings },
    { followingTags: userFollowingTags },
  ] = await Promise.all([
    getLikes({ id }),
    getBookmarks({ id }),
    getHistory({ id }),
    getTags({ id }),
    getFollowingsUsers({ id }),
    getFollowingTags({ id }),
  ]);

  const interests = [
    ...userLikes,
    ...userBookmarks,
    ...userHistory,
    ...userTags,
    ...userFollowings,
    ...userFollowingTags,
  ];
  // rewmove duplicates
  const uniqueInterests = interests.filter(
    (interest, index) => interests.indexOf(interest) === index
  );

  // Fetch the tags of the posts in parallel
  const tags = await db.postTag.findMany({
    where: {
      postId: {
        in: uniqueInterests,
      },
    },
    select: {
      tagId: true,
    },
  });

  // Count the occurrences of each tag
  const tagCounts = tags.reduce((counts, tag) => {
    counts[tag.tagId] = (counts[tag.tagId] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  // Sort the tags by their count in descending order
  const sortedTagIds = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([tagId]) => tagId);

  const { history: historyAuthor } = await getHistoryAuthorPost({ id });

  const postsByTags = await db.post.findMany({
    where: { tags: { some: { tagId: { in: sortedTagIds } } } },
    select: { id: true },
  });

  const postsByHistory = await db.post.findMany({
    where: { id: { in: historyAuthor } },
    select: { id: true },
  });

  const posts = [...postsByTags, ...postsByHistory];
  // remove duplicates
  const uniquePosts = posts.filter(
    (post, index) => posts.findIndex((p) => p.id === post.id) === index
  );

  return fetchFeed({
    where: {
      id: { in: uniquePosts.map((post) => post.id) },
      published: true,
      OR: [{ authorId: { not: id } }, { publicationId: { not: id } }],
    },
    ...baseQuery,
    take: Number(limit),
    skip: page * Number(limit),
  });
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
    const postTags = await db.postTag.findMany({
      select: { postId: true },
      where: { tag: { name: { equals: tab } }, post: { published: true } },
    });
    const postIds = postTags.map((postTag) => postTag.postId);
    return fetchFeed({
      ...baseQuery,
      take: Number(limit),
      skip: page * Number(limit),
      where: {
        id: { in: postIds },
        published: true,
        OR: [{ authorId: { not: id } }, { publicationId: { not: id } }],
      },
    });
  }
};
