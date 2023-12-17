'use client'
import { useState } from "react";
import { Button } from "./ui/button";
import ListCreateDialog from "./list-create-dialog";

export default function CreateListButton() {
     const [open, setOpen] = useState(false);

     return (
          <>
               <Button size={"lg"} onClick={() => setOpen(true)}>
                    Create List
               </Button>
               <ListCreateDialog open={open} onOpenChange={setOpen} />
          </>
     )
}