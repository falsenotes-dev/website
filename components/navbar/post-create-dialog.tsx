'use client'

import { useRouter } from "next/navigation";
import { Icons } from "../icon";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import React, { useEffect } from "react";
import { User } from "@prisma/client";
import useWindowDimensions from "../window-dimensions";
import { Drawer, DrawerContent, DrawerHeader } from "../ui/drawer";

export default function PostCreateDialog({ publications, session, ...props }: React.ComponentPropsWithoutRef<typeof Dialog> & { publications: any, session: any }) {
     const router = useRouter()
     const [isLoading, setIsLoading] = React.useState<boolean>(false)

     async function onClick({ publication }: { publication?: User['id'] }) {
          setIsLoading(true)

          const response = await fetch("/api/posts", {
               method: "POST",
               headers: {
                    "Content-Type": "application/json",
               },
               body: JSON.stringify({
                    title: "Untitled Post",
                    content: "",
                    url: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                    publicationId: publication,
               }),
          })

          setIsLoading(false)

          const post = await response.json()

          // This forces a cache invalidation.
          router.refresh()

          router.push(`/editor/${post.id}`)
     }
     const { width } = useWindowDimensions()
     const [isDesktop, setIsDesktop] = React.useState<boolean>(false)
     useEffect(() => {
          if (width && width > 768) {
               setIsDesktop(true);
          } else {
               setIsDesktop(false);
          }
     }, [width]);

     if (isDesktop) {
          return (
               <Dialog {...props}>
                    <DialogContent>
                         <DialogHeader>
                              <DialogTitle>Create a new post</DialogTitle>
                         </DialogHeader>
                         <div className="flex flex-col gap-4 my-2">
                              <Button key={session.id} variant={'ghost'} onClick={async () => await onClick({})} className="h-max justify-start" asChild>
                                   <div className="flex gap-2 items-center">
                                        <Avatar>
                                             <AvatarImage src={session.image} alt={session.name} />
                                             <AvatarFallback><Icons.user className="h-4 w-4" /></AvatarFallback>
                                        </Avatar>
                                        <p>{session.name}</p>
                                   </div>
                              </Button>
                              {
                                   publications.map((publication: any) => {
                                        return (
                                             <Button key={publication.id} variant={'ghost'} onClick={async () => await onClick({ publication: publication.publicationId })} className="h-max justify-start" asChild>
                                                  <div className="flex gap-2 items-center">
                                                       <Avatar>
                                                            <AvatarImage src={publication.publication.image} alt={publication.publication.name} />
                                                            <AvatarFallback><Icons.user className="h-4 w-4" /></AvatarFallback>
                                                       </Avatar>
                                                       <p>{publication.publication.name}</p>
                                                  </div>
                                             </Button>
                                        )
                                   })
                              }
                         </div>
                    </DialogContent>
               </Dialog>
          )
     }

     return (
          <Drawer {...props}>
               <DrawerContent>
                    <DrawerHeader>
                         <DialogTitle>Create a new post</DialogTitle>
                    </DrawerHeader>
                    <div className="flex flex-col gap-4 my-2">
                         <Button key={session.id} variant={'ghost'} onClick={async () => await onClick({})} className="h-max justify-start" asChild>
                              <div className="flex gap-2 items-center">
                                   <Avatar>
                                        <AvatarImage src={session.image} alt={session.name} />
                                        <AvatarFallback><Icons.user className="h-4 w-4" /></AvatarFallback>
                                   </Avatar>
                                   <p>{session.name}</p>
                              </div>
                         </Button>
                         {
                              publications.map((publication: any) => {
                                   return (
                                        <Button key={publication.id} variant={'ghost'} onClick={async () => await onClick({ publication: publication.publicationId })} className="h-max justify-start" asChild>
                                             <div className="flex gap-2 items-center">
                                                  <Avatar>
                                                       <AvatarImage src={publication.publication.image} alt={publication.publication.name} />
                                                       <AvatarFallback><Icons.user className="h-4 w-4" /></AvatarFallback>
                                                  </Avatar>
                                                  <p>{publication.publication.name}</p>
                                             </div>
                                        </Button>
                                   )
                              })
                         }
                    </div>
               </DrawerContent>
          </Drawer>
     )
}