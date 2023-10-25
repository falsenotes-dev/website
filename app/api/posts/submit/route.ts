import { NextRequest, NextResponse } from "next/server";
import postgres from "@/lib/postgres"

async function insertTag(tags: any, postid: any) {
     if (tags) {
          for (const tag of tags) {
               // Check if tag exists
               const tagExists = await postgres.tag.findFirst({
                    where: {
                         name: tag.value.replace(/\s+/g, '-').toLowerCase(),
                    },
               })
               if (!tagExists) {
                    await postgres.tag.create({
                         data: {
                              name: tag.value.replace(/\s+/g, '-').toLowerCase(),
                         }
                    })
               }
               const tagId = await postgres.tag.findFirst({
                    where: {
                         name: tag.value.replace(/\s+/g, '-').toLowerCase(),
                    },
                    select: {
                         id: true,
                    }
               })
               if (tagId) {
                    await postgres.postTag.create({
                         data: {
                              tagId: tagId.id,
                              postId: Number(postid),
                         }
                    })
               }
          }
     }
}

export async function POST(req: NextRequest) {
     try {
          const data = await req.json();
          if (!data) {
               return new Response("No data provided", { status: 400 });
          }
          const postid = req.nextUrl.searchParams.get("postId");

          const { title, content, coverImage, visibility, tags, url, authorId, subtitle } = data;

          if (!title) {
               return new Response("No title provided", { status: 400 });
          }
          if (!content) {
               return new Response("No content provided", { status: 400 });
          }

          if (!authorId) {
               return new Response("No author provided", { status: 400 });
          }

          if (!url) {
               return new Response("No url provided", { status: 400 });
          }

          if (postid) {
               const postData = await postgres.post.findFirst({
                    where: {
                         id: Number(postid),
                    },
               })
               if (!postData) {
                    return new Response("Post does not exist", { status: 400 });
               }
               
               if (title !== postData.title || content !== postData.content || coverImage !== postData.cover || visibility !== postData.visibility || url !== postData.url || subtitle !== postData.subtitle) {
                    
                    await postgres.post.update({
                         where: {
                              id: Number(postid),
                         },
                         data: {
                              title: title,
                              content: content,
                              cover: coverImage,
                              visibility: visibility,
                              url: url,
                              subtitle: subtitle,
                         }
                    })

               }
               const postTagsData = await postgres.postTag.findMany({
                    where: {
                         postId: Number(postid),
                    },
                    select: {
                         tag: {
                              select: {
                                   name: true,
                              }
                         }
                    }
               })
               if (postTagsData) {
                    // await sql`
                    //      DELETE FROM BlogPostTags WHERE BlogPostID = ${postid}
                    //      `;
                    await postgres.postTag.deleteMany({
                         where: {
                              postId: Number(postid),
                         }
                    })
               }
               await insertTag(tags, postid);
               

               return NextResponse.json({ body: "Post updated" });
          }
          else {
          await postgres.post.create({
               data: {
                    title: title,
                    content: content,
                    cover: coverImage ? coverImage : null,
                    visibility: visibility,
                    url: url,
                    subtitle: subtitle ? subtitle : null,
                    authorId: Number(authorId),
               }
          })

          const submittedPostId = await postgres.post.findFirst({
               where: {
                    url: url,
               },
               select: {
                    id: true,
               }
          })

          const postId = submittedPostId?.id;

          await insertTag(tags, postId);

          return NextResponse.json({ body: "Post submitted" });
          }    
     } catch (error) {
          console.error("Error:", error);
          return NextResponse.json({body: "Error processing data"},
            {status: 500});
        }
      }
     