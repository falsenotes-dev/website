import { getPostsForSite, getTagsForSite, getUsersForSite } from "@/lib/fetchers";

export default async function Sitemap() {
  const domain = process.env.DOMAIN

  const posts = await getPostsForSite();
  const users = await getUsersForSite();
  const tags = await getTagsForSite();

  return [
    {
      url: domain,
      lastModified: new Date(),
    },
    ...posts.map(({ url, author }) => ({
      url: `${domain}/@${author.username}/${url}`,
      lastModified: new Date(),
    })),
    ...users.map(({ username }) => ({
      url: `${domain}/@${username}`,
      lastModified: new Date(),
    })),
    ...tags.map(({ name }) => ({
      url: `${domain}/tags/${name}`,
      lastModified: new Date(),
    })),
  ];
}
