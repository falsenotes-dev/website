import { getSessionUser } from "@/components/get-session-user";
import postgres from "@/lib/postgres";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

const baseQuery = {
     include: {
       author: true,
       savedUsers: true,
       _count: {
         select: {
           likes: true,
           savedUsers: true,
         },
       },
       tags: {
         take: 1,
         include: {
           tag: true,
         },
       },
     },
   };
   
export async function GET(req: NextRequest, { params } : { params: { id: string } }) {
     const session = await getSessionUser()
     const userId = params.id;
     if (!session) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
     }

     const pageString = req.nextUrl.searchParams.get("page");
     const page = pageString ? parseInt(pageString) : 0;
     const search = req.nextUrl.searchParams.get("search");
     const limit = Number(req.nextUrl.searchParams.get("limit")) || 10;
     const posts = await postgres.post.findMany({
          ...baseQuery,
          where: {
               ...(session?.id === Number(userId) ? {} : { visibility: "public" }),
               authorId: Number(userId),
               visibility: session?.id === Number(userId) ? undefined : "public",
               ...(search ? { title: { contains: search, mode: "insensitive" } } : {}),
          },
          take: Number(limit),
          skip: Number(page) * Number(limit),
          orderBy: {
               createdAt: "desc",
          }
     });
        return NextResponse.json({ posts }, { status: 200 });
}