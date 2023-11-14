import MoreFromAuthor from '@/components/blog/more-from-author';
import RelatedPosts from '@/components/blog/related-posts';
import { SiteFooter } from '@/components/footer';
import { getSessionUser } from '@/components/get-session-user';
import { Separator } from '@/components/ui/separator';
import postgres from '@/lib/postgres';
import type { Metadata } from 'next'

type Props = {
     params: { username: string, url: string }
     children: React.ReactNode
}

async function getPostData(username: string, url: string) {
     const post = await postgres.post.findFirst({
       where: {
         url: url,
         author: {
           username: username
         }
       },
       include: {
         tags: {
           include: {
             tag: true
           }
         },
         author: true,
       }
     });
     return post;
   }

   //markdown to text
   function markdownToText(markdown: string) {
     return markdown.replace(/!\[(.*?)\]\((.*?)\)/g, '$1') .replace(/\[(.*?)\]\((.*?)\)/g, '$1').replace(/<\/?[^>]+(>|$)/g, '');
   }
   
   export async function generateMetadata(
     { params }: Props
   ): Promise<Metadata> {
     try {
       const post = await getPostData(params.username, params.url);
       if (!post) {
         throw new Error('Post not found');
       }
       return {
         metadataBase: new URL(`${process.env.DOMAIN}/${post.author.username}/${post.url}`),
         title: `${post.title} - FalseNotes`,
         description: post.subtitle,
         keywords: post.tags.map((tag: any) => tag.tag.name).join(', '),
         openGraph: {
           title: `${post.title} - FalseNotes`,
           description: post.subtitle || markdownToText(post.content.slice(0, 100)),
           url: `${process.env.DOMAIN}/${post.author.username}/${post.url}`,
           images: [
             {
               url: `${process.env.DOMAIN}/api/posts/${post.author.username}/opengraph-image?url=${post.url}`,
               width: 1200,
               height: 630,
               alt: `${post.title} - FalseNotes`,
             }
           ],
         },
         twitter: {
           card: 'summary_large_image',
           title: `${post.title} - FalseNotes`,
           description: post.subtitle || markdownToText(post.content.slice(0, 100)),
               
         },
       }
     } catch (error) {
       console.error('Error:', error);
       return {
         title: `Not Found - FalseNotes`,
         description: `The page you were looking for doesn't exist.`,
         openGraph: {
           title: `Not Found - FalseNotes`,
           description: `The page you were looking for doesn't exist.`,
   
         },
         twitter: {
           card: 'summary_large_image',
           title: `Not Found - FalseNotes`,
           description: `The page you were looking for doesn't exist.`,
         },
       }
     }
   }

export default async function PostLayout(
     { children, params }: Props
) {
     const author = await postgres.user.findFirst({
          where: {
               username: params.username
          },
          include: {
               posts: {
                    where: {
                         url: {
                              not: params.url
                         },
                         visibility: "public",
                    },
                    include: {
                         _count: { select: { comments: true, savedUsers: true, likes: true } },
                         author: {
                              include: {
                                   Followers: true,
                                   Followings: true
                              }
                         },
                         savedUsers: true,
                    },
                    orderBy: {
                         createdAt: "desc"
                    },
                    take: 4
               },
               _count: { select: { posts: true, Followers: true, Followings: true } },
               Followers: true,
               Followings: true
          }
     });

     const authorPosts = author?.posts;
     const post = await postgres.post.findFirst({
          where: {
               url: params.url,
               authorId: author?.id
          },
          include: {
               comments: {
                    include: {
                         author: {
                              include: {
                                   Followers: true,
                                   Followings: true
                              }
                         }
                    },
                    orderBy: {
                         createdAt: "desc"
                    }
               },
               likes: true,
               tags: {
                    include: {
                         tag: true
                    }
               },
               readedUsers: true,
               author: {
                    include: {
                         Followers: true,
                         Followings: true
                    }
               },
               savedUsers: true,
               _count: { select: { savedUsers: true, likes: true, comments: true } }
          }
     });
     const relatedPosts = await postgres.post.findMany({
          where: {
               tags: {
                    some: {
                         tag: {
                              name: {
                                   in: post?.tags.map((tag: any) => tag.tag.name)
                              }
                         }
                    }
               },
               url: {
                    not: post?.url
               },
               visibility: "public",
          },
          include: {
               _count: { select: { comments: true, savedUsers: true, likes: true } },
               author: {
                    include: {
                         Followers: true,
                         Followings: true
                    }
               },
               savedUsers: true,
          },
          orderBy: {
               createdAt: "desc"
          },
          take: 6
     });
     const sessionUser = await getSessionUser();
     relatedPosts.length % 2 !== 0 && relatedPosts.pop();
     return (
          <>
               <div className='md:container mx-auto px-4'>
                    {children}
               </div>

               <div className="bg-popover space-y-16 pt-16 mt-4 border-t">
                    <div className=' md:container mx-auto px-4'>
                         <MoreFromAuthor post={authorPosts} author={author} sessionUser={sessionUser} />
                         {
                              relatedPosts?.length > 0 &&
                              (
                                   <>
                                        <Separator className="mt-14 mb-8" />
                                        <RelatedPosts posts={relatedPosts} post={post} session={sessionUser} />
                                   </>
                              )

                         }
                    </div>
                    <SiteFooter />
               </div>
          </>
     )
}
