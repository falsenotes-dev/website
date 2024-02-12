/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { NextRequest, NextResponse } from "next/server";

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
export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
  const [regular, bold] = await Promise.all([
    regularFont,
    boldFont,
  ]);
  const { username } = params;
  const postUrl = req.nextUrl.searchParams.get("url");

  if (!postUrl) {
    return NextResponse.json("Missing post url", { status: 400 });
  }

  try {
    const response = await fetch(`${process.env.DOMAIN}/api/posts/${username}/${postUrl}`);

    if (!response.ok) {
      return NextResponse.json("Error fetching user data", { status: 500 });
    }

    const data = await response.json();
    const post = data;

    return new ImageResponse(
      (
        <div tw="flex h-full w-full">
          <img src={post.cover || ''} alt="" tw="object-cover object-center w-full h-full"
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
    console.error("Error fetching user data", error);
    return NextResponse.json("Error occurred", { status: 500 });
  }
}

/*Type error: Route "app/api/posts/[username]/opengraph-image/route.tsx" has an invalid export:
"Promise<ImageResponse | undefined>" is not a valid GET return type:
Expected "void | Response | Promise<void | Response>", got "Promise<ImageResponse | undefined>".
  Expected "Promise<void | Response>", got "Promise<ImageResponse | undefined>".
    Expected "void | Response", got "ImageResponse | undefined".
      Expected "void | Response", got "ImageResponse".*/