"use client";
import { MoreHorizontalIcon } from "lucide-react";
import { Icons } from "./icon";
import ListMoreActions from "./list-more-actions";
import LoginDialog from "./login-dialog";
import { Button } from "./ui/button";
import { saveList } from "@/lib/prisma/list";
import { validate } from "@/lib/revalidate";
import { toast } from "sonner";
import React from "react";

export default function ListHeader({
  list,
  session,
}: {
  list: any;
  session: any;
}) {
  const [saved, setSaved] = React.useState(false);
  React.useEffect(() => {
    setSaved(list.savedUsers.find((user: any) => user.userId === session?.id));
  }, [list.savedUsers, session]);
  return (
    <>
      <div className="lg:mx-6 justify-between flex items-start">
        <div className="pb-6">
          <h2 className="text-3xl line-clamp-2 font-bold">{list.name}</h2>
          {list.description && (
            <p className="text-lg text-muted-foreground line-clamp-2">
              {list.description}
            </p>
          )}
        </div>
        <div className="flex gap-1">
          {session ? (
            <Button
              variant="ghost"
              size={"icon"}
              className="text-muted-foreground"
              disabled={list.authorId === session?.id}
              onClick={async () => {
                const res = await saveList({ id: list.id });
                await validate("/list/saved");
                if (res.success) {
                  toast(res.message);
                } else {
                  toast.error(res.message);
                }
              }}
            >
              {saved ? (
                <Icons.listSaveFill className="h-5 w-5" />
              ) : (
                <Icons.listSave className="h-5 w-5" />
              )}
            </Button>
          ) : (
            <LoginDialog>
              <Button
                variant="ghost"
                size={"icon"}
                className="text-muted-foreground"
              >
                <Icons.listSave className="h-5 w-5" />
              </Button>
            </LoginDialog>
          )}
          <ListMoreActions list={list} session={session}>
            <Button
              variant="ghost"
              size={"icon"}
              className="text-muted-foreground"
            >
              <MoreHorizontalIcon className="h-5 w-5" />
            </Button>
          </ListMoreActions>
        </div>
      </div>
    </>
  );
}
