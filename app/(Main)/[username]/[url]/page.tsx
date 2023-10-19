
import React, { use, useEffect, useState } from "react"
import { getSessionUser } from "@/components/get-session-user"
import { redirect, useRouter } from "next/navigation"
import { sql } from "@/lib/postgres"
import Post from "@/components/blog/post"
import PostComment from "@/components/blog/comment"
import MoreFromAuthor from "@/components/blog/more-from-author"


export default async function PostView({ params }: { params: { username: string, url: string } }) {
     const authorData = await sql`SELECT * FROM users WHERE username = ${params.username}`;
     const author = authorData[0];
     
     const authorPosts = await sql`SELECT * FROM blogposts WHERE authorid = ${author.userid} AND url != ${params.url} ORDER BY PostID DESC LIMIT 4`;
     const authorPostsComments = await sql`SELECT * FROM comments WHERE blogpostid IN (SELECT postid FROM blogposts WHERE authorid = ${author.userid} AND visibility = 'public' AND url != ${params.url})`;
     authorPosts.forEach((post: any) => {
          authorPostsComments.forEach((comment: any) => {
               if (comment.postid === post.postid) {
                    post.comments = post.comments + 1;
               }
          }
          )
     }
     )
     const auhorFollowers = await sql`SELECT * FROM users WHERE userid IN (SELECT followerid FROM follows WHERE followeeid = ${author.userid})`;
     author.followers = auhorFollowers.length;
     const postData = await sql`SELECT * FROM blogposts WHERE authorid = ${author?.userid} AND url = ${params.url}`;
     const post = postData[0];
     if (!post) redirect("/404");
     // const processedContent = await remark().use(html).process(post.content);
     // post.content = processedContent.toString();
     const postComments = await sql`SELECT * FROM comments WHERE blogpostid = ${post.postid}`;
     const postCommentsAuthor = await sql`SELECT * FROM users WHERE userid IN (SELECT authorid FROM comments WHERE blogpostid = ${post.postid})`;
     postComments.forEach((comment: any) => {
          postCommentsAuthor.forEach((author: any) => {
               if (comment.authorid === author.userid) {
                    comment.author = author;
               }
          }
          )
     }
     )
     const postTags = await sql`SELECT * FROM tags WHERE tagid IN (SELECT tagid FROM blogposttags WHERE blogpostid = ${post.postid})`;
     console.log(postTags);

     const sessionUser = await getSessionUser()


     // async function handleFollow(followeeId: string) {
     //      if (status === "authenticated") {
     //           setIsFollowingLoading(true);
     //           try {
     //                const followerId = (await getSessionUser()).userid;
     //                await fetch(`/api/follow?followeeId=${followeeId}&followerId=${followerId}`, {
     //                     method: "GET",
     //                });
     //           } catch (error) {
     //                console.error(error);
     //           }
     //      } else {
     //           return null;
     //      }

     // }

     // if (!isLoaded || !post) {
     //      return (
     //           <div className="w-full max-h-screen flex justify-center items-center bg-background" style={
     //                {
     //                  minHeight: "calc(100vh - 192px)"
     //                }
     //              }>
     //                 <Icons.spinner className="h-10 animate-spin" />
     //               </div>
     //      )
     // }

     return (
          <>
               <Post post={post} author={author} sessionUser={sessionUser} tags={postTags} />
               <PostComment comments={postComments} post={post} postAuthor={author} />
               <MoreFromAuthor post={authorPosts} author={author} sessionUser={sessionUser} />
          </>
     )
}