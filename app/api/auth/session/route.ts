import { config } from "@/app/auth";
import postgres from "@/lib/postgres";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
     try {
          const session = await getServerSession(config)
          if (!session) {
               return NextResponse.json({ error: "Not authorized" }, { status: 401 })
          }
          const { user } = session

          const result = await postgres.user.findFirst({
               where: {
                    image: user?.image,
               },
               include: {
                    Followers: {
                         include: {
                              follower: {
                                   include: {
                                        Followers: true,
                                        Followings: true,
                                   },
                              },
                              },
                         },
                    Followings: {
                         include: {
                              following: {
                                   include: {
                                        Followers: true,
                                        Followings: true,
                                   },
                              },
                         },
                    },
                    bookmarks: {
                         include: {
                              post: {
                                   include: {
                                        author: true,
                                   }
                              }
                         }
                    },
                    posts: true,
                    notifications: true,
                    settings: true,
                    tagfollower: {
                         include: {
                              tag: true,
                         }
                    },
                    }
               })

               return NextResponse.json({ user: JSON.parse(JSON.stringify(result)) }, { status: 200 })
     } catch (error) {
          console.error(error)
          return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
     }
}