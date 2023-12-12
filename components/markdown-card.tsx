/* eslint-disable @next/next/no-img-element */
import { PreBlock } from "@/lib/syntax"
import { cn } from "@/lib/utils"
import Markdown from "markdown-to-jsx"

export default function MarkdownCard({ code, className }: { code: string, className?: string }) {
     return (
          <article className={cn("article__content prose-neutral dark:prose-invert prose-img:rounded-xl prose-a:text-primary prose-code:bg-popover prose-pre:!bg-popover prose-code:text-foreground prose-pre:text-foreground !max-w-full prose lg:prose-xl", className)}>
               <Markdown options={{
                    overrides: {
                         pre: PreBlock,
                         img: {
                              component: (props: any) => {
                                   return props.title ? (
                                        <figure className="blog_image_wrap relative">
                                             <img {...props} className="!relative w-full rounded-md" alt={props.alt} />
                                             <figcaption className="absolute right-2.5 z-10 bottom-2 py-2 px-8 text-sm rounded-md w-fit bg-secondary/25 backdrop-blur-xl text-secondary-foreground">{props.title}</figcaption>
                                        </figure>
                                   ) : (
                                        <figure className="blog_image_wrap">
                                             <img {...props} className="!relative w-full hover:scale-105" alt={props.alt} />
                                        </figure>
                                   )
                              }
                         },
                    },
               }}>
                    {code}
               </Markdown>
          </article>
     )
}