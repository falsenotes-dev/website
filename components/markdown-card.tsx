/* eslint-disable @next/next/no-img-element */
import { PreBlock } from "@/lib/syntax"
import { cn } from "@/lib/utils"
import Markdown from "markdown-to-jsx"

export default function MarkdownCard({ code, className }: { code: string, className?: string }) {
     return (
          <article className={cn("article__content prose-lg prose-stone dark:prose-invert prose-headings:font-title focus:outline-none max-w-full prose-ul:list-[revert] prose-ol:list-decimal prose-a:border-b-2 prose-a:!border-primary hover:prose-a:bg-primary hover:prose-a:text-primary-foreground prose-a:transition hover:prose-a:no-underline", className)}>
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