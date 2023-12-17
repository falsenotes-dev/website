'use client'
import { usePathname, useRouter } from "next/navigation";
import { handleDelete } from "./delete";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react";
import { validate } from "@/lib/revalidate";
import { Icons } from "./icon";
import { List } from "@prisma/client";
import { deleteList } from "@/lib/prisma/list";
import { toast } from "sonner";


export default function ListDeleteDialog({ list, ...props }: React.ComponentPropsWithoutRef<typeof AlertDialog> & { list: List }) {
     const router = useRouter()
     const pathname = usePathname();
     return (
          <AlertDialog {...props}>
          <AlertDialogContent className="flex flex-col justify-center !w-72 !rounded-lg">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto">
              <Icons.delete className={"h-10 w-10"} />
            </div>
            <div className="flex flex-col space-y-2 text-center sm:text-left mx-auto">
              <h1 className="text-lg font-semibold leading-none tracking-tight text-center">Delete List</h1>
              <p className="text-sm text-muted-foreground text-center">
                Are you sure you want to delete this list? This action cannot be undone.
              </p>
            </div>
            <AlertDialogFooter className="!flex-row !justify-center space-x-2">
              <AlertDialogCancel className="mt-0">
              Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={
                async () => {
                  const res = await deleteList({ id: list?.id })
                  await validate(pathname)
                  if (!res.success) {
                    toast.error(res.message)
                  }
                }
              } className="bg-destructive focus:ring-destructive">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
     )
}