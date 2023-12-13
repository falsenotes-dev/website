import CreateListButton from "@/components/create-list-button";
import ListsTabs from "@/components/lists-tabs";
import { Button } from "@/components/ui/button";
import postgres from "@/lib/postgres";

export default async function ListsPage() {
  const lists = await postgres.list.findMany({
    include: {
      _count: { select: { posts: true } },
      posts: {
        include: {
          post: {
            select: {
              cover: true,
            },
          },
        },
        take: 3,
      },
    },
  });

  return (
    <>
      <div className="flex-auto w-full">
        <div className="pb-14">
          <div className="flex justify-center">
            <div className="my-6 w-full">
              <div className="mt-6 md:mt-12 mb-10">
                <div className="flex justify-between">
                  <h1 className="font-medium line-clamp-1 break-all text-4xl">
                    Your Lists
                  </h1>
                  <CreateListButton />
                </div>
              </div>
              <ListsTabs />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
