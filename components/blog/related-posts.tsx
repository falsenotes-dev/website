import Link from "next/link";
import TagPostCard from "../tags/post-card";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

export default function RelatedPosts({ posts, post, session, list }: { posts: any, post: any, session: any, list: any }) {
     return (
          <>
               <div className="max-w-[680px] mx-auto">
                    <h2 className="text-2xl font-medium md:mx-6 mx-2">Recommended from FalseNotes</h2>
                    <div className="mt-14">
                         <div className="grid md:grid-cols-2 gap-4">
                              {
                                   posts?.map((post: any) => (
                                        <TagPostCard post={post} session={session} key={post.id} list={list} />
                                   ))
                              }
                         </div>
                         
                         {
                              session && (
                                   <>
                                        <Separator className="mb-6" />
                                   <Button variant={"outline"} className="w-full md:w-max md:mb-0" size={"lg"} asChild>
                                        <Link href={`/feed`}>
                                             See more recommendations
                                        </Link>
                                   </Button>
                                   </>
                              )
                         }
                    </div>
               </div>
          </>
     )
}