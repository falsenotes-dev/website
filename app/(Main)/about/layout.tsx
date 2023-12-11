import { SiteFooter } from "@/components/footer";

export const metadata = {
     title: 'About - FalseNotes',
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
     return (
          <>
               <div className="md:container mx-auto px-4 pt-5">
                    {children}
               </div>
               <SiteFooter className="!px-3.5" />
          </>
     )
}