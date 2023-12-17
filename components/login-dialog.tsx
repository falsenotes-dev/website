"use client";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { cn } from "@/lib/utils";

export default function LoginDialog({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof Dialog> & { children: React.ReactNode, className?: string }) {
     return (
          <Dialog {...props}>
               <DialogTrigger className={className} asChild>
                    {children}
               </DialogTrigger>
               <DialogContent className="md:w-auto">
                    <DialogHeader>
                         <DialogTitle>Sign up to continue</DialogTitle>
                         <DialogDescription className="mb-4">
                              You need to sign up or sign in to continue.
                         </DialogDescription>
                    </DialogHeader>
                    <Button onClick={() => signIn()} className="mt-4">Join Now</Button>
               </DialogContent>
          </Dialog>
     )
}