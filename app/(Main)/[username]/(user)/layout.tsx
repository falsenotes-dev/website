import { SiteFooter } from "@/components/footer";
import { getSessionUser } from "@/components/get-session-user";
import { Separator } from "@/components/ui/separator";
import { UserDetails } from "@/components/user";
import postgres from "@/lib/postgres";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

type Props = {
     params: { username: string }
     children: React.ReactNode
   }

export default async function Layout({ children, params }: Props) {
     const decodedUsername = decodeURIComponent(params.username);

  if (!decodedUsername.startsWith("@")) redirect("/404");

  const sessionUserName = await getSessionUser();
  const user = await postgres.user.findFirst({
    include: {
      _count: {
        select: {
          posts: {
            where: {
              published: true,
            },
          },
        },
      },
      Followers: {
        include: {
          follower: {
            include: {
              Followers: true,
              Followings: true,
            },
          },
        },
      },
      Followings: {
        include: {
          following: {
            include: {
              Followers: true,
              Followings: true,
            },
          },
        },
      },
    },
    where: {
      username: decodedUsername.substring(1),
    },
  });

  if (!user) {
    return notFound();
  }

  const followers = user?.Followers;
  const following = user?.Followings;

     return (
          <>
               <div className="md:container mx-auto px-4">
      <div className="gap-5 lg:gap-6 flex flex-col md:flex-row items-start xl:px-4">
        <div
          className="user__header hidden lg:min-w-[352px] border-r lg:max-w-[352px] md:px-8 xl:min-w-[368px] xl:max-w-[368px] lg:pl-10 lg:flex flex-col md:sticky top-[115px]"
          style={{
            minHeight: "calc(100vh - 125px)",
          }}
        >
          <div className="md:flex-[1_0_auto]">
            <UserDetails
              user={user}
              followers={followers}
              session={sessionUserName}
            />
          </div>
          <SiteFooter className="text-xs flex-col justify-start items-start mb-0 mt-4 !px-0" />
        </div>
        <Separator className="block md:hidden lg:block h-full" orientation="vertical" />
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
          </>
     )
}