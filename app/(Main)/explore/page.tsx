import Posts from "@/components/explore/posts"
import Search from "@/components/explore/search"
import { getSessionUser } from "@/components/get-session-user"
import { getPosts } from "@/lib/prisma/posts"
import { getUsers } from "@/lib/prisma/users"
import { searchTags } from "@/lib/prisma/tags"
import ExploreComponent from "@/components/explore/tab-content"
import ExploreTab from "@/components/explore/tab"
import Users from "@/components/explore/users"
import Tags from "@/components/explore/tags"
import { getLists } from "@/lib/prisma/session"
import { searchLists } from "@/lib/prisma/list"

export default async function Explore({
     searchParams
}: {
     searchParams: { [key: string]: string | string[] | undefined }
}) {

     const search = typeof searchParams.search === 'string' ? searchParams.search : undefined

     const { posts } = await getPosts({ search, limit: 3 })
     const { users } = await getUsers({ search, limit: 3 })
     const { tags } = await searchTags({ search, limit: 3 })
     const { lists } = await searchLists({ search, limit: 3 })
     const session = await getSessionUser()

     return (
          <>
               <div className="flex flex-col items-center py-10 space-y-8">
                    <h2 className="font-medium text-4xl">Explore</h2>
                    <Search search={search} />
                    <ExploreTab defaultValue="top" search={search} />
                    <ExploreComponent users={users} posts={posts} tags={tags} lists={lists} session={session} search={search} className="md:w-[600px]" />
               </div>
          </>
     )
}