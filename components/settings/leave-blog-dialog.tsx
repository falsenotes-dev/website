import { toast } from "sonner";
import { Icons } from "../icon";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter } from "../ui/alert-dialog";
import { buttonVariants } from "../ui/button";
import { leaveBlog } from "@/lib/prisma/blog";
import { validate } from "@/lib/revalidate";
import { PublicationAuthor } from "@prisma/client";

export default function LeaveBlogDialog({
     blog,
     ...props
}: React.ComponentPropsWithoutRef<typeof AlertDialog> & { blog: PublicationAuthor }) {
     return (
          <>
               <AlertDialog {...props}>
                    <AlertDialogContent className="flex flex-col justify-center !w-96 !rounded-lg">
                         <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto">
                              <Icons.logOut className={"h-10 w-10"} />
                         </div>
                         <div className="flex flex-col space-y-2 text-center sm:text-left mx-auto">
                              <h1 className="text-lg font-semibold leading-none tracking-tight text-center">Leave Blog</h1>
                              <p className="text-sm text-muted-foreground text-center">
                                   Are you sure you want to leave this blog? This action cannot be undone.
                              </p>
                         </div>
                         <AlertDialogFooter className="!flex-row !justify-center space-x-2">
                              <AlertDialogCancel className="mt-0">
                                   Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction onClick={
                                   async () => {
                                        const res = await leaveBlog({ id: blog.publicationId })
                                        if (res?.success) {
                                             toast.success(res.message)
                                             await validate('/settings/blogs')
                                        } else {
                                             toast.error(res?.message)
                                        }
                                   }
                              } className={buttonVariants({ variant: 'destructive' })}>Leave</AlertDialogAction>
                         </AlertDialogFooter>
                    </AlertDialogContent>
               </AlertDialog>
          </>
     )
}