import db from "@/lib/db";
import { Metadata } from "next";

type Props = {
     params: { username: string; slug: string };
     children: React.ReactNode;
};

export async function generateMetadata(
     { params }: Props
): Promise<Metadata> {
     try {
          const decodedUsername = decodeURIComponent(params.username);
          const response = await fetch(`${process.env.DOMAIN}/api/users/${decodedUsername.substring(1)}`);
          if (!response.ok) {
               throw new Error(`Error fetching user data: ${response.statusText}`);
          }
          const data = await response.json();
          const user = data.user;

          const list = await db.list.findFirst({
               where: {
                    slug: params.slug,
                    authorId: user.id,
               },
               include: {
                    _count: { select: { posts: true, savedUsers: true } },
               },
          });

          if (!list) {
               throw new Error(`Error fetching list data: ${list}`);
          }

          return {
               metadataBase: new URL(`${process.env.DOMAIN}/${user.username}`),
               title: `List: ${list.name} by ${user.name || user.username} - FalseNotes`,
               description: list.description || `A list of posts saved by ${user.name || user.username} on FalseNotes.`,
               openGraph: {
                    title: `List: ${list.name} by ${user.name || user.username} - FalseNotes`,
                    description: list.description || `A list of posts saved by ${user.name || user.username} on FalseNotes.`,
               },
          };
     } catch (error) {
          console.error("Error:", error);
          return {
               title: `Not Found - FalseNotes`,
               description: `The page you were looking for doesn't exist.`,
               openGraph: {
                    title: `Not Found - FalseNotes`,
                    description: `The page you were looking for doesn't exist.`,
               },
               twitter: {
                    card: "summary",
                    title: `Not Found - FalseNotes`,
                    description: `The page you were looking for doesn't exist.`,
               },
          };
     }
}

export default function Layout({ children }: Props) {
     return children;
}
