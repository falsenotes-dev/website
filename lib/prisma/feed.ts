"use server";
import { getSessionUser } from "@/components/get-session-user";
import db from "../db";
import { getFollowings } from "./session";

const getLikes = async ({ id }: { id: string | undefined }) => {
  const likes = await db.like.findMany({
    where: { authorId: id },
    select: {
      postId: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return { likes: JSON.parse(JSON.stringify(likes)) };
};

const getBookmarks = async ({ id }: { id: string | undefined }) => {
  const bookmarks = await db.bookmark.findMany({
    where: { userId: id },
    select: {
      postId: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return { bookmarks: JSON.parse(JSON.stringify(bookmarks)) };
};

const getHistory = async ({ id }: { id: string | undefined }) => {
  const history = await db.readingHistory.findMany({
    where: { userId: id },
    select: {
      postId: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return { history: JSON.parse(JSON.stringify(history)) };
};
const getHistoryAuthorPost = async ({ id }: { id: string | undefined }) => {
  const historyAuthor = await db.readingHistory.findMany({
    where: { userId: id },
    select: {
      post: {
        select: {
          authorId: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  const history = await db.post.findMany({
    where: {
      authorId: { in: historyAuthor.map((history) => history.post.authorId) },
    },
    select: {
      id: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return { history: JSON.parse(JSON.stringify(history)) };
};

const getFollowingTags = async ({ id }: { id: string | undefined }) => {
  const followingTags = await db.tagFollow.findMany({
    where: { followerId: id },
    select: {
      tagId: true,
      tag: {
        include: {
          posts: {
            select: {
              createdAt: true,
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

  const followingTagsWithLatestPostDate = followingTags?.map((tagFollower) => {
    const latestPostDate = tagFollower.tag.posts[0]?.createdAt;

    return {
      ...tagFollower,
      latestPostDate,
    };
  });

  const sortedFollowingTags = followingTagsWithLatestPostDate?.sort(
    (a, b) =>
      new Date(b.latestPostDate).getTime() -
      new Date(a.latestPostDate).getTime()
  );

  const tagIds = sortedFollowingTags.map((following) => following.tagId);

  const posts = await db.postTag.findMany({
    where: { tagId: { in: tagIds } },
    select: {
      postId: true,
    },
    orderBy: {
      post: {
        publishedAt: "desc",
      },
    },
  });

  return { followingTags: JSON.parse(JSON.stringify(posts)) };
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
      tagId: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  const tagIds = followings.map((following) => following.tagId);

  const posts = await db.postTag.findMany({
    where: { tagId: { in: tagIds } },
    select: {
      postId: true,
    },
    orderBy: {
      post: {
        publishedAt: "desc",
      },
    },
  });

  return { followings: JSON.parse(JSON.stringify(posts)) };
};

const getTags = async ({ id }: { id: string | undefined }) => {
  const tags = await db.tagFollow.findMany({
    where: { followerId: id },
    select: {
      tagId: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  const tagIds = tags.map((tag) => tag.tagId);

  const postTags = await db.postTag.findMany({
    where: { tagId: { in: tagIds } },
    select: {
      postId: true,
    },
    orderBy: {
      post: {
        publishedAt: "desc",
      },
    },
  });

  return { postTags: JSON.parse(JSON.stringify(postTags)) };
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

  // Fetch the tags of the posts in parallel
  const tags = await db.postTag.findMany({
    where: {
      postId: {
        in: [
          ...userLikes.map((like: any) => like.postId),
          ...userBookmarks.map((bookmark: any) => bookmark.postId),
          ...userHistory.map((history: any) => history.postId),
          ...userTags.map((tag: any) => tag.postId),
          ...userFollowings.map((following: any) => following.postId),
          ...userFollowingTags.map((following: any) => following.postId),
        ],
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
    where: { id: { in: historyAuthor.map((post: any) => post.id) } },
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
      where: { tag: { name: { equals: tab } } },
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
