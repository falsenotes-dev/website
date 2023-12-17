import MoreFromAuthor from "@/components/blog/more-from-author";
import RelatedPosts from "@/components/blog/related-posts";
import { SiteFooter } from "@/components/footer";
import { getSessionUser } from "@/components/get-session-user";
import { Separator } from "@/components/ui/separator";
import postgres from "@/lib/postgres";
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
  const post = await postgres.post.findFirst({
    where: {
      url: url,
      author: {
        username: decodedUsername.substring(1),
      },
      published: true,
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
      author: true,
    },
  });
  return post;
}

//markdown to text
function markdownToText(markdown: string) {
  return markdown
    .replace(/!\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/<\/?[^>]+(>|$)/g, "");
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
      title: `${post.title} - FalseNotes`,
      description:
        post.subtitle || markdownToText(post.content?.slice(0, 100) || ""),
      keywords: post.tags.map((tag: any) => tag.tag.name).join(", "),
      openGraph: {
        title: `${post.title} - FalseNotes`,
        description:
          post.subtitle || markdownToText(post.content?.slice(0, 100) || ""),
        url: new URL(
          `${process.env.DOMAIN}/@${post.author.username}/${post.url}`
        ),
        images: [
          {
            url: `${process.env.DOMAIN}/api/posts/${post.author.username}/opengraph-image?url=${post.url}`,
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
        title: `${post.title} - FalseNotes`,
        description:
          post.subtitle || markdownToText(post.content?.slice(0, 100) || ""),
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
  const author = await postgres.user.findFirst({
    where: {
      username: decodedUsername.substring(1),
    },
    include: {
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
              Followers: true,
              Followings: true,
            },
          },
          savedUsers: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 4,
      },
      _count: { select: { posts: true, Followers: true, Followings: true } },
      Followers: true,
      Followings: true,
    },
  });

  const authorPosts = author?.posts;
  const post = await postgres.post.findFirst({
    where: {
      url: params.url,
      authorId: author?.id,
    },
    include: {
      comments: {
        include: {
          author: {
            include: {
              Followers: true,
              Followings: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      likes: true,
      tags: {
        include: {
          tag: true,
        },
      },
      readedUsers: true,
      author: {
        include: {
          Followers: true,
          Followings: true,
        },
      },
      savedUsers: true,
      _count: {
        select: { savedUsers: true, likes: true, comments: true, shares: true },
      },
    },
  });

  if (!post)
    return <div className="md:container mx-auto px-4 pt-5">{children}</div>;

  const relatedPosts = await postgres.post.findMany({
    where: {
      tags: {
        some: {
          tag: {
            name: {
              in: post?.tags.map((tag: any) => tag.tag.name),
            },
          },
        },
      },
      url: {
        not: post?.url,
      },
      published: true,
    },
    include: {
      _count: {
        select: { comments: true, savedUsers: true, likes: true, shares: true },
      },
      author: {
        include: {
          Followers: true,
          Followings: true,
        },
      },
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
      : forYou.filter((p: any) => p.id !== post.id);
  posts.length % 2 !== 0 && posts.pop();

  const list = await getLists({ id: sessionUser?.id });
  const { lists: recommenedLists } = await getListByTags({tags: post?.tags.map((tag: any) => tag.tagId), limit: 6});
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

          {post && (
            <div className="bg-popover flex flex-col gap-16 pt-16 mt-4 border-t">
              <div className="md:container mx-auto px-4 w-full mb-16">
                <MoreFromAuthor
                  post={authorPosts}
                  author={author}
                  sessionUser={sessionUser}
                  list={list}
                />
                {posts?.length > 0 && (
                  <>
                    <Separator className="mt-14 mb-8" />
                    <RelatedPosts
                      posts={posts}
                      post={post}
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
