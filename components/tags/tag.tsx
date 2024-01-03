import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

export default function TagBadge({ children, className, ...props }: React.ComponentPropsWithoutRef<typeof Badge>) {
     return (
          <Badge className={cn("px-1.5 md:px-2.5", className)} variant={"default"} {...props}>
               {children}
          </Badge>
     )
}