import db from "../db";

type NotificationData = {
     type: string;
     content: string;
     receiverId: string;
     url: string;
     senderId: string;
}

export const create = async (data: NotificationData) => {
     try {
          console.log(data)
          await db.notification.create({
               data: {
                    type: data.type,
                    content: data.content,
                    receiverId: data.receiverId,
                    url: data.url,
                    senderId: data.senderId,
               }
          })
          console.log('Notification created')
     } catch (error) {
          console.error(error)
     }
}