'use client'
import { Facebook, Link2, Linkedin, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import Link from "next/link";
import {
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
} from "next-share";
import { Icons } from "./icon";
import React from "react";
import { handleDelete } from "./delete";
import { useRouter } from "next/navigation";
import { addShare } from "@/lib/prisma/add-share";
import { toast } from "sonner";
import { unPin } from "@/lib/prisma/pin";
import { validate } from "@/lib/revalidate";
import { allowComments } from "@/lib/prisma/comments";
import { allowLikes } from "@/lib/prisma/likes";
import { List } from "@prisma/client";
import ListEditDialog from "./list-edit-dialog";

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
          <DropdownMenuItem onSelect={() => setShowEditDialog(true)}>
            <Pencil className="w-4 h-4 mr-2" /> Edit list info
          </DropdownMenuItem>
          {list.visibility === "public" ? (
            <DropdownMenuItem>
              <Icons.lock className="w-4 h-4 mr-2" /> Make it private
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem>
              <Icons.unLock className="w-4 h-4 mr-2" /> Make it public
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ListEditDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        list={list}
      />
    </>
  );
}
