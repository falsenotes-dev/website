import db from "@/lib/db";
import { Metadata } from "next";

type Props = {
  params: { username: string };
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const decodedUsername = decodeURIComponent(params.username);
    const user = await db.user.findFirst({
      where: {
        username: decodedUsername.substring(1),
      },
    });

    if (!user) {
      throw new Error(`Error fetching user data: ${user}`);
    }

    return {
      title: `List: Read Later by ${user?.name || user?.username} - FalseNotes`,
      description: `A list of posts saved by ${user?.name || user?.username
        } on FalseNotes.`,
      openGraph: {
        title: `List: Read Later by ${user?.name || user?.username
          } - FalseNotes`,
        description: `A list of posts saved by ${user?.name || user?.username
          } on FalseNotes.`,
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

export default function UserLayout({ children, params }: Props) {
  return children;
}
