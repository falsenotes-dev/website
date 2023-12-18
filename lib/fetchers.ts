import { unstable_cache } from "next/cache";
import postgres from "./postgres";

export async function getPostsForSite() {
  return await unstable_cache(
    async () => {
      return postgres.post.findMany({
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
      return postgres.user.findMany({});
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
      return postgres.tag.findMany({
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
    return postgres.list.findMany({
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
