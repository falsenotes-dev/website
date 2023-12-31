'use client';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { dateFormat } from "@/lib/format-date";
import { notificationRead } from "./update";
import { useRouter } from "next/navigation";
import { EmptyPlaceholder } from "../empty-placeholder";
import { Button } from "../ui/button";
import { Icons } from "../icon";
import { markAllRead } from "@/lib/notifications/mark-all-read";
import { toast } from "sonner";
import { validate } from "@/lib/revalidate";

export default function NotificationList({ notifications, ...props }: { notifications: any } & React.ComponentPropsWithoutRef<typeof Card>) {
     const router = useRouter()
     return (
          <Card className="rounded-lg bg-background border-none shadow-none">
               <CardHeader className="py-4 px-0 flex flex-row justify-between">
                    <CardTitle className="text-base">Notifications</CardTitle>
                    <Button variant={'outline'} size={'sm'} className="flex items-center gap-1.5" onClick={
                         async () => {
                              const res = await markAllRead()
                              if (res) {
                                   toast.success('All notifications marked as read')
                              } else {
                                   toast.error('Something went wrong')
                              }
                              await validate('/notifications')
                         }
                    }>
                         <Icons.notification className="w-4 h-4" />
                         <span>Mark all as read</span>
                    </Button>
               </CardHeader>
               <CardContent className="p-0">
                    <div className="flex flex-col items-start justify-between">
                         {notifications.length > 0 && (notifications?.map((notification: any) => (
                              <Card key={notification.id} onClick={
                                   async () => {
                                        await notificationRead(notification.id)
                                   }
                              }
                                   className="w-full border-none shadow-none bg-background hover:bg-accent/95 transition-colors duration-200 ease-in-out"
                              >
                                   <CardContent className="flex gap-4 items-center p-4">
                                        <Badge variant={notification?.read ? 'secondary' : 'default'} className="h-2 w-2 p-0" />
                                        <div className="flex gap-4 w-full items-center justify-between" key={notification.id}>
                                             <div className="space-x-3 flex items-center">
                                                  <Link href={`/@${notification?.sender?.username}`}>
                                                       <Avatar className="h-9 w-9 mr-0.5 border">
                                                            <AvatarImage src={notification?.sender?.image} alt={notification?.sender?.username} />
                                                            <AvatarFallback>{notification?.sender?.name?.charAt(0) || notification?.sender?.username?.charAt(0) || (<Icons.user className="h-5 w-5" />)}</AvatarFallback>
                                                       </Avatar>
                                                  </Link>
                                                  <div className="flex flex-col items-start gap-1" onClick={() =>
                                                       router.push(notification.url)
                                                  }>
                                                       <p className="text-sm font-normal leading-normal">{
                                                            //make bold sender username and if type comment make bold post title from content
                                                            <span className="font-bold">{notification?.sender?.name || notification?.sender?.username || 'Deleted Account'}</span>
                                                       } {notification?.type === 'comment' && (
                                                            <>
                                                                 <span>commented on your post: </span>
                                                                 <span className="font-bold">{notification.content}</span>
                                                            </>
                                                       )} {notification?.type === 'like' && (
                                                            <span>liked your post</span>
                                                       )} {notification?.type === 'follow' && (
                                                            <span>is now following you</span>
                                                       )}
                                                            {notification.type === 'reply' && (
                                                                 <>
                                                                      <span>replied to your comment: </span>
                                                                      <span className="font-bold">{notification.content}</span>
                                                                 </>
                                                            )}
                                                            {notification.type === 'commentLike' && (
                                                                 <>
                                                                      <span>liked your comment: </span>
                                                                      <span className="font-bold">{notification.content}</span>
                                                                 </>
                                                            )}
                                                            {
                                                                 notification.type === 'postLike' && (
                                                                      <>
                                                                           <span>liked your post: </span>
                                                                           <span className="font-bold">{notification.content}</span>
                                                                      </>
                                                                 )
                                                            }
                                                            {
                                                                 notification.type === 'blogInvite' && (
                                                                      <>
                                                                           <span>invited you to join their blog</span>
                                                                      </>
                                                                 )
                                                            }
                                                       </p>
                                                       <p className="!text-muted-foreground text-sm">
                                                            {dateFormat(notification?.createdAt)}
                                                       </p>
                                                  </div>
                                             </div>
                                        </div>
                                   </CardContent>
                              </Card>
                         )))}
                         {
                              notifications.length === 0 && (
                                   <EmptyPlaceholder className="w-full">
                                        <EmptyPlaceholder.Icon name="notification" />
                                        <EmptyPlaceholder.Title>No notifications</EmptyPlaceholder.Title>
                                        <EmptyPlaceholder.Description>
                                             You don&apos;t have any notifications yet.
                                        </EmptyPlaceholder.Description>
                                   </EmptyPlaceholder>
                              )
                         }
                    </div>
               </CardContent>
          </Card>
     );
}