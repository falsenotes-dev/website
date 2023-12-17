'use client'
import { Facebook, Link2, Linkedin, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "./icon";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { List } from "@prisma/client";
import ListEditDialog from "./list-edit-dialog";
import ListDeleteDialog from "./list-delete-dialog";
import { makeListPrivate, makeListPublic } from "@/lib/prisma/list";
import { validate } from "@/lib/revalidate";
import { toast } from "sonner";

export default function ListMoreActions({
  list,
  session,
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenu> & {
  list: List;
  session: any;
  className?: string;
}) {
  const copylink = async (link: string) => {
    navigator.clipboard.writeText(link);
    toast("Link copied to clipboard");
  };
  const router = useRouter();
  const pathname = usePathname();
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false);
  const [showPinAlert, setShowPinAlert] = React.useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = React.useState<boolean>(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => copylink(`/list/${list.slug}`)}>
            <Icons.link className="h-4 w-4 mr-2" /> Copy Link
          </DropdownMenuItem>
          {
            session?.id === list.authorId && (
              <DropdownMenuItem onSelect={() => setShowEditDialog(true)}>
            <Pencil className="w-4 h-4 mr-2" /> Edit list info
          </DropdownMenuItem>
            )
          }
          {session?.id === list.authorId && (
            list.visibility === "public" ? (
              <DropdownMenuItem onSelect={
                async () => {
                  const res = await makeListPrivate({ id: list.id })
                  await validate(pathname)
                  if (!res.success) {
                    toast.error(res.message);
                  } else {
                    toast.success("List is now private");
                  }
                }
              }>
                <Icons.lock className="w-4 h-4 mr-2" /> Make it private
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onSelect={
                async () => {
                  const res = await makeListPublic({ id: list.id })
                  await validate(pathname)
                  if (!res.success) {
                    toast.error(res.message);
                  } else {
                    toast.success("List is now public");
                  }
                }
              }>
                <Icons.unLock className="w-4 h-4 mr-2" /> Make it public
              </DropdownMenuItem>
            )
          )}
          {session?.id === list.authorId && (
            <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
              onSelect={async () => {
                setShowDeleteAlert(true);
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete list
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ListEditDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        list={list}
      />
      <ListDeleteDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert} list={list} />
    </>
  );
}
