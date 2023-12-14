"use client";
import { List } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Icons } from "./icon";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import React from "react";
import { validate } from "@/lib/revalidate";
import { usePathname } from "next/navigation";
import ListCreateDialog from "./list-create-dialog";
import { add } from "lodash";
import { addPostToList } from "@/lib/prisma/list";
import { toast } from "sonner";

export default function ListPopover({
  lists,
  session,
  postId,
  bookmarks,
  ...props
}: React.ComponentPropsWithoutRef<typeof Popover> & {
  lists?: List[];
  session?: any;
  postId?: string;
  bookmarks?: any;
}) {
  const [isSavedInBookmarks, setIsSavedInBookmarks] = React.useState(
    bookmarks?.some((bookmark: any) => bookmark.postId === postId)
  );

  React.useEffect(() => {
     setIsSavedInBookmarks(
       bookmarks?.some((bookmark: any) => bookmark.postId === postId)
     );
       }, [bookmarks, postId]);

  const [createList, setCreateList] = React.useState(false);

  const pathname = usePathname();
  return (
    <>
      <Popover {...props}>
        <PopoverTrigger asChild>{props.children}</PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <div className="flex items-center space-x-2 w-full">
                <Checkbox
                  id="read-later"
                  checked={isSavedInBookmarks}
                  onCheckedChange={async () => {
                    setIsSavedInBookmarks(!isSavedInBookmarks);
                    const res = await fetch(`/api/post/${postId}/save`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ postId }),
                    });
                    await validate(pathname);
                    if (!res.ok) setIsSavedInBookmarks(!isSavedInBookmarks);
                  }}
                />
                <Label
                  htmlFor="read-later"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Read Later
                </Label>
              </div>
              <Icons.lock className="h-4 w-4 text-muted-foreground" />
            </div>
            {lists &&
              lists.map((list: any) => (
                <div className="flex justify-between" key={list.id}>
                  <div className="flex items-center space-x-2">
                    <Checkbox id={list.slug} checked={list.posts?.some((post: any) => post.postId === postId)} onCheckedChange={
                         async () => {
                              const res = await addPostToList({ listId: list.id, postId });
                              await validate(pathname);
                              if (!res.success) toast.error(res.message);
                         }
                    } />
                    <Label
                      htmlFor={list.slug}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {list.name}
                    </Label>
                  </div>
                  {list.visibility === "private" && (
                    <Icons.lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              ))}
            <Separator />
            <Button variant={"link"} className="py-0 h-fit hover:no-underline" onClick={() => setCreateList(true)}>Create a new list</Button>
          </div>
        </PopoverContent>
      </Popover>
      <ListCreateDialog open={createList} onOpenChange={setCreateList} postId={postId} />
    </>
  );
}
