import { NextRequest, NextResponse } from "next/server";
import postgres from "@/lib/postgres";

export async function GET(request: NextRequest) {
     try {
          const url = request.nextUrl.searchParams.get("url");
          const authorId = request.nextUrl.searchParams.get("author")?.toString();

          if (!url) {
               return NextResponse.json({ message: "url is required" }, { status: 400 });
          }

          const isUrlValid = await postgres.post.findFirst({
               where: {
                    url: url,
               },
          })
          if (isUrlValid) {
               return NextResponse.json({ isValid: false });
          } else {
               return NextResponse.json({ isValid: true });
          }
     } catch (error: any) {
          return NextResponse.json({ message: error.message }, { status: 500 });
     }
}
