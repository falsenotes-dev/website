/* eslint-disable @next/next/no-img-element */

import { ImageResponse } from "next/og";

export const runtime = 'edge';

const regularFont = fetch(
     new URL('/public/assets/PolySans Neutral.otf', import.meta.url)
).then((res) => res.arrayBuffer());

const boldFont = fetch(
     new URL('/public/assets/PolySans Bulky.otf', import.meta.url)
).then((res) => res.arrayBuffer());

const formatDate = (dateString: string | number | Date) => {
     //format date ex: if published this year Apr 4, otherwise Apr 4, 2021
     const date = new Date(dateString)
     const formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour12: true,
     })
     return formattedDate
}
export async function GET(req: Request) {
     const [regular, bold] = await Promise.all([
          regularFont,
          boldFont,
     ]);
     try {
          const url = new URL(req.url);
          const title = url.searchParams.get("title");
          const subtitle = url.searchParams.get("subtitle");
          const cover = url.searchParams.get("cover");
          //creation date is the date the post was published on dev.to ex: Apr 4, 2021 it must be current date
          const readingTime = url.searchParams.get("readingTime");
          const authorid = url.searchParams.get("authorid");

          const user = await fetch(`${process.env.DOMAIN}/api/users/${authorid}`).then((res) => res.json());
          const author = user?.user;

          return new ImageResponse(
               (
                    <div tw="flex h-full w-full">
                         <img src={cover || ''} alt="" tw="w-full h-full"
                              style={{ objectFit: "cover", objectPosition: "center" }} />
                    </div>
               ),
               {
                    width: 1200,
                    height: 630,
                    fonts: [
                         {
                              name: 'Inter',
                              data: regular,
                              weight: 400,
                         },
                         {
                              name: 'Inter',
                              data: bold,
                              weight: 700,
                         },
                    ],
               },
          );
     } catch (error) {
          console.error(error);
          return new Response("error", { status: 500 });
     }
}