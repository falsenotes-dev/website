import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import Link from "next/link"
import { Icons } from "../icon"
import UserHoverCard from "../user-hover-card"
import { Hash } from "lucide-react"
import { cn } from "@/lib/utils"
import { EmptyPlaceholder } from "../empty-placeholder"
import UserHorizontalCard from "../user-horizontal-card"

export default function ExploreComponent({ users, posts, tags, lists, session, search, className }: {
     users: any, posts: any, tags: any, lists: any, session: any, search: any, className?: string
}) {
     return (
          <div className={cn("max-w-7xl min-w-[280px]w-full mb-10 space-y-4", className)}>
               {posts.length > 0 && (
                    <Card>
                         <CardHeader className="">
                              <CardTitle className="feed__content_featured_card_title text-base">Posts</CardTitle>
                         </CardHeader>
                         <CardContent className="">
                              <ol className="flex flex-col items-start justify-between space-y-4">
                                   {posts.map(
                                        (item: any, index: number) => (
                                             <li key={item.id} className="text-sm space-y-2.5">

                                                  <div className="flex items-center">
                                                       <Link href={`/@${item.author.username}`} className="text-xs flex items-center font-medium">
                                                            <Avatar className="h-5 w-5 mr-1 md:mr-1.5 border">
                                                                 <AvatarImage src={item.author?.image} alt={item.author?.username} />
                                                                 <AvatarFallback>{item.author?.name?.charAt(0) || item.author?.username?.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            {item.author.name || item.author.username} {item.author?.verified && (
                                                                 <Icons.verified className="h-3 w-3 mx-0.5 inline fill-verified align-middle" />
                                                            )}
                                                       </Link>
                                                       {item.publication && (
                                                            <Link href={`/@${item.publication.username}`} className="text-xs flex items-center font-medium">
                                                                 <p>
                                                                      <span className="text-xs text-muted-foreground">in</span>
                                                                      <span>{' ' + item.publication.name || item.publication.username}</span>
                                                                 </p>
                                                            </Link>
                                                       )}
                                                  </div>

                                                  <Link href={`/@${item.author.username}/${item.url}`} className="text-base font-bold line-clamp-2 overflow-hidden leading-tight">
                                                       {item.title}
                                                  </Link>
                                             </li>
                                        ))}
                              </ol>
                         </CardContent>
                         <CardFooter className="flex justify-end">
                              <Link href={`/explore/posts${(search !== undefined) ? `?search=${search}` : ''}`} className="text-sm font-medium">
                                   See all posts
                              </Link>
                         </CardFooter>
                    </Card>

               )}
               {users.length > 0 && (
                    <Card>
                         <CardHeader>
                              <CardTitle className="feed__content_featured_card_title text-base">Users</CardTitle>
                         </CardHeader>
                         <CardContent>
                              <div className="feed__content_featured_card_content flex flex-col items-start justify-between space-y-4">
                                   {users?.map(
                                        (item: any, index: number) => (
                                             <div className="flex gap-4 w-full items-center justify-between" key={item.id}>
                                                  <div className="space-y-3 w-full">
                                                       <UserHorizontalCard user={item} session={session} />
                                                  </div>
                                             </div>
                                        ))}
                              </div>
                         </CardContent>
                         <CardFooter className="flex justify-end">
                              <Link href={`/explore/users${(search !== undefined) ? `?search=${search}` : ''}`} className="text-sm font-medium">
                                   See all users
                              </Link>
                         </CardFooter>
                    </Card>
               )}

               {tags.length > 0 && (
                    <Card>
                         <CardHeader>
                              <CardTitle className="text-base">Tags</CardTitle>
                         </CardHeader>
                         <CardContent>
                              <div className="flex flex-col divide-y">
                                   {tags?.map((tag: any, index: number) => (
                                        <div className="flex items-center justify-between py-4" key={tag.id}>
                                             <Link href={`/tags/${tag.name}`} className="w-full">
                                                  <div className="flex items-center">
                                                       <div className="space-y-1">
                                                            <p className="text-base capitalize"><Icons.hash className="h-4 w-4 mr-1.5 inline" />{tag.name.replace(/-/g, " ")}</p>
                                                            <p className="text-sm text-muted-foreground">{tag._count.posts} posts · {tag._count.followingtag} followers</p>
                                                       </div>
                                                  </div>
                                             </Link>
                                        </div>
                                   ))}
                              </div>
                         </CardContent>
                         <CardFooter className="flex justify-end">
                              <Link href={`/explore/tags${(search !== undefined) ? `?search=${search}` : ''}`} className="text-sm font-medium">
                                   See all tags
                              </Link>
                         </CardFooter>
                    </Card>
               )}
               {lists.length > 0 && (
                    <Card>
                         <CardHeader>
                              <CardTitle className="text-base">Lists</CardTitle>
                         </CardHeader>
                         <CardContent>
                              <div className="flex flex-col divide-y">
                                   {lists?.map((list: any, index: number) => (
                                        <div className="flex items-center justify-between py-4" key={list.id}>
                                             <Link href={`/@${list.author.username}/list/${list.slug}`} className="w-full">
                                                  <div className="flex items-center">
                                                       <div className="space-y-1">
                                                            <p className="text-base line-clamp-1"><Icons.list className="h-5 w-5 mr-1.5 inline" />{list.name}</p>
                                                            <p className="text-sm text-muted-foreground">{list._count.posts} posts · {list._count.savedUsers} saves</p>
                                                       </div>
                                                  </div>
                                             </Link>
                                        </div>
                                   ))}
                              </div>
                         </CardContent>
                         <CardFooter className="flex justify-end">
                              <Link href={`/explore/lists${(search !== undefined) ? `?search=${search}` : ''}`} className="text-sm font-medium">
                                   See all lists
                              </Link>
                         </CardFooter>
                    </Card>
               )}

               {posts.length === 0 && users.length === 0 && tags.length === 0 && (
                    <EmptyPlaceholder className="w-full">
                         <EmptyPlaceholder.Icon name="notfound" strokeWidth={1.25} />
                         <EmptyPlaceholder.Title>No results found</EmptyPlaceholder.Title>
                         <EmptyPlaceholder.Description>
                              Try searching for something else.
                         </EmptyPlaceholder.Description>
                    </EmptyPlaceholder>
               )}
          </div>
     )
}