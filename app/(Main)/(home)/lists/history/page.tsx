import CreateListButton from "@/components/create-list-button";
import { getSessionUser } from "@/components/get-session-user";
import ListsTabs from "@/components/lists-tabs";
import { Button } from "@/components/ui/button";
import UserHistory from "@/components/user/history";
import postgres from "@/lib/postgres";
import { getHistory } from "@/lib/prisma/session";

export default async function HistoryPage() {
     const session = await getSessionUser();

     const { history } = await getHistory({
          id: session?.id,
          limit: 10,
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
              <UserHistory posts={history} sessionUser={session} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
