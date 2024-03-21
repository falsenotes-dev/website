import MoreFromAuthor from "@/components/blog/more-from-author";
import RelatedPosts from "@/components/blog/related-posts";
import { SiteFooter } from "@/components/footer";
import { getSessionUser } from "@/components/get-session-user";
import { Separator } from "@/components/ui/separator";
import db from "@/lib/db";
import { getForYou } from "@/lib/prisma/feed";
import { getListByTags } from "@/lib/prisma/list";
import { getLists } from "@/lib/prisma/session";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: { username: string; url: string };
  children: React.ReactNode;
};

async function getPostData(username: string, url: string) {
  const decodedUsername = decodeURIComponent(username);
  const post = await db.post.findFirst({
    where: {
      url: url,
      OR: [
        {
          publication: {
            username: decodedUsername.substring(1),
          },
        },
        {
          author: {
            username: decodedUsername.substring(1),
          },
        }
      ],
      published: true,
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
      publication: true,
      author: true,
    },
  });

  // if post publicationId is not null and username is equal to author username then return null
  if (post?.publicationId && decodedUsername.substring(1) === post?.author?.username) {
    return null;
  }

  return post;
}

//markdown to text
function markdownToText(markdown: string) {
  return markdown
    .replace(/!\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/<\/?[^>]+(>|$)/g, "");
}

function formatDate(date: Date | string) {
  // Format date as Mmm, YYYY
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = await getPostData(params.username, params.url);
    if (!post) {
      throw new Error("Post not found");
    }
    return {
      metadataBase: new URL(
        `${process.env.DOMAIN}/@${post.author.username}/${post.url}`
      ),
      title: `${post.seoTitle ? post.seoTitle : post.title} - by ${post.author.name} - ${formatDate(post.publishedAt)} - FalseNotes`,
      description:
        post.seoDescription ? post.seoDescription : (post.subtitle || markdownToText(post.content?.slice(0, 100) || "")),
      keywords: post.tags.map((tag: any) => tag.tag.name).join(", "),
      robots: {
        index: true,
        follow: true,
        nocache: true,
        "max-image-preview": "large",
      },
      alternates: {
        canonical: post.canonicalUrl ? new URL(post.canonicalUrl) : new URL(`${process.env.DOMAIN}/@${post.author.username}/${post.url}`),
        types: {
          url: new URL(`${process.env.DOMAIN}/@${post.author.username}/${post.url}?commentsOpen=true`),
          title: `${post.title} - FalseNotes`,
        },
      },
      openGraph: {
        title: `${post.seoTitle ? post.seoTitle : post.title} - by ${post.author.name} - ${formatDate(post.publishedAt)} - FalseNotes`,
        description:
          post.seoDescription ? post.seoDescription : (post.subtitle || markdownToText(post.content?.slice(0, 100) || "")),
        url: new URL(
          `https://${process.env.NEXT_PUBLIC_ENV === "beta" ? 'beta.' : ''}${process.env.DOMAIN}/@${post.author.username}/${post.url}`
        ),
        images: [
          {
            url: `https://${process.env.NEXT_PUBLIC_ENV === "beta" ? 'beta.' : ''}${process.env.DOMAIN}/api/posts/${post.author.username}/opengraph-image${(post.ogVersion && post.ogVersion !== 'old') ? `/v${post.ogVersion}` : ``
              }?url=${post.url}`,
            width: 1200,
            height: 630,
            alt: `${post.title} - FalseNotes`,
          },
        ],
        type: "article",
        authors: `${post.author.name || post.author.username}`,
        publishedTime: post.publishedAt?.toISOString() || "",
        modifiedTime: post.updatedAt?.toISOString() || "",
        tags: post.tags.map((tag: any) => tag.tag.name),
        siteName: "FalseNotes",
      },
      twitter: {
        card: "summary_large_image",
        title: `${post.seoTitle ? post.seoTitle : post.title} - by ${post.author.name} - ${formatDate(post.publishedAt)} - FalseNotes`,
        description:
          post.seoDescription ? post.seoDescription : (post.subtitle || markdownToText(post.content?.slice(0, 100) || "")),
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      title: `Not Found - FalseNotes`,
      description: `The page you were looking for doesn't exist.`,
      openGraph: {
        title: `Not Found - FalseNotes`,
        description: `The page you were looking for doesn't exist.`,
      },
      twitter: {
        card: "summary_large_image",
        title: `Not Found - FalseNotes`,
        description: `The page you were looking for doesn't exist.`,
      },
      robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
          index: true,
          follow: true,
          "max-snippet": 50,
          "max-image-preview": "large",
          "max-video-preview": -1,
        },
      },
    };
  }
}

export default async function PostLayout({ children, params }: Props) {
  const decodedUsername = decodeURIComponent(params.username);
  const postData = await getPostData(decodedUsername, params.url);
  // if (!postData) {
  //   return notFound();
  // }

  if (!postData)
    return <div className="md:container mx-auto px-4 pt-5">{children}</div>;
  // fetch publisher and author posts
  const [author, publication] = await Promise.all([
    db.user.findUnique({
      where: {
        id: postData.authorId,
      },
      include: {
        _count: { select: { posts: true, Followers: true, Followings: true } },
        posts: {
          where: {
            url: {
              not: params.url,
            },
            published: true,
          },
          include: {
            _count: {
              select: {
                comments: true,
                savedUsers: true,
                likes: true,
                shares: true,
              },
            },
            author: {
              include: {
                _count: { select: { posts: true, Followers: true, Followings: true } },
                Followers: true,
              },
            },
            savedUsers: true,
            publication: { include: { _count: { select: { posts: true, Followers: true, Followings: true } } } },
          },

          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
        publicationsPosts: {
          where: {
            url: {
              not: params.url,
            },
            published: true,
          },
          include: {
            _count: {
              select: {
                comments: true,
                savedUsers: true,
                likes: true,
                shares: true,
              },
            },
            author: {
              include: {
                _count: { select: { posts: true, Followers: true, Followings: true } },
              },
            },
            savedUsers: true,
            publication: { include: { _count: { select: { posts: true, Followers: true, Followings: true } } } },
          },

          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
        Followers: true,
      },
    }),
    postData.publicationId ? db.user.findUnique({
      where: {
        id: postData.publicationId,
      },
      include: {
        _count: { select: { posts: true, Followers: true, Followings: true } },
      },
    }) : Promise.resolve(null),
  ]);

  const authorPosts = [...author?.posts || [], ...author?.publicationsPosts || []];

  authorPosts.sort((a: any, b: any) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  authorPosts.length = 4;

  const relatedPosts = await db.post.findMany({
    where: {
      tags: {
        some: {
          tag: {
            name: {
              in: postData?.tags.map((tag: any) => tag.tag.name),
            },
          },
        },
      },
      url: {
        not: postData?.url,
      },
      published: true,
    },
    include: {
      _count: {
        select: { comments: true, savedUsers: true, likes: true, shares: true },
      },
      author: {
        include: {
          _count: { select: { posts: true, Followers: true, Followings: true } },
        },
      },
      publication: { include: { _count: { select: { posts: true, Followers: true, Followings: true } } } },
      savedUsers: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });
  const data = await getForYou({ limit: 6 });
  const forYou = data?.feed || [];
  const sessionUser = await getSessionUser();
  const posts =
    relatedPosts.length > 0
      ? relatedPosts
      : forYou.filter((p: any) => p.id !== postData.id);
  posts.length % 2 !== 0 && posts.pop();

  const list = await getLists({ id: sessionUser?.id });
  const { lists: recommenedLists } = await getListByTags({ tags: postData?.tags.map((tag: any) => tag.tagId), limit: 6 });
  return (
    <>
      <div
        className="flex flex-col"
        style={{
          minHeight: "calc(100vh - 160px)",
        }}
      >
        <div className="flex-[1_0_auto] mt-4">
          <div className="md:container mx-auto px-4 pt-5">{children}</div>

          {postData && (
            <div className="bg-popover flex flex-col gap-16 pt-16 mt-4 border-t">
              <div className="md:container mx-auto px-4 w-full mb-16">
                <MoreFromAuthor
                  post={authorPosts}
                  author={author}
                  publication={publication}
                  sessionUser={sessionUser}
                  list={list}
                />
                {posts?.length > 0 && (
                  <>
                    <Separator className="mt-14 mb-8" />
                    <RelatedPosts
                      posts={posts}
                      session={sessionUser}
                      list={list}
                      lists={recommenedLists}
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
