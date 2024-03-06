import { unstable_cache } from "next/cache";
import db from "./db";
import { User } from "@prisma/client";

export async function getPostsForSite() {
  return await unstable_cache(
    async () => {
      return db.post.findMany({
        where: {
          published: true,
        },
        select: {
          title: true,
          subtitle: true,
          url: true,
          cover: true,
          publishedAt: true,
          updatedAt: true,
          updated: true,
          author: {
            select: {
              username: true,
            },
          },
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });
    },
    [`$posts`],
    {
      revalidate: 900,
      tags: [`$posts`],
    }
  )();
}

export async function getUsersForSite() {
  return await unstable_cache(
    async () => {
      return db.user.findMany({});
    },
    [`$users`],
    {
      revalidate: 900,
      tags: [`$users`],
    }
  )();
}

export async function getTagsForSite() {
  return await unstable_cache(
    async () => {
      return db.tag.findMany({
        where: {
          posts: {
            some: {},
          },
        },
      });
    },
    [`$tags`],
    {
      revalidate: 900,
      tags: [`$tags`],
    }
  )();
}

export async function getListsForSite() {
  return await unstable_cache(async () => {
    return db.list.findMany({
      where: {
        visibility: "public",
      },
      select: {
        slug: true,
        updatedAt: true,
        createdAt: true,
        author: true,
      },
    });
  })();
}

export async function getPostData(username: string, url: string, author: User) {
  return await unstable_cache(
    async () => {
      let post = await db.post.findFirst({
        where: {
          url: url,
          OR: [
            {
              authorId: author?.id,
            },
            {
              publicationId: author?.id,
            },
          ],
        },
        include: {
          comments: {
            where: { parentId: null },
            include: {
              replies: {
                include: {
                  _count: { select: { replies: true, likes: true } },
                },
              },
              _count: { select: { replies: true, likes: true } },
              likes: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          likes: true,

          readedUsers: true,
          author: {
            include: {
              _count: {
                select: { posts: true, Followers: true, Followings: true },
              },
              Followers: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
          publication: {
            include: {
              Followers: true,
              Followings: true,
            },
          },
          savedUsers: true,
          _count: { select: { savedUsers: true, likes: true, comments: true } },
        },
      });

      //if post has not publicationId or publicationId is equal to authorId
      if (post?.publicationId && username === post?.author?.username) {
        return null;
      }

      if (post?.publicationId === null) {
        post = await await db.post.findFirst({
          where: {
            url: url,
            authorId: author?.id,
          },
          include: {
            comments: {
              where: { parentId: null },
              include: {
                replies: {
                  include: {
                    _count: { select: { replies: true, likes: true } },
                  },
                },
                _count: { select: { replies: true, likes: true } },
                likes: true,
              },
              orderBy: {
                createdAt: "desc",
              },
            },
            likes: true,

            readedUsers: true,
            author: {
              include: {
                _count: {
                  select: { posts: true, Followers: true, Followings: true },
                },
                Followers: true,
              },
            },
            tags: {
              include: {
                tag: true,
              },
            },
            publication: {
              include: {
                Followers: true,
                Followings: true,
              },
            },
            savedUsers: true,
            _count: {
              select: { savedUsers: true, likes: true, comments: true },
            },
          },
        });
      }

      if (!post) return null;

      return {
        ...post,
      };
    },
    [`${username}-${url}`],
    {
      revalidate: 900, // 15 minutes
      tags: [`${username}-${url}`],
    }
  )();
}
