import Link from "next/link";
import TagPostCard from "../tags/post-card";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import ListCard from "../list-card-v2";

export default function RelatedPosts({
  posts,
  post,
  session,
  list,
  lists,
}: {
  posts: any;
  post: any;
  session: any;
  list: any;
  lists: any;
}) {
  const firstPosts = posts?.slice(0, 2);
  const lastPosts = posts?.slice(2, 4);
  return (
    <>
      <div className="max-w-[680px] mx-auto">
        <h2 className="text-2xl font-medium md:mx-6 mx-2">
          Recommended from FalseNotes
        </h2>
        <div className="mt-14">
          <div className="grid md:grid-cols-2 gap-4">
            {firstPosts?.map((post: any) => (
              <TagPostCard
                post={post}
                session={session}
                key={post.id}
                list={list}
              />
            ))}
          </div>
          <Separator className="my-6" />
          <h2 className="font-medium text-xl mb-6">Lists</h2>
          <div className="grid md:grid-cols-2 gap-4 w-full">
            {lists?.map((list: any) => (
              <ListCard key={list.id} list={list} session={session} />
            ))}
          </div>
          {lastPosts?.length > 0 && (
            <>
              <Separator className="my-6" />
            </>
          )}
          <div className="grid md:grid-cols-2 gap-4">
            {lastPosts?.map((post: any) => (
              <TagPostCard
                post={post}
                session={session}
                key={post.id}
                list={list}
              />
            ))}
          </div>

          {session && (
            <>
              <Separator className="my-6" />
              <Button
                variant={"outline"}
                className="w-full md:w-max md:mb-0"
                size={"lg"}
                asChild
              >
                <Link href={`/feed`}>See more recommendations</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
