'use client'

import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from 'use-debounce'
import { Icons } from "../icon";
import { addSearchHistory } from "@/lib/prisma/search-history";
import { Button } from "../ui/button";

export default function Search({ search, tab }: { search: string | undefined, tab?: string }) {
     const router = useRouter()
     const initialRender = useRef(true)

     const [text, setText] = useState(search)
     useEffect(() => {
          setText(search)
     }, [search])

     const [query] = useDebounce(text, 750)

     useEffect(() => {
          if (initialRender.current) {
               initialRender.current = false
               return
          }

          if (!query) {
               router.push(`/explore${tab ? `/${tab}` : ''}`)
          } else if (query.length >= 3) {
               addSearchHistory(query)
               router.push(`/explore${tab ? `/${tab}` : ''}?search=${query}`)
          }
     }, [query])
     return (
          <>
               <div className="relative flex-[0_0_auto] h-[62px] max-w-[90%] min-w-[60%] w-full z-10">
                    <div className="bg-background h-full max-w-full w-full rounded-full shadow-lg justify-between items-center flex overflow-hidden p-3 relative">
                         <div className="flex justify-start content-center items-center flex-[0_0_auto] gap-3.5 h-[54px] p-0 overflow-hidden relative w-max z-10">
                              <div className="relative h-auto w-auto flex-[0_0_auto] z-10">
                                   <Button size={"icon"} variant={"secondary"} disabled className="p-[13px] h-auto w-auto rounded-full">
                                        <Icons.search className="h-5 w-5" />
                                        <span className="sr-only">Search</span>
                                   </Button>
                              </div>
                              <div className="flex outline-0 justify-start shrink-0 transform-none h-auto flex-[0_0_auto] relative w-full">
                                   <Input value={text} type="search" onChange={e => setText(e.target.value)} placeholder="Search for people or tags" className="input__field !foucs-visible:ring-0 !focus-visible:ring-offset-0 !focus-visible:outline-none" />
                              </div>
                         </div>
                         <div className="relative h-auto w-auto flex-[0_0_auto] md:block hidden">
                              <div className="contents">
                                   <Button className="py-2.5 px-5 h-auto w-auto rounded-full" onClick={
                                        async () => {
                                             if (query) {
                                                  router.push(`/explore?search=${query}`)
                                             }
                                        }

                                   }>
                                        Search
                                   </Button>
                              </div>
                         </div>
                    </div>
               </div>
          </>
     )
}