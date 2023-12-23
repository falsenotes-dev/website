"use client";
import { z } from "zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import React from "react";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { addPostToList, createList, updateList } from "@/lib/prisma/list";
import { toast } from "sonner";
import { validate } from "@/lib/revalidate";
import { usePathname } from "next/navigation";
import { List } from "@prisma/client";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import useWindowDimensions from "./window-dimensions";

const listFormSchema = z.object({
  name: z
    .string()
    .min(1, "List name is required")
    .max(60, "List name must be less than 60 characters"),
  description: z
    .string()
    .max(280, "Description must be less than 280 characters")
    .optional(),
  public: z.boolean().optional(),
});

type ListForm = z.infer<typeof listFormSchema>;

export default function ListEditDialog({
  list,
  ...props
}: React.ComponentPropsWithoutRef<typeof Dialog> & {
  list: List;
}) {
  const pathname = usePathname();
  const defaultValues: Partial<ListForm> = {
    name: list.name,
    description: list.description ? list.description : "",
    public: list.visibility === "public" ? true : false,
  };

  const form = useForm<ListForm>({
    resolver: zodResolver(listFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: ListForm) {
    const res = await updateList({ data: data, id: list.id });
    await validate(pathname);
    if (!res.success) {
      toast.error(res.message);
    }

    props.open = false;
  }

  const [addDescription, setAddDescription] = React.useState(list.description ? true : false);
  const { width } = useWindowDimensions();
  const [isDesktop, setIsDesktop] = React.useState(false);
  React.useEffect(() => {
    if (width) setIsDesktop(width > 768);
  }, [width]);

  if (isDesktop) {
    return (
      <>
        <Dialog {...props}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit list</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Give your list a name"
                          className="w-full"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {addDescription && (
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Give your list a description"
                            className="w-full"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
                {!addDescription && (
                  <Button
                    variant={"link"}
                    className="text-foreground"
                    onClick={() => setAddDescription(true)}
                  >
                    Add a Description
                  </Button>
                )}
                <FormField
                  control={form.control}
                  name="public"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Make it public so anyone can see it</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button type="submit" disabled={!form.formState.isValid}>
                      Update
                    </Button>
                  </DialogClose>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Drawer {...props}>
        <DrawerContent className="p-6 pt-0">
          <DrawerHeader>
            <DrawerTitle>Edit list</DrawerTitle>
          </DrawerHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Give your list a name"
                        className="w-full"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {addDescription && (
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Give your list a description"
                          className="w-full"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              {!addDescription && (
                <Button
                  variant={"link"}
                  className="text-foreground"
                  onClick={() => setAddDescription(true)}
                >
                  Add a Description
                </Button>
              )}
              <FormField
                control={form.control}
                name="public"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Make it public so anyone can see it</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="submit" disabled={!form.formState.isValid}>
                    Update
                  </Button>
                </DialogClose>
              </div>
            </form>
          </Form>
        </DrawerContent>
      </Drawer>
    </>
  )
}
