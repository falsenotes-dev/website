import postgres from "@/lib/postgres";

export default async function ListPage({ params }: { params: { listSlug: string } }) {
     const list = await postgres.list.findFirst({
          where: {
               slug: params.listSlug
          },
          include: {
               _count: { select: { posts: true } },
               posts: {
                    include: {
                         post: {
                              select: {
                                   cover: true,
                              }
                         }
                    },
                    take: 3,
               },
          }
     });
}