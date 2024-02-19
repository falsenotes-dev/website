import {
  getListsForSite,
  getPostsForSite,
  getTagsForSite,
  getUsersForSite,
} from "@/lib/fetchers";

export default async function Sitemap() {
  const domain = process.env.DOMAIN;

  const posts = await getPostsForSite();
  const users = await getUsersForSite();
  const tags = await getTagsForSite();
  const lists = await getListsForSite();

  return [
    {
      url: domain,
      lastModified: new Date(),
    },
    {
      url: `${domain}/explore`,
      lastModified: new Date(),
    },
    {
      url: `${domain}/explore/posts`,
      lastModified: new Date(),
    },
    {
      url: `${domain}/explore/users`,
      lastModified: new Date(),
    },
    {
      url: `${domain}/explore/tags`,
      lastModified: new Date(),
    },
    {
      url: `${domain}/explore/lists`,
      lastModified: new Date(),
    },
    {
      url: `${domain}/signin`,
      lastModified: new Date(),
    },
    {
      url: `${domain}/tags`,
      lastModified: new Date(),
    },
    ...users.map(({ username }) => ({
      url: `${domain}/@${username}`,
      lastModified: new Date(),
    })),
    ...users.map(({ username }) => ({
      url: `${domain}/@${username}/about`,
      lastModified: new Date(),
    })),
    ...users.map(({ username }) => ({
      url: `${domain}/@${username}/lists`,
      lastModified: new Date(),
    })),
    ...posts.map(({ url, author, updatedAt, publishedAt }) => ({
      url: `${domain}/@${author.username}/${url}`,
      lastModified: updatedAt || publishedAt || new Date(),
    })),
    ...tags.map(({ name }) => ({
      url: `${domain}/tags/${name}`,
      lastModified: new Date(),
    })),
    ...lists.map(({ slug, updatedAt, author }) => ({
      url: `${domain}/@${author.username}/list/${slug}`,
      lastModified: updatedAt || new Date(),
    })),
  ];
}
