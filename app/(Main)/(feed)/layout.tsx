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
               <div className="flex content-center justify-center items-center flex-[0_0_auto] rounded-3xl gap-3 mb-4 h-min max-w-[1140px] min-w-[280px] overflow-hidden relative w-full mx-auto mt-14">
                    {children}
               </div>
          </>
     )
}
