import { useRouter } from "next/navigation";
import { handleDelete } from "../delete";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react";
import { validate } from "@/lib/revalidate";
import { Icons } from "../icon";
import { pin } from "@/lib/prisma/pin";
import { toast } from "sonner";


export default function PostPinDialog({ post, user, ...props }: React.ComponentPropsWithoutRef<typeof AlertDialog> & { post: any, user: any }) {
  const router = useRouter()
  return (
    <AlertDialog {...props}>
      <AlertDialogContent className="flex flex-col justify-center !w-72 !rounded-lg">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto">
          <Icons.pin className={"h-10 w-10"} />
        </div>
        <div className="flex flex-col space-y-2 text-center sm:text-left mx-auto">
          <h1 className="text-lg font-semibold leading-none tracking-tight text-center">Pin Post</h1>
          <p className="text-sm text-muted-foreground text-center">
            Are you sure you want to pin this post? This will override any other pinned posts.
          </p>
        </div>
        <AlertDialogFooter className="!flex-row !justify-center space-x-2">
          <AlertDialogCancel className="mt-0">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={
            async () => {
              const res = await pin(post?.id, post?.publication.id)
              await validate(`/@${user?.username}`)
              if (res.status !== 200) {
                toast.error("Something went wrong")
              }
            }
          }>Pin</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}