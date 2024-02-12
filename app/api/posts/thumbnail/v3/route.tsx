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
                    <div tw="flex w-full flex-col h-full justify-between bg-white p-14 gap-10">
                         <div tw="flex flex-col justify-between mt-2 w-full">
                              <div tw="flex flex-col">
                                   <h1
                                        tw="line-clamp-3"
                                        style={{
                                             overflow: "hidden",
                                             textOverflow: "ellipsis",
                                             display: "-webkit-box",
                                             WebkitLineClamp: 2,
                                             WebkitBoxOrient: "vertical",
                                             fontSize: "3.5rem",
                                             lineHeight: "1.2",
                                        }}
                                   >
                                        {title}
                                   </h1>
                              </div>
                              <div tw="flex w-full justify-between mt-4">
                                   <div tw="flex items-center">
                                        <img
                                             tw="rounded-full w-10 h-10 mr-2 rounded-full"
                                             alt=""
                                             src={author.image}
                                        />
                                        <div tw="flex flex-col">
                                             <div tw="text-base font-bold mb-0 flex items-center">
                                                  {author?.name || author?.username}{" "}
                                                  {author?.verified && (
                                                       <svg
                                                            viewBox="0 0 22 22"
                                                            height={"16px"}
                                                            width={"16px"}
                                                            fill="2564eb"
                                                       >
                                                            <g>
                                                                 <path
                                                                      d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
                                                                      fill="#2564eb"
                                                                 ></path>
                                                            </g>
                                                       </svg>
                                                  )}
                                             </div>
                                             <div tw="text-sm text-mute-foreground">
                                                  {readingTime + " · " + formatDate(new Date())}
                                             </div>
                                        </div>
                                   </div>
                                   <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 689.11 100"
                                        height="32"
                                   >
                                        <path
                                             d="M44.23,49.49H14.79L0,23.82h29.58l0,0.01L44.23,49.49z M44.23,49.49L29.51,75.03l13.81,23.95l14.79-25.66
	l13.73-23.83v0H44.23z M43.32,0L29.59,23.82h57.05L100.37,0H43.32z M129.86,94.11l1.08-0.9l-8.09-12.81l-1.26,0.53
	c-1.71,0.72-3.76,1.09-6.1,1.09c-10.12,0-13.38-7.1-14.42-11.33l-0.3-1.22H81.44l0.26,1.84c1.14,7.94,4.63,15.14,9.82,20.26
	c5.51,5.45,12.54,8.33,20.33,8.33C119.12,99.88,125.35,97.89,129.86,94.11z M152.81,72.67V32.92h-22.57v5.36
	c-4.7-4.72-11.6-7.27-19.91-7.27l-0.31,0c-10.82,0-20.84,5.93-26.13,15.48l-0.73,1.32l16.59,10.61l0.79-1.64
	c2.48-5.17,7.2-7.9,13.65-7.9c9.39,0,16.47,7.17,16.47,16.68c0,1.86-0.23,3.55-0.7,5.03l-0.65,2.09H152.81z M184.22,9.36v60.87
	h-19.68V9.36H184.22z M255.61,70.36c-1.22-3.05-3.27-5.52-6.15-7.44c-2.74-1.82-6.16-3.28-10.25-4.37h-13.74v15.01
	c3.49,0.5,6.14,1.05,7.94,1.65c2.58,0.86,3.87,2.19,3.87,4c0,1.81-0.9,3.24-2.71,4.3c-1.8,1.07-4.72,1.6-8.73,1.6
	c-0.12,0-0.25,0-0.37,0c-4.15-0.05-7.17-0.97-9.04-2.76c-1.93-1.84-2.93-4.2-3.01-7.07h-19.43c0.41,7.79,3.28,13.84,8.61,18.14
	c5.33,4.3,12.92,6.46,22.75,6.46h0.12c6.42-0.01,12-0.96,16.73-2.83c4.75-1.89,8.4-4.49,10.95-7.81c2.54-3.32,3.81-7.07,3.81-11.25
	C256.96,75.14,256.51,72.6,255.61,70.36z M217.97,47.24c1.56-0.98,4.02-1.47,7.38-1.47h0.12c6.48,0.03,9.84,2.66,10.09,7.87h19.43
	c-0.49-7.46-3.43-13.1-8.79-16.91c-5.37-3.81-12.2-5.72-20.48-5.72c-0.08,0-0.16,0-0.25,0c-6.13,0.02-11.42,1-15.87,2.94
	c-0.53,0.23-1.05,0.47-1.54,0.72l9.34,12.96C217.58,47.5,217.77,47.37,217.97,47.24z M309.82,76.48c-0.83,2.36-2.2,4.22-4.11,5.57
	c-1.97,1.4-4.43,2.09-7.38,2.09c-4.02,0-7.38-1.25-10.09-3.75c-2.71-2.5-4.39-5.84-5.04-10.03h-19.16
	c0.51,4.55,1.75,8.75,3.73,12.61c2.67,5.21,6.62,9.33,11.87,12.36c5.24,3.04,11.52,4.55,18.82,4.55c8.61,0,15.57-2.25,20.91-6.76
	c3.27-2.77,5.8-5.95,7.59-9.55L309.82,76.48z M326.13,45.46c-3.03-4.88-7.03-8.51-11.99-10.88c-4.96-2.38-10.31-3.57-16.05-3.57
	c-7.08,0-13.18,1.43-18.32,4.3l10.08,13.18c2.3-1.48,5.17-2.22,8.62-2.22c3.69,0,6.68,1.07,8.98,3.2c2.29,2.14,3.61,5.17,3.93,9.1
	h-14.15v11.81h33.08c0.25-1.89,0.37-4.18,0.37-6.89C330.68,56.34,329.16,50.34,326.13,45.46z M405.5,10.87v56.4
	c0,1.57,0.25,3.12,0.74,4.64c0.49,1.53,1.19,3.24,2.1,5.14c0.41,0.98,0.62,1.77,0.62,2.35c0,0.99-0.54,1.48-1.61,1.48
	c-0.74,0-1.36-0.49-1.85-1.48l-28.69-68.52h-31.66v59.36h20.78V41.54c0-1.56-0.25-3.11-0.74-4.64c-0.49-1.53-1.2-3.24-2.11-5.14
	c-0.41-0.98-0.61-1.73-0.61-2.23c0-0.82,0.49-1.36,1.48-1.6c0.74-0.08,1.4,0.42,1.98,1.48l28.69,68.52h31.66V10.87H405.5z
	 M499.25,47.85c-2.81-5.28-6.83-9.46-12.06-12.56c-5.24-3.09-11.36-4.64-18.36-4.64c-7.01,0-13.13,1.55-18.37,4.64
	c-1.34,0.79-2.59,1.65-3.77,2.57l11.47,14.34c2.57-3.15,6.13-4.73,10.66-4.73c4.7,0,8.35,1.69,10.94,5.07
	c2.6,3.38,3.9,7.63,3.9,12.73c0,1.84-0.17,3.58-0.52,5.19c-0.59,2.87-1.72,5.39-3.39,7.54c-2.59,3.39-6.24,5.07-10.94,5.07
	c-4.7,0-8.35-1.69-10.95-5.07c-1.66-2.16-2.79-4.67-3.38-7.54h-19.97c0.56,4.36,1.85,8.45,3.87,12.25
	c2.8,5.27,6.82,9.46,12.06,12.55c5.24,3.09,11.36,4.64,18.37,4.64c7,0,13.12-1.55,18.36-4.64c5.24-3.1,9.26-7.28,12.06-12.55
	c2.01-3.8,3.31-7.89,3.87-12.25c0.22-1.69,0.33-3.42,0.33-5.19C503.45,58.94,502.05,53.12,499.25,47.85z M514.33,48.47h-11.87V32.64
	h11.87V14.83h19.79v17.81h17.81v15.83h-17.81v21.77h-19.79V48.47z M601.02,76.59c-0.83,2.36-2.2,4.22-4.11,5.57
	c-1.97,1.4-4.43,2.09-7.38,2.09c-4.02,0-7.38-1.25-10.09-3.75c-2.71-2.5-4.39-5.84-5.04-10.03h-19.16
	c0.51,4.55,1.75,8.75,3.73,12.61c2.67,5.21,6.62,9.33,11.87,12.36c5.24,3.04,11.52,4.55,18.82,4.55c8.61,0,15.57-2.25,20.91-6.76
	c3.27-2.77,5.8-5.95,7.59-9.55L601.02,76.59z M617.33,45.58c-3.03-4.88-7.03-8.51-11.99-10.88c-4.96-2.38-10.31-3.57-16.05-3.57
	c-7.08,0-13.18,1.43-18.32,4.3l10.07,13.18c2.3-1.48,5.17-2.22,8.62-2.22c3.69,0,6.68,1.07,8.98,3.2c2.29,2.14,3.61,5.17,3.93,9.1
	h-14.15v11.81h33.08c0.25-1.89,0.37-4.18,0.37-6.89C621.88,56.46,620.37,50.45,617.33,45.58z M687.75,70.21
	c-1.22-3.05-3.27-5.52-6.15-7.44c-2.74-1.82-6.16-3.28-10.25-4.37h-13.74v15.01c3.49,0.5,6.14,1.05,7.94,1.65
	c2.58,0.86,3.87,2.19,3.87,4c0,1.81-0.9,3.24-2.71,4.3c-1.8,1.07-4.72,1.6-8.73,1.6c-0.12,0-0.25,0-0.37,0
	c-4.15-0.05-7.17-0.97-9.04-2.76c-1.93-1.84-2.93-4.2-3.01-7.07h-19.43c0.41,7.79,3.28,13.84,8.61,18.14
	c5.33,4.3,12.92,6.46,22.75,6.46h0.12c6.42-0.01,12-0.96,16.73-2.83c4.75-1.89,8.4-4.49,10.95-7.81c2.54-3.32,3.81-7.07,3.81-11.25
	C689.11,74.98,688.66,72.44,687.75,70.21z M650.12,47.08c1.56-0.98,4.02-1.47,7.38-1.47h0.12c6.48,0.03,9.84,2.66,10.09,7.87h19.43
	c-0.49-7.46-3.43-13.1-8.79-16.91c-5.37-3.81-12.2-5.72-20.48-5.72c-0.08,0-0.16,0-0.25,0c-6.13,0.02-11.42,1-15.87,2.94
	c-0.53,0.23-1.05,0.47-1.54,0.72l9.34,12.96C649.73,47.34,649.92,47.21,650.12,47.08z"
                                             fill="currentColor"
                                        />
                                   </svg>
                              </div>
                         </div>
                         {
                              cover && (
                                   <div tw="flex h-60 bg-black w-full">
                                        <img
                                             src={cover || ""}
                                             alt=""
                                             tw="object-cover object-center w-full h-full"
                                             style={{ objectFit: "cover", objectPosition: "center" }}
                                        />
                                   </div>
                              )
                         }
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