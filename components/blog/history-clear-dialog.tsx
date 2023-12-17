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
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { clearHistory } from "@/lib/prisma/history";
import { toast } from "sonner";


export default function HistoryClearDialog({ post, user, ...props }: React.ComponentPropsWithoutRef<typeof AlertDialog> & { post: any, user: any }) {
     const router = useRouter()
     return (
          <AlertDialog {...props}>
          <AlertDialogContent className="flex flex-col justify-center !w-72 !rounded-lg">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto">
              <Icons.delete className={"h-10 w-10"} />
            </div>
            <div className="flex flex-col space-y-2 text-center sm:text-left mx-auto">
              <h1 className="text-lg font-semibold leading-none tracking-tight text-center">Clear history</h1>
              <p className="text-sm text-muted-foreground text-center">
                    Are you sure you want to clear your history? This action cannot be undone.
              </p>
            </div>
            <AlertDialogFooter className="!flex-row !justify-center space-x-2">
              <AlertDialogCancel className="mt-0">
              Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={async () => {
                        const res = await clearHistory();
                        if (!res.success) {
                          toast.error(res.message);
                        } else {
                          toast.success(res.message);
                        }
                        await validate(`/lists/history`);
                      }} className={cn(buttonVariants({variant: "destructive"}))}>Clear History</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
     )
}