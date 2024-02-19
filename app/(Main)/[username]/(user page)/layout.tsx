import { SiteFooter } from '@/components/footer';
import { formatNumberWithSuffix } from '@/components/format-numbers';
import { getSessionUser } from '@/components/get-session-user';
import { MobileBottomNavbar } from '@/components/navbar/mobile-bottom-navbar';
import Header from '@/components/user/header';
import db from '@/lib/db';
import type { Metadata } from 'next'
import { notFound } from 'next/navigation';

type Props = {
  params: { username: string }
  children: React.ReactNode
}


export default async function UserLayout(
  { children, params }: Props
) {
  const decodedUsername = decodeURIComponent(params.username);
  const session = await getSessionUser()
  const user = await db.user.findFirst({
    include: {
      urls: true,
      _count: {
        select: {
          posts: {
            where: {
              published: true,
            },
          },
          publicationsPosts: {
            where: {
              published: true,
            },
          },
          Followers: true,
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
      writers: {
        where: {
          visibility: "public",
        },
        select: {
          author: {
            include: {
              _count: { select: { Followers: true, Followings: true } },
            },
          },
        }
      },
      publications: {
        where: {
          visibility: "public",
        },
        select: {
          publication: {
            include: {
              _count: { select: { Followers: true, Followings: true } },
            },
          },
        },
        take: 5,
      }
    },
    where: {
      username: decodedUsername.substring(1),
    },
  });

  if (!user) return notFound()

  return (
    <>
      <div className="flex flex-col justify-start items-center w-full xl:px-0 px-3 py-8 relative">
        <Header user={user} session={session} followers={user.Followers} />
        <div className='flex max-w-5xl min-w-[280px] w-full py-10' style={{
          minHeight: "calc(100vh - 530px)"
        }}>
          <div className="flex flex-col flex-[1_0_auto] max-w-5xl min-w-[280px] w-full relative xl:px-0 px-3">
            {children}
          </div>
        </div>
        <MobileBottomNavbar />
      </div>
      <SiteFooter />
    </>
  );
}
