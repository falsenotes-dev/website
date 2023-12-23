'use client'
import { useState } from "react";
import { Icons } from "../icon";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogTitle } from "../ui/alert-dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { deleteProfile } from "@/lib/prisma/delete-profile";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProfileDeleteDialog({ session, ...props }: { session: any } & React.ComponentPropsWithoutRef<typeof AlertDialog>) {
     const [username, setUsername] = useState<string>("");
     const router = useRouter();
     return (
          <AlertDialog {...props}>
               <AlertDialogContent className="flex flex-col justify-center !rounded-lg">
                    <AlertDialogTitle className="text-center">Delete your profile?</AlertDialogTitle>
                    <Alert variant="destructive">
                         <Icons.warning className="h-4 w-4" />
                         <AlertTitle>Warning</AlertTitle>
                         <AlertDescription>
                              This action is irreversible.
                         </AlertDescription>
                    </Alert>
                    <div className="flex flex-col space-y-2 text-center sm:text-left mx-auto">
                         <p className="text-sm text-muted-foreground">
                              We will delete your profile and all of your posts. This action is irreversible.

                              You will be logged out after your profile is deleted and your username will be available for anyone to use on FalseNotes.
                         </p>
                    </div>
                    <Separator className="my-6" />
                    <div className="grid w-full items-center gap-2">
                         <Label htmlFor="username">To confirm, type your username below.</Label>
                         <Input id="username" placeholder="Username" className="w-full" onChange={
                              (e) => {
                                   setUsername(e.target.value);
                              }
                         } />
                    </div>
                    <AlertDialogFooter className="!flex-row !justify-center space-x-2">
                         <AlertDialogCancel className="mt-0">
                              Cancel
                         </AlertDialogCancel>
                         <AlertDialogAction
                              disabled={username !== session?.username}
                              onClick={
                                   async () => {
                                        const res = await deleteProfile();
                                        if (res.status === 200) {
                                             toast('Your profile has been deleted.')
                                             await signOut();
                                             router.push('/');
                                        }
                                        if (res.status === 500) {
                                             toast('Something went wrong. Please try again.')
                                        }
                                   }
                              } className={cn('', buttonVariants({ variant: 'destructive' }))}>Delete this account</AlertDialogAction>
                    </AlertDialogFooter>
               </AlertDialogContent>
          </AlertDialog>
     )
}