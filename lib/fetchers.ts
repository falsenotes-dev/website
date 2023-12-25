import { unstable_cache } from "next/cache";
import db from "./db";

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
