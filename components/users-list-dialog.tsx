'use client'
import React from "react";
import {
     Dialog,
     DialogClose,
     DialogContent,
     DialogDescription,
     DialogHeader,
     DialogTitle,
     DialogTrigger,
} from "@/components/ui/dialog"
import useWindowDimensions from "@/components/window-dimensions";
import {
     Drawer,
     DrawerClose,
     DrawerContent,
     DrawerDescription,
     DrawerHeader,
     DrawerTitle,
     DrawerTrigger,
} from "@/components/ui/drawer"
import { ScrollArea } from "./ui/scroll-area";



export default function UserListsDialog({ children, className, trigger, title, desc, ...props }: { className?: string, trigger: any, title?: string, desc?: string } & React.ComponentPropsWithoutRef<typeof Dialog>) {
     const { width, height } = useWindowDimensions();
     const [isDesktop, setIsDesktop] = React.useState(false);
     React.useEffect(() => {
          if (width && width > 768) {
               setIsDesktop(true);
          } else {
               setIsDesktop(false);
          }
     }, [width, height]);

     if (isDesktop) {
          return (
               <>
                    <Dialog {...props} >
                         <DialogTrigger asChild>
                              {trigger}
                         </DialogTrigger>
                         <DialogContent className="md:w-1/2 h-1/2 pb-0">
                              <DialogHeader>
                                   {title && <DialogTitle>{title}</DialogTitle>}
                                   {desc && <DialogDescription>{desc}</DialogDescription>}
                              </DialogHeader>
                              <ScrollArea>
                                   <div className="pb-6">
                                        {children}
                                   </div>
                              </ScrollArea>
                         </DialogContent>
                    </Dialog>

               </>
          )
     }

     return (
          <>
               <Drawer {...props} >
                    <DrawerTrigger asChild>
                         {trigger}
                    </DrawerTrigger>
                    <DrawerContent className="p-6 py-0 h-5/6">
                         <DrawerHeader>
                              {title && <DrawerTitle>{title}</DrawerTitle>}
                              {desc && <DrawerDescription>{desc}</DrawerDescription>}
                         </DrawerHeader>
                         <ScrollArea>
                              <div className="pb-6">
                                   {children}
                              </div>
                         </ScrollArea>
                    </DrawerContent>
               </Drawer>
          </>
     )
}