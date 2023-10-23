import postgrtes from "@/lib/postgres";
import { ImageResponse } from "next/server";

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
     const authorid = Number(url.searchParams.get("author"));
     const title = url.searchParams.get("title");
     const subtitle = url.searchParams.get("subtitle");
     //creation date is the date the post was published on dev.to ex: Apr 4, 2021 it must be current date
     const creationdate = new Date();

     const user = await fetch(`${process.env.DOMAIN}/api/users?id=${authorid}`).then((res) => res.json());
     console.log(user);
      const author = user?.user;

  return new ImageResponse(
    (
     <div tw="flex flex-col w-full h-full bg-gray-50 justify-end bg-gray-50" >
     <div tw="flex flex-col py-8 px-14">
     <div tw="text-3xl font-bold w-3/5 mb-4">{title}</div>
     <div tw="text-xl w-3/5 mb-6">{
            subtitle && subtitle.length > 150 ? (
            subtitle.slice(0, 150) + "..."
          ) : (
            subtitle
          )
     }</div>
<div tw="flex space-x-4 items-center w-full justify-between">
<div tw="flex">
<img tw="rounded-full w-10 h-10 mr-2 rounded-full" alt="" src={author?.image as string} />
    <div tw="flex flex-col">
    <span tw="text-base font-bold">{author?.username} </span>
    <div tw="text-sm text-muted-foreground">{formatDate(creationdate)}</div>
    </div>
</div>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 689.11 100" height="32">
  <path d="M44.23 49.49H14.79L0 23.82h29.58v.01l14.65 25.66zm0 0L29.51 75.03l13.81 23.95 14.79-25.66 13.73-23.83H44.23zM43.32 0 29.59 23.82h57.05L100.37 0H43.32zm86.54 94.11 1.08-.9-8.09-12.81-1.26.53c-1.71.72-3.76 1.09-6.1 1.09-10.12 0-13.38-7.1-14.42-11.33l-.3-1.22H81.44l.26 1.84c1.14 7.94 4.63 15.14 9.82 20.26 5.51 5.45 12.54 8.33 20.33 8.33 7.27-.02 13.5-2.01 18.01-5.79zm22.95-21.44V32.92h-22.57v5.36c-4.7-4.72-11.6-7.27-19.91-7.27h-.31c-10.82 0-20.84 5.93-26.13 15.48l-.73 1.32 16.59 10.61.79-1.64c2.48-5.17 7.2-7.9 13.65-7.9 9.39 0 16.47 7.17 16.47 16.68 0 1.86-.23 3.55-.7 5.03l-.65 2.09h23.5zm31.41-63.31v60.87h-19.68V9.36h19.68zm71.39 61c-1.22-3.05-3.27-5.52-6.15-7.44-2.74-1.82-6.16-3.28-10.25-4.37h-13.74v15.01c3.49.5 6.14 1.05 7.94 1.65 2.58.86 3.87 2.19 3.87 4s-.9 3.24-2.71 4.3c-1.8 1.07-4.72 1.6-8.73 1.6h-.37c-4.15-.05-7.17-.97-9.04-2.76-1.93-1.84-2.93-4.2-3.01-7.07h-19.43c.41 7.79 3.28 13.84 8.61 18.14 5.33 4.3 12.92 6.46 22.75 6.46h.12c6.42-.01 12-.96 16.73-2.83 4.75-1.89 8.4-4.49 10.95-7.81 2.54-3.32 3.81-7.07 3.81-11.25 0-2.85-.45-5.39-1.35-7.63zm-37.64-23.12c1.56-.98 4.02-1.47 7.38-1.47h.12c6.48.03 9.84 2.66 10.09 7.87h19.43c-.49-7.46-3.43-13.1-8.79-16.91-5.37-3.81-12.2-5.72-20.48-5.72h-.25c-6.13.02-11.42 1-15.87 2.94-.53.23-1.05.47-1.54.72l9.34 12.96c.18-.13.37-.26.57-.39zm91.85 29.24c-.83 2.36-2.2 4.22-4.11 5.57-1.97 1.4-4.43 2.09-7.38 2.09-4.02 0-7.38-1.25-10.09-3.75s-4.39-5.84-5.04-10.03h-19.16c.51 4.55 1.75 8.75 3.73 12.61 2.67 5.21 6.62 9.33 11.87 12.36 5.24 3.04 11.52 4.55 18.82 4.55 8.61 0 15.57-2.25 20.91-6.76 3.27-2.77 5.8-5.95 7.59-9.55l-17.14-7.09zm16.31-31.02c-3.03-4.88-7.03-8.51-11.99-10.88-4.96-2.38-10.31-3.57-16.05-3.57-7.08 0-13.18 1.43-18.32 4.3l10.08 13.18c2.3-1.48 5.17-2.22 8.62-2.22 3.69 0 6.68 1.07 8.98 3.2 2.29 2.14 3.61 5.17 3.93 9.1h-14.15v11.81h33.08c.25-1.89.37-4.18.37-6.89 0-7.15-1.52-13.15-4.55-18.03zm79.37-34.59v56.4c0 1.57.25 3.12.74 4.64.49 1.53 1.19 3.24 2.1 5.14.41.98.62 1.77.62 2.35 0 .99-.54 1.48-1.61 1.48-.74 0-1.36-.49-1.85-1.48l-28.69-68.52h-31.66v59.36h20.78v-28.7c0-1.56-.25-3.11-.74-4.64-.49-1.53-1.2-3.24-2.11-5.14-.41-.98-.61-1.73-.61-2.23 0-.82.49-1.36 1.48-1.6.74-.08 1.4.42 1.98 1.48l28.69 68.52h31.66V10.87H405.5zm93.75 36.98c-2.81-5.28-6.83-9.46-12.06-12.56-5.24-3.09-11.36-4.64-18.36-4.64-7.01 0-13.13 1.55-18.37 4.64-1.34.79-2.59 1.65-3.77 2.57l11.47 14.34c2.57-3.15 6.13-4.73 10.66-4.73 4.7 0 8.35 1.69 10.94 5.07 2.6 3.38 3.9 7.63 3.9 12.73 0 1.84-.17 3.58-.52 5.19-.59 2.87-1.72 5.39-3.39 7.54-2.59 3.39-6.24 5.07-10.94 5.07-4.7 0-8.35-1.69-10.95-5.07-1.66-2.16-2.79-4.67-3.38-7.54h-19.97c.56 4.36 1.85 8.45 3.87 12.25 2.8 5.27 6.82 9.46 12.06 12.55s11.36 4.64 18.37 4.64c7 0 13.12-1.55 18.36-4.64 5.24-3.1 9.26-7.28 12.06-12.55 2.01-3.8 3.31-7.89 3.87-12.25.22-1.69.33-3.42.33-5.19.02-6.33-1.38-12.15-4.18-17.42zm15.08.62h-11.87V32.64h11.87V14.83h19.79v17.81h17.81v15.83h-17.81v21.77h-19.79V48.47zm86.69 28.12c-.83 2.36-2.2 4.22-4.11 5.57-1.97 1.4-4.43 2.09-7.38 2.09-4.02 0-7.38-1.25-10.09-3.75s-4.39-5.84-5.04-10.03h-19.16c.51 4.55 1.75 8.75 3.73 12.61 2.67 5.21 6.62 9.33 11.87 12.36 5.24 3.04 11.52 4.55 18.82 4.55 8.61 0 15.57-2.25 20.91-6.76 3.27-2.77 5.8-5.95 7.59-9.55l-17.14-7.09zm16.31-31.01c-3.03-4.88-7.03-8.51-11.99-10.88-4.96-2.38-10.31-3.57-16.05-3.57-7.08 0-13.18 1.43-18.32 4.3l10.07 13.18c2.3-1.48 5.17-2.22 8.62-2.22 3.69 0 6.68 1.07 8.98 3.2 2.29 2.14 3.61 5.17 3.93 9.1h-14.15V70.5h33.08c.25-1.89.37-4.18.37-6.89.01-7.15-1.5-13.16-4.54-18.03zm70.42 24.63c-1.22-3.05-3.27-5.52-6.15-7.44-2.74-1.82-6.16-3.28-10.25-4.37h-13.74v15.01c3.49.5 6.14 1.05 7.94 1.65 2.58.86 3.87 2.19 3.87 4s-.9 3.24-2.71 4.3c-1.8 1.07-4.72 1.6-8.73 1.6h-.37c-4.15-.05-7.17-.97-9.04-2.76-1.93-1.84-2.93-4.2-3.01-7.07h-19.43c.41 7.79 3.28 13.84 8.61 18.14 5.33 4.3 12.92 6.46 22.75 6.46h.12c6.42-.01 12-.96 16.73-2.83 4.75-1.89 8.4-4.49 10.95-7.81 2.54-3.32 3.81-7.07 3.81-11.25.01-2.86-.44-5.4-1.35-7.63zm-37.63-23.13c1.56-.98 4.02-1.47 7.38-1.47h.12c6.48.03 9.84 2.66 10.09 7.87h19.43c-.49-7.46-3.43-13.1-8.79-16.91-5.37-3.81-12.2-5.72-20.48-5.72h-.25c-6.13.02-11.42 1-15.87 2.94-.53.23-1.05.47-1.54.72l9.34 12.96c.18-.13.37-.26.57-.39z" />
</svg>
     </div>
            </div>   
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

/*Type error: Route "app/api/posts/[username]/opengraph-image/route.tsx" has an invalid export:
"Promise<ImageResponse | undefined>" is not a valid GET return type:
Expected "void | Response | Promise<void | Response>", got "Promise<ImageResponse | undefined>".
  Expected "Promise<void | Response>", got "Promise<ImageResponse | undefined>".
    Expected "void | Response", got "ImageResponse | undefined".
      Expected "void | Response", got "ImageResponse".*/