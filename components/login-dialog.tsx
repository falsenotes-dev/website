"use client";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { cn } from "@/lib/utils";
import useWindowDimensions from "./window-dimensions";
import React from "react";
import {
     Drawer,
     DrawerClose,
     DrawerContent,
     DrawerDescription,
     DrawerHeader,
     DrawerTitle,
     DrawerTrigger,
} from "@/components/ui/drawer"

export default function LoginDialog({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof Dialog> & { children: React.ReactNode, className?: string }) {
     const { width } = useWindowDimensions();
     const [isDesktop, setIsDesktop] = React.useState(false);
     React.useEffect(() => {
          if (width) setIsDesktop(width > 768);
     }, [width]);

     if (isDesktop) {
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
          );
     }

     return (
          <Drawer {...props}>
               <DrawerTrigger className={cn("", className)} asChild>
                    {children}
               </DrawerTrigger>
               <DrawerContent className="p-6 pt-0">
                    <DrawerHeader>
                         <DrawerTitle>Sign up to continue</DrawerTitle>
                         <DrawerDescription className="mb-4">
                              You need to sign up or sign in to continue.
                         </DrawerDescription>
                    </DrawerHeader>
                    <Button onClick={() => signIn()} className="mt-4">Join Now</Button>
               </DrawerContent>
          </Drawer>
     )
}