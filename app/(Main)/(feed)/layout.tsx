import { Metadata } from "next"

export const metadata: Metadata = {
     title: 'Home - FalseNotes',
}

export default function FeedLayout({
     children,
}: {
     children: React.ReactNode
}) {
     return (
          <>
               <div className="md:flex content-center justify-center items-center flex-[0_0_auto] rounded-3xl gap-3 mb-4 h-min max-w-7xl min-w-[280px] w-full mx-auto md:mt-14 flex-col">
                    {children}
               </div>
          </>
     )
}
