"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import '@/app/style.css'
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  ArrowUp,
  Check,
  Eye,
  Hash,
  Pencil,
  RefreshCcw,
  Save,
  Trash,
  Trash2,
} from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TextareaAutosize from "react-textarea-autosize";
import { Icons } from "../icon";
import { useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { ToastAction } from "../ui/toast";
import { toast } from "sonner";
import { dateFormat } from "@/lib/format-date";
import TagBadge from "../tags/tag";
import { Cross2Icon } from "@radix-ui/react-icons";
import PostDeleteDialog from "../blog/post-delete-dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "use-debounce";
import MarkdownCard from "../markdown-card";
import { validate } from "@/lib/revalidate";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import readingTime from "reading-time";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Editor } from "novel";
import { AutoOptions, createLowlight, all } from "lowlight";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import useWindowDimensions from "../window-dimensions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";

const lowlight = createLowlight(all);

async function fetchSuggestions(query: string) {
  const tagResponse = await fetch(
    `/api/tags/search?search=${encodeURIComponent(query)}&limit=5`
  );

  if (!tagResponse.ok) {
    throw new Error(`Tag API request failed: ${tagResponse.status}`);
  }
  const { tags } = await tagResponse.json();

  return tags;
}

const postFormSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters long.",
    })
    .max(100, {
      message: "Username must not be longer than 100 characters.",
    }),
  content: z.string(),
  coverImage: z.string().optional(),
  tags: z
    .array(
      z.object({
        value: z.string(),
      })
    )
    .max(5, {
      message: "You can select up to 5 tags.",
    })
    .optional(),
  url: z.string(),
  subtitle: z.string().optional(),
  published: z.boolean().optional(),
  commentsOn: z.boolean().optional().default(true),
  likesOn: z.boolean().optional().default(true),
  pinned: z.boolean().optional().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().max(156, {
    message: "Description must not be longer than 156 characters.",
  }).optional(),
  canonicalUrl: z.string().optional(),
  //og version of the post old, 1-6 select options
  ogVersion: z.string().optional(),
});

type PostFormValues = z.infer<typeof postFormSchema>;

export function PostEditorForm(props: { post: any; user: any }) {
  const [previousStatus, setPreviousStatus] = useState<boolean>(
    props.post?.published
  );
  const router = useRouter();

  // This can come from your database or API.
  const defaultValues: Partial<PostFormValues> = {
    id: props.post.id,
    title: props.post.title,
    content: props.post.content,
    coverImage: props.post.cover || "",
    url: props.post.url || "",
    subtitle: props.post.subtitle,
    published: props.post.published,
    tags: props.post.tags.map((tag: any) => ({
      value: tag.tag.name,
    })),
    commentsOn:
      props.post.allowComments == null ? true : props.post.allowComments,
    likesOn: props.post.allowLikes == null ? true : props.post.allowLikes,
    pinned: props.post.pinned == null ? false : props.post.pinned,
    seoTitle: props.post.seoTitle ? props.post.seoTitle : props.post.title,
    seoDescription: props.post.seoDescription ? props.post.seoDescription : props.post.subtitle?.slice(0, 150) + "...",
    canonicalUrl: props.post.canonicalUrl || "",
    ogVersion: props.post.ogVersion || "old",
  };

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "tags",
    control: form.control,
  });

  const [open, setOpen] = useState<boolean>(false);
  const [commandOpen, setCommandOpen] = useState<boolean>(false);
  const [newTag, setNewTag] = useState<string | undefined>(undefined);
  const [query] = useDebounce(newTag, 1000);
  const [suggestions, setSuggestions] = useState<any>([]);

  useEffect(() => {
    if (newTag !== undefined && newTag !== "") {
      fetchSuggestions(newTag).then((result) => setSuggestions(result));
      setCommandOpen(true);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  async function onSubmit(data: PostFormValues) {
    try {
      if (lastSavedTime > Date.now() - 15000) {
        await saveDraft();
      }
      setIsPublishing(true);

      form.setValue("published", true);

      const result = await fetch(`/api/post/${props.post?.id}`, {
        method: "PATCH",
        body: JSON.stringify({ ...data }),
      });

      if (!result.ok) {
        throw new Error("Failed to update post");
      }

      await validate(`/@${props.user?.username}`);
      if (data.published == true && previousStatus == false) {
        router.push(
          `/@${props.user?.username}/${form.getValues("url")}?published=true`
        );
        toast.info("Post Published!");
      } else {
        router.push(`/@${props.user?.username}/`);
        toast.info("Post Updated!");
      }
    } catch (error) {
      console.error(error);
      setIsPublishing(false);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setOpen(false);
    }
  }
  const [isValidUrl, setIsValidUrl] = useState<boolean>(true);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [cover, setCover] = useState<string>(props.post?.cover || "");
  const [file, setFile] = useState<File>(); // State for the uploaded file

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  async function uploadCover(cover?: File) {
    if (cover) {
      try {
        const dataForm = new FormData();
        dataForm.set("file", cover ? cover : file || "");
        // Construct the request body with postId and authorId
        const requestBody = {
          postId: form.getValues("id"),
          userId: props.user?.id,
        };

        dataForm.set("body", JSON.stringify(requestBody));

        const res = await fetch(
          `/api/upload/cover?postId=${form.getValues("id")}&authorId=${props.user?.username
          }`,
          {
            method: "POST",
            body: dataForm,
          }
        );

        if (!res.ok) {
          toast.error("Something went wrong.", {
            description: "Your cover image could not be uploaded.",
            action: {
              label: "Try again",
              onClick: async () => {
                //resubmit
                await uploadCover(cover);
              },
            },
          });
        }
        // get the image url
        const { data: coverUrl } = await res.json();
        return coverUrl.url;
      } catch (e: any) {
        // Handle errors here
        console.error(e);
        return null;
      }
    }
  }

  const saveDraft = async () => {
    if (form.getValues("content") && form.getValues("title")) {
      setIsSaving(true);
      try {
        // Submit the form
        const result = await fetch(`/api/post/${props.post?.id}/drafts`, {
          method: "PATCH",
          body: JSON.stringify({ ...form.getValues() }),
        });
        if (result.status !== 200) {
          toast.error("Something went wrong. Please try again later.", {
            description: "Your draft could not be saved.",
            action: {
              label: "Try again",
              onClick: async () => {
                //resubmit
                await saveDraft();
              },
            },
          });
          setIsSaving(false);
        }
        setLastSavedTime(Date.now());
        setIsSaved(true);
        //wait 5 seconds and set isSaved to false
        setTimeout(() => {
          setIsSaved(false);
        }, 8000);
        toast.info("Draft Saved!");
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong.", {
          description: "Your draft could not be saved.",
          action: {
            label: "Try again",
            onClick: async () => {
              //resubmit
              await saveDraft();
            },
          },
        });
        setIsSaving(false);
      }
      if (!form.getValues("published") && previousStatus == false) {
        const result = await fetch(`/api/post/${props.post?.id}`, {
          method: "PATCH",
          body: JSON.stringify({ ...form.getValues() }),
        });

        if (!result.ok) {
          toast.error("Something went wrong.", {
            description: "Your draft could not be saved.",
            action: {
              label: "Try again",
              onClick: async () => {
                //resubmit
                await saveDraft();
              },
            },
          });
          setIsSaving(false);
        }
      }
      setIsSaving(false);
    }
    setIsSaving(false);
  };

  // when value changes, wait 750ms than save it as a draft
  const [lastSavedTime, setLastSavedTime] = useState<number>(Date.now());
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false);
  useEffect(() => {
    const timeout = setTimeout(saveDraft, 15000);
    return () => clearTimeout(timeout);
  }, [form.getValues, file, props.user, props.post]);

  useEffect(() => {
    const newCoverImage = form.getValues("coverImage") as string;

    if (newCoverImage && newCoverImage !== cover) {
      setCover(newCoverImage);
    }

    if (file) {
      const newCoverUrl = URL.createObjectURL(file);

      if (newCoverUrl !== cover) {
        setCover(newCoverUrl);
      }
    }
  }, [file, form]);

  async function validateUrl(value: string) {
    try {
      const result = await fetch(
        `/api/posts/validate-url?url=${value}&authorId=${props.user?.id}&postId=${form.getValues("id")}`,
        {
          method: "GET",
        }
      ).then((res) => res.json());

      (result.status !== 500 || result.status !== 400) && result.isValid
        ? setIsValidUrl(true)
        : setIsValidUrl(false);
    } catch (error) {
      console.error(error);
      // Consider showing an error message to the user here
    }
    return isValidUrl;
  }

  // URL-friendly link validation
  async function handleUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    form.setValue("url", value);
    // if value has spaces, set isValidUrl to false, else set it to true and check if the url is valid or not
    if (value.includes(" ")) {
      setIsValidUrl(false);
    } else {
      await validateUrl(value);
    }
  }

  function markdownToText(markdown: string) {
    return markdown
      .replace(/!\[(.*?)\]\((.*?)\)/g, "$1") // remove image markdown
      .replace(/\[(.*?)\]\((.*?)\)/g, "$1") // remove link markdown
      .replace(/<\/?[^>]+(>|$)/g, "") // remove HTML tags
      .replace(/#+\s?/g, ""); // remove markdown headers
  }
  //Set url value from title value
  async function handleTitleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    form.setValue("title", value);
    // Replace spaces with dashes and make lowercase, if the title has more than 2 words, less than 100 characters and don't have any special characters if it has any special characters remove them, if less than 2 words, change the url to random string
    //if title has less than 2 words, change the url to random string
    if (value.length < 100) {
      if (value.split(" ").length < 2) {
        const url =
          value
            .replace(/[^a-zA-Z0-9 ]/g, "")
            .replace(/\s+/g, "-")
            .toLowerCase()
            .split(" ")
            .slice(0, 2)
            .join("-") + Math.random().toString(36).substring(2, 15);
        if (await validateUrl(url)) form.setValue("url", url);
      } else {
        // Replace spaces with dashes and make lowercase of 2 words only and remove special characters
        const url = value
          .replace(/[^a-zA-Z0-9 ]/g, "")
          .replace(/\s+/g, "-")
          .toLowerCase()
          .split(" ")
          .slice(0, 2)
          .join("-");
        if (await validateUrl(url)) form.setValue("url", url);
      }
    }
  }

  function handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    // Split the markdown content by sections
    const sections = form.getValues("content").split("\n\n");

    // Convert only the first section to text
    const firstSection = sections[0];
    const description = markdownToText(firstSection);
    // If first section is empty or has less than 100 characters, use the 1st and 2nd section
    if (firstSection.length < 100) {
      const secondSection = sections[1]
        ? sections[0] + " " + sections[1]
        : sections[0];
      const description = markdownToText(secondSection);
      value !== "" || value === null
        ? form.setValue("subtitle", value)
        : form.setValue("subtitle", description);
      return;
    }
    value !== "" || value === null
      ? form.setValue("subtitle", value)
      : form.setValue("subtitle", markdownToText(description));
  }

  const [socialPreview, setSocialPreview] = useState<string>(
    `https://fn.thebkht.com/api/posts/thumbnail${form.getValues("ogVersion") !== "old" ? `/v${form.getValues("ogVersion")}` : ""
    }?title=${form.getValues(
      "title"
    )}&subtitle=${form.getValues("subtitle")}&cover=${form.getValues(
      "coverImage"
    )}&readingTime=${readingTime(form.getValues("content")).text}&authorid=${props.user?.username
    }`
  );

  useEffect(() => {
    setSocialPreview(
      `https://fn.thebkht.com/api/posts/thumbnail${form.getValues("ogVersion") !== "old" ? `/v${form.getValues("ogVersion")}` : ""
      }?title=${form.getValues(
        "title"
      )}&subtitle=${form.getValues("subtitle")}&cover=${form.getValues(
        "coverImage"
      )}&readingTime=${readingTime(form.getValues("content")).text}&authorid=${props.user?.username
      }`
    );
    console.log(new URL(socialPreview))
  }, [form, props.user?.username]);

  const [firstImage, setFirstImage] = useState<string>("");

  const { width } = useWindowDimensions();
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  useEffect(() => {
    if (width) setIsDesktop(width > 768);
  }, [width]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full lg:w-[800px]"
          id="PostForm"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextareaAutosize
                    placeholder="Title of the post"
                    className="w-full px-0 md:px-6 lg:px-12 resize-none appearance-none overflow-hidden bg-transparent text-3xl md:text-4xl md:leading-snug font-bold focus:outline-none"
                    {...field}
                    onChange={handleTitleChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Editor
                    className="min-h-[250px]"
                    extensions={
                      [
                        CodeBlockLowlight.configure({
                          lowlight,
                          languageClassPrefix: "language-",
                          defaultLanguage: "text",
                        }),
                      ]
                    }
                    editorProps={{
                      attributes: { class: "novel-prose-lg novel-prose-stone dark:novel-prose-invert prose-headings:novel-font-title novel-font-default focus:novel-outline-none novel-max-w-full !px-0 md:!px-6 lg:!px-12 !p-8" },
                    }}
                    defaultValue={field.value}
                    onUpdate={(editor) => {
                      setFirstImage((editor?.view.root as Document)?.images[0]?.src !== props.user?.image ? (editor?.view.root as Document)?.images[0]?.src : "");
                      if (form.getValues('coverImage') == '') {
                        form.setValue('coverImage', firstImage);
                        setCover(firstImage);
                      }
                      form.setValue("content", editor?.storage.markdown.getMarkdown());
                    }}
                    disableLocalStorage={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isDesktop ? (
            <Dialog onOpenChange={setOpen} open={open}>
              <DialogContent className="h-full max-h-[70%] md:max-h-[625px] !p-0">
                <ScrollArea className="h-full w-full px-6">
                  <DialogHeader className="py-6">
                    <DialogTitle className="font-bold">
                      Post Settings for publishing
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pb-4 m-1">
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL-friendly Link</FormLabel>
                          <FormDescription>
                            {`fm.thebkht.com/@${props.user?.username}/`}
                          </FormDescription>
                          <FormControl>
                            <div className="flex justify-end flex-col">
                              <div className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 items-center ${isValidUrl !== null && !isValidUrl && "text-destructive !border-destructive"}`}>
                                <Input
                                  className="border-none p-0 focus-visible:ring-offset-0 focus-visible:ring-0 bg-transparent"
                                  placeholder="URL"
                                  {...field}
                                  onChange={handleUrlChange}
                                />
                                {isValidUrl !== null && !isValidUrl && (
                                  <Icons.xCircle className="text-destructive h-5 w-5" />
                                )}
                              </div>
                              {(!form.getValues("url") ||
                                form.getValues("url") == "") && (
                                  <Button
                                    variant="ghost"
                                    className="mt-1 ml-auto"
                                    onClick={() => {
                                      const url = Math.random()
                                        .toString(36)
                                        .substring(2, 15);
                                      form.setValue("url", url);
                                      setIsValidUrl(true);
                                    }}
                                  >
                                    Make Default
                                  </Button>
                                )}
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="coverImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>FalseNotes Preview</FormLabel>
                          <FormDescription>
                            Manage the image and short description for the post.
                          </FormDescription>
                          <FormControl>
                            <>
                              <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center relative justify-center w-full border aspect-video border-dashed rounded-md cursor-pointer bg-popover/50">
                                  {cover ? (
                                    <AspectRatio
                                      ratio={16 / 9}
                                      className="bg-muted rounded-md"
                                    >
                                      <div
                                        className="object-cover rounded-md w-full h-full bg-cover bg-center"
                                        style={{
                                          backgroundImage: `url(${file
                                            ? (URL.createObjectURL(
                                              file
                                            ) as string)
                                            : (field.value as string)
                                            })`,
                                        }}
                                      />
                                    </AspectRatio>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                      <Icons.upload className="w-9 h-9 mb-4" />
                                      <p className="mb-2 text-sm text-secondary-foreground font-medium">
                                        Click to upload
                                      </p>
                                      <p className="text-xs text-secondary-foreground">
                                        PNG, JPG, GIF (MAX. 2MB)
                                      </p>
                                    </div>
                                  )}
                                  <Input
                                    id="dropzone-file"
                                    type="file"
                                    accept="image/jpeg, image/png, image/gif"
                                    onChange={async (e) => {
                                      const cover = e.target.files?.[0];
                                      if (cover) {
                                        if (cover.size > 2 * 1024 * 1024) {
                                          toast.warning(
                                            "File size must be less than 2MB."
                                          );
                                        } else if (
                                          ![
                                            "image/png",
                                            "image/jpeg",
                                            "image/gif",
                                          ].includes(cover.type)
                                        ) {
                                          toast.warning(
                                            "File type must be PNG, JPG, or GIF."
                                          );
                                        } else {
                                          setFile(cover);
                                          const url = await uploadCover(cover);
                                          form.setValue("coverImage", url);
                                        }
                                      }
                                    }}
                                    className="hidden"
                                  />
                                  <div className="flex items-center justify-center absolute top-2 right-2 z-50 gap-1">
                                    <Button
                                      variant="secondary"
                                      size={"icon"}
                                      className="bg-secondary/60 backdrop-blur-md hover:bg-secondary"
                                      onClick={() => {
                                        form.setValue("coverImage", firstImage !== props.user?.image ? firstImage : "");
                                        setCover(firstImage !== props.user?.image ? firstImage : "");
                                        setFirstImage(firstImage !== props.user?.image ? firstImage : "")
                                      }}
                                    >
                                      <RefreshCcw className="h-4 w-4" />
                                      <span className="sr-only">Refresh</span>
                                    </Button>
                                    <Button
                                      variant="secondary"
                                      size={"icon"}
                                      className="bg-secondary/60 backdrop-blur-md hover:bg-secondary"
                                      onClick={async () => {
                                        const coverUrl = await uploadCover(
                                          file
                                        );
                                        if (coverUrl) {
                                          form.setValue("coverImage", coverUrl);
                                        }
                                      }}
                                      disabled={!file && form.getValues('coverImage') == ''}
                                    >
                                      <Icons.upload className="h-4 w-4" />
                                      <span className="sr-only">Upload</span>
                                    </Button>
                                    <Button
                                      variant="secondary"
                                      size={"icon"}
                                      className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hover:bg-secondary"
                                      onClick={() => {
                                        form.setValue("coverImage", "");
                                        setCover("");
                                        setFile(undefined);
                                      }}
                                      disabled={!file && form.getValues('coverImage') == ''}
                                    >
                                      <Icons.delete className="h-4 w-4" />
                                      <span className="sr-only">Remove</span>
                                    </Button>
                                  </div>
                                </label>
                              </div>
                            </>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subtitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <TextareaAutosize
                              {...field}
                              className="flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full min-h-[40px]"
                              rows={1}
                              onChange={handleDescriptionChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ogVersion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Social media preview <Badge className="text-[10px] px-2 py-1" >New</Badge></FormLabel>
                          <FormDescription>
                            An image of superior quality enhances the
                            attractiveness of your post for readers, especially on
                            social networks.
                          </FormDescription>
                          <Select onValueChange={(e) => {
                            setSocialPreview(
                              `https://fn.thebkht.com/api/posts/thumbnail${e !== "old" ? `/v${e}` : ""
                              }?title=${form.getValues(
                                "title"
                              )}&subtitle=${form.getValues(
                                "subtitle"
                              )}&cover=${form.getValues(
                                "coverImage"
                              )}&readingTime=${readingTime(form.getValues("content")).text}&authorid=${props.user?.username
                              }`
                            );
                            form.setValue("ogVersion", e);
                            field.onChange;
                          }} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="old">Old</SelectItem>
                              <SelectItem value="1">Version 1</SelectItem>
                              <SelectItem value="2">Version 2</SelectItem>
                              <SelectItem value="3">Version 3</SelectItem>
                              <SelectItem value="4">Version 4</SelectItem>
                              <SelectItem value="5">Version 5</SelectItem>
                              <SelectItem value="6">Version 6</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="coverImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <>
                              <AspectRatio
                                ratio={1200 / 630}
                                className="bg-muted rounded-md relative"
                              >
                                <div
                                        className="object-cover rounded-md w-full h-full bg-cover bg-center"
                                        style={{
                                          backgroundImage: `url('${new URL(socialPreview)}')`,
                                        }}
                                      />
                                <Button
                                  variant="secondary"
                                  size={"icon"}
                                  className="absolute top-2 right-2 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hover:bg-secondary"
                                  onClick={() => {
                                    setSocialPreview(
                                      `https://fn.thebkht.com/api/posts/thumbnail${form.getValues("ogVersion") !== "old" ? `/v${form.getValues("ogVersion")}` : ""
                                      }?title=${form.getValues(
                                        "title"
                                      )}&subtitle=${form.getValues(
                                        "subtitle"
                                      )}&cover=${form.getValues(
                                        "coverImage"
                                      )}&readingTime=${readingTime(form.getValues("content"))
                                        .text
                                      }&authorid=${props.user?.username}`
                                    );
                                  }}
                                >
                                  <RefreshCcw className="h-4 w-4" />
                                  <span className="sr-only">Refresh</span>
                                </Button>
                              </AspectRatio>
                            </>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="seoTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SEO Settings <Badge className="text-[10px] px-2 py-1" >New</Badge></FormLabel>
                          <FormDescription>
                            Optimize your post for search engines. The title and description will be displayed in search results.
                          </FormDescription>
                          <FormControl>
                            <Input
                              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                              onChange={(e) => {
                                // if seoTitle is empty, set it to title
                                if (e.target.value == "" || e.target.value == null) {
                                  form.setValue("seoTitle", form.getValues("title"));
                                } else {
                                  form.setValue("seoTitle", e.target.value);
                                }
                              }}
                              placeholder="SEO Title"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="seoDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <TextareaAutosize
                              {...field}
                              className="flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full min-h-[40px]"
                              rows={1}
                              placeholder="SEO Description"
                              onChange={(e) => {
                                // if seoDescription is empty, set it to subtitle
                                if (e.target.value == "" || e.target.value == null) {
                                  form.setValue("seoDescription", form.getValues("subtitle")?.slice(0, 150) + "..."); // limit to 156 characters
                                } else {
                                  form.setValue("seoDescription", e.target.value);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="canonicalUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Canonical URL <Badge className="text-[10px] px-2 py-1" >New</Badge></FormLabel>
                          <FormDescription>
                            If you have a similar post on another website, you
                            can add the URL here to avoid duplicate content
                            issues. This will tell search engines that the post on your website is the original.
                          </FormDescription>
                          <FormControl>
                            <Input
                              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                              placeholder="Canonical URL"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>
                          <FormDescription>
                            Add tags (up to 5) to help readers find your post
                            easier.
                          </FormDescription>
                          <div className="flex-wrap">
                            {fields.map((field, index) => (
                              <TagBadge
                                key={field.id}
                                className="pr-1.5 text-sm font-medium my-1.5 mr-1.5"
                              >
                                {field.value}
                                <Button
                                  variant={"ghost"}
                                  onClick={() => remove(index)}
                                  className="h-fit w-fit !p-0 ml-2.5 hover:bg-transparent"
                                >
                                  <Cross2Icon className="h-3 w-3" />
                                </Button>
                              </TagBadge>
                            ))}
                          </div>
                          {fields.length < 5 && (
                            <FormControl>
                              <>
                                <Popover
                                  open={commandOpen}
                                  onOpenChange={setCommandOpen}
                                >
                                  <PopoverTrigger className="w-full">
                                    <Input
                                      value={newTag}
                                      onChange={(e) => setNewTag(e.target.value)}
                                    />
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-full p-0"
                                    align="start"
                                  >
                                    {suggestions.length > 0 && (
                                      <Command className="w-full">
                                        <CommandGroup>
                                          {suggestions?.map((tag: any) => (
                                            <CommandItem
                                              key={tag.id}
                                              value={tag.name}
                                            >
                                              <Button
                                                variant="ghost"
                                                className="h-fit w-fit !p-0"
                                                onClick={() => {
                                                  append({ value: tag.name });
                                                  setNewTag("");
                                                  setCommandOpen(false);
                                                }}
                                              >
                                                <Hash className="mr-2 h-4 w-4" />
                                                <span>
                                                  {tag.name.replace(/-/g, " ")}
                                                </span>
                                              </Button>
                                            </CommandItem>
                                          ))}
                                        </CommandGroup>
                                      </Command>
                                    )}
                                  </PopoverContent>
                                </Popover>
                              </>
                            </FormControl>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {fields.length < 5 && (
                      <Button
                        variant="outline"
                        className="mt-2"
                        onClick={() => {
                          if (newTag?.trim() !== "" && newTag !== undefined) {
                            append({ value: newTag.toLowerCase() });
                            setNewTag("");
                          }
                        }}
                      >
                        Add Tag
                      </Button>
                    )}
                    <FormField
                      control={form.control}
                      name="pinned"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pin post</FormLabel>
                          <FormDescription>
                            Pin this post to the top of your profile. This will
                            override any other pinned posts.
                          </FormDescription>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="pinned"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="data-[state=checked]:bg-foreground"
                              />
                              <Label htmlFor="pinned">Pin this post</Label>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-col gap-2.5">
                      <FormField
                        control={form.control}
                        name="commentsOn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Community</FormLabel>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="comments-on"
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-foreground"
                                />
                                <Label htmlFor="comments-on">
                                  Allow Comments
                                </Label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="likesOn"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="likes-on"
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-foreground"
                                />
                                <Label htmlFor="likes-on">Allow Reactions</Label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </ScrollArea>
                <DialogFooter className="p-6 border-t">
                  <Button
                    type="submit"
                    variant={'default'}
                    className="ml-auto w-full !bg-primary hover:!bg-primary/90"
                    size={"lg"}
                    form="PostForm"
                    disabled={
                      isPublishing || isValidUrl === null ? false : !isValidUrl
                    }
                    onClick={() => {
                      form.setValue("published", true);
                    }}
                  >
                    {isPublishing ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />{" "}
                        {previousStatus ? "Updating" : "Publishing"}
                      </>
                    ) : (
                      <>{previousStatus ? "Update" : "Publish"}</>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <Drawer
              open={open}
              onOpenChange={setOpen}
            >
              <DrawerContent className="max-h-[calc(100vh-3rem)] pt-0">
                <ScrollArea className="h-full px-6 overflow-auto">
                  <DrawerHeader className="py-6">
                    <DrawerTitle className="font-bold text-center">
                      Post Settings for publishing
                    </DrawerTitle>
                  </DrawerHeader>
                  <div className="space-y-4 pb-4 m-1">
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL-friendly Link</FormLabel>
                          <FormDescription>
                            {`fn.thebkht.com/@${props.user?.username}/`}
                          </FormDescription>
                          <FormControl>
                            <div className="flex justify-end flex-col">
                              <div className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 items-center ${isValidUrl !== null && !isValidUrl && "text-destructive !border-destructive"}`}>
                                <Input
                                  className="border-none p-0 focus-visible:ring-offset-0 focus-visible:ring-0 bg-transparent"
                                  placeholder="URL"
                                  {...field}
                                  onChange={handleUrlChange}
                                />
                                {isValidUrl !== null && !isValidUrl && (
                                  <Icons.xCircle className="text-destructive h-5 w-5" />
                                )}
                              </div>
                              {(!form.getValues("url") ||
                                form.getValues("url") == "") && (
                                  <Button
                                    variant="ghost"
                                    className="mt-1 ml-auto"
                                    onClick={() => {
                                      const url = Math.random()
                                        .toString(36)
                                        .substring(2, 15);
                                      form.setValue("url", url);
                                      setIsValidUrl(true);
                                    }}
                                  >
                                    Make Default
                                  </Button>
                                )}
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="coverImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>FalseNotes Preview</FormLabel>
                          <FormDescription>
                            Manage the image and short description for the post.
                          </FormDescription>
                          <FormControl>
                            <>
                              <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center relative justify-center w-full border aspect-video border-dashed rounded-md cursor-pointer bg-popover/50">
                                  {cover ? (
                                    <AspectRatio
                                      ratio={16 / 9}
                                      className="bg-muted rounded-md"
                                    >
                                      <div
                                        className="object-cover rounded-md w-full h-full bg-cover bg-center"
                                        style={{
                                          backgroundImage: `url(${file
                                            ? (URL.createObjectURL(
                                              file
                                            ) as string)
                                            : (field.value as string)
                                            })`,
                                        }}
                                      />
                                    </AspectRatio>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                      <Icons.upload className="w-9 h-9 mb-4" />
                                      <p className="mb-2 text-sm text-secondary-foreground font-medium">
                                        Click to upload
                                      </p>
                                      <p className="text-xs text-secondary-foreground">
                                        PNG, JPG, GIF (MAX. 2MB)
                                      </p>
                                    </div>
                                  )}
                                  <Input
                                    id="dropzone-file"
                                    type="file"
                                    accept="image/jpeg, image/png, image/gif"
                                    onChange={async (e) => {
                                      const cover = e.target.files?.[0];
                                      if (cover) {
                                        if (cover.size > 2 * 1024 * 1024) {
                                          toast.warning(
                                            "File size must be less than 2MB."
                                          );
                                        } else if (
                                          ![
                                            "image/png",
                                            "image/jpeg",
                                            "image/gif",
                                          ].includes(cover.type)
                                        ) {
                                          toast.warning(
                                            "File type must be PNG, JPG, or GIF."
                                          );
                                        } else {
                                          setFile(cover);
                                          const url = await uploadCover(cover);
                                          form.setValue("coverImage", url);
                                        }
                                      }
                                    }}
                                    className="hidden"
                                  />
                                  <div className="flex items-center justify-center absolute top-2 right-2 z-50 gap-1">
                                    <Button
                                      variant="secondary"
                                      size={"icon"}
                                      className="bg-secondary/60 backdrop-blur-md hover:bg-secondary"
                                      onClick={() => {
                                        form.setValue("coverImage", firstImage !== props.user?.image ? firstImage : "");
                                        setCover(firstImage !== props.user?.image ? firstImage : "");
                                        setFirstImage(firstImage !== props.user?.image ? firstImage : "")
                                      }}
                                    >
                                      <RefreshCcw className="h-4 w-4" />
                                      <span className="sr-only">Refresh</span>
                                    </Button>
                                    <Button
                                      variant="secondary"
                                      size={"icon"}
                                      className="bg-secondary/60 backdrop-blur-md hover:bg-secondary"
                                      onClick={async () => {
                                        const coverUrl = await uploadCover(
                                          file
                                        );
                                        if (coverUrl) {
                                          form.setValue("coverImage", coverUrl);
                                        }
                                      }}
                                      disabled={!file && form.getValues('coverImage') == ''}
                                    >
                                      <Icons.upload className="h-4 w-4" />
                                      <span className="sr-only">Upload</span>
                                    </Button>
                                    <Button
                                      variant="secondary"
                                      size={"icon"}
                                      className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hover:bg-secondary"
                                      onClick={() => {
                                        form.setValue("coverImage", "");
                                        setCover("");
                                        setFile(undefined);
                                      }}
                                      disabled={!file && form.getValues('coverImage') == ''}
                                    >
                                      <Icons.delete className="h-4 w-4" />
                                      <span className="sr-only">Remove</span>
                                    </Button>
                                  </div>
                                </label>
                              </div>
                            </>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subtitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <TextareaAutosize
                              {...field}
                              className="flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full min-h-[40px]"
                              rows={1}
                              onChange={handleDescriptionChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ogVersion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Social media preview <Badge className="text-[10px] px-2 py-1" >New</Badge></FormLabel>
                          <FormDescription>
                            An image of superior quality enhances the
                            attractiveness of your post for readers, especially on
                            social networks.
                          </FormDescription>
                          <Select onValueChange={(e) => {
                            setSocialPreview(
                              `https://fn.thebkht.com/api/posts/thumbnail${e !== "old" ? `/v${e}` : ""
                              }?title=${form.getValues(
                                "title"
                              )}&subtitle=${form.getValues(
                                "subtitle"
                              )}&cover=${form.getValues(
                                "coverImage"
                              )}&readingTime=${readingTime(form.getValues("content")).text}&authorid=${props.user?.username
                              }`
                            );
                            form.setValue("ogVersion", e);
                            field.onChange;
                          }} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="old">Old</SelectItem>
                              <SelectItem value="1">Version 1</SelectItem>
                              <SelectItem value="2">Version 2</SelectItem>
                              <SelectItem value="3">Version 3</SelectItem>
                              <SelectItem value="4">Version 4</SelectItem>
                              <SelectItem value="5">Version 5</SelectItem>
                              <SelectItem value="6">Version 6</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="coverImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <>
                              <AspectRatio
                                ratio={1200 / 630}
                                className="bg-muted rounded-md relative"
                              >
                                <Image
                                  src={socialPreview}
                                  className="rounded-md"
                                  alt="Thumbnail"
                                  height={630}
                                  width={1200}
                                  objectFit="cover"
                                />
                                <Button
                                  variant="secondary"
                                  size={"icon"}
                                  className="absolute top-2 right-2 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hover:bg-secondary"
                                  onClick={() => {
                                    setSocialPreview(
                                      `https://fn.thebkht.com/api/posts/thumbnail${form.getValues("ogVersion") !== "old" ? `/v${form.getValues("ogVersion")}` : ""
                                      }?title=${form.getValues(
                                        "title"
                                      )}&subtitle=${form.getValues(
                                        "subtitle"
                                      )}&cover=${form.getValues(
                                        "coverImage"
                                      )}&readingTime=${readingTime(form.getValues("content"))
                                        .text
                                      }&authorid=${props.user?.username}`
                                    );
                                  }}
                                >
                                  <RefreshCcw className="h-4 w-4" />
                                  <span className="sr-only">Refresh</span>
                                </Button>
                              </AspectRatio>
                            </>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="seoTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SEO Settings <Badge className="text-[10px] px-2 py-1" >New</Badge></FormLabel>
                          <FormDescription>
                            Optimize your post for search engines. The title and description will be displayed in search results.
                          </FormDescription>
                          <FormControl>
                            <Input
                              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                              onChange={(e) => {
                                // if seoTitle is empty, set it to title
                                if (e.target.value == "" || e.target.value == null) {
                                  form.setValue("seoTitle", form.getValues("title"));
                                } else {
                                  form.setValue("seoTitle", e.target.value);
                                }
                              }}
                              placeholder="SEO Title"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="seoDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <TextareaAutosize
                              {...field}
                              className="flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full min-h-[40px]"
                              rows={1}
                              placeholder="SEO Description"
                              onChange={(e) => {
                                // if seoDescription is empty, set it to subtitle
                                if (e.target.value == "" || e.target.value == null) {
                                  form.setValue("seoDescription", form.getValues("subtitle")?.slice(0, 150) + "..."); // limit to 156 characters
                                } else {
                                  form.setValue("seoDescription", e.target.value);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="canonicalUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Canonical URL <Badge className="text-[10px] px-2 py-1" >New</Badge></FormLabel>
                          <FormDescription>
                            If you have a similar post on another website, you
                            can add the URL here to avoid duplicate content
                            issues. This will tell search engines that the post on your website is the original.
                          </FormDescription>
                          <FormControl>
                            <Input
                              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                              placeholder="Canonical URL"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>
                          <FormDescription>
                            Add tags (up to 5) to help readers find your post
                            easier.
                          </FormDescription>
                          <div className="flex-wrap">
                            {fields.map((field, index) => (
                              <TagBadge
                                key={field.id}
                                className="pr-1.5 text-sm font-medium my-1.5 mr-1.5"
                              >
                                {field.value}
                                <Button
                                  variant={"ghost"}
                                  onClick={() => remove(index)}
                                  className="h-fit w-fit !p-0 ml-2.5 hover:bg-transparent"
                                >
                                  <Cross2Icon className="h-3 w-3" />
                                </Button>
                              </TagBadge>
                            ))}
                          </div>
                          {fields.length < 5 && (
                            <FormControl>
                              <>
                                <Popover
                                  open={commandOpen}
                                  onOpenChange={setCommandOpen}
                                >
                                  <PopoverTrigger className="w-full">
                                    <Input
                                      value={newTag}
                                      onChange={(e) => setNewTag(e.target.value)}
                                    />
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-full p-0"
                                    align="start"
                                  >
                                    {suggestions.length > 0 && (
                                      <Command className="w-full">
                                        <CommandGroup>
                                          {suggestions?.map((tag: any) => (
                                            <CommandItem
                                              key={tag.id}
                                              value={tag.name}
                                            >
                                              <Button
                                                variant="ghost"
                                                className="h-fit w-fit !p-0"
                                                onClick={() => {
                                                  append({ value: tag.name });
                                                  setNewTag("");
                                                  setCommandOpen(false);
                                                }}
                                              >
                                                <Hash className="mr-2 h-4 w-4" />
                                                <span>
                                                  {tag.name.replace(/-/g, " ")}
                                                </span>
                                              </Button>
                                            </CommandItem>
                                          ))}
                                        </CommandGroup>
                                      </Command>
                                    )}
                                  </PopoverContent>
                                </Popover>
                              </>
                            </FormControl>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {fields.length < 5 && (
                      <Button
                        variant="outline"
                        className="mt-2"
                        onClick={() => {
                          if (newTag?.trim() !== "" && newTag !== undefined) {
                            append({ value: newTag.toLowerCase() });
                            setNewTag("");
                          }
                        }}
                      >
                        Add Tag
                      </Button>
                    )}
                    <FormField
                      control={form.control}
                      name="pinned"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pin post</FormLabel>
                          <FormDescription>
                            Pin this post to the top of your profile. This will
                            override any other pinned posts.
                          </FormDescription>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="pinned"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="data-[state=checked]:bg-foreground"
                              />
                              <Label htmlFor="pinned">Pin this post</Label>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-col gap-2.5">
                      <FormField
                        control={form.control}
                        name="commentsOn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Community</FormLabel>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="comments-on"
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-foreground"
                                />
                                <Label htmlFor="comments-on">
                                  Allow Comments
                                </Label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="likesOn"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="likes-on"
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-foreground"
                                />
                                <Label htmlFor="likes-on">Allow Reactions</Label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </ScrollArea>
                <DrawerFooter className="border-t">
                  <Button
                    type="submit"
                    variant={'default'}
                    className="ml-auto w-full !bg-primary hover:!bg-primary/90"
                    size={"lg"}
                    form="PostForm"
                    disabled={
                      isPublishing || isValidUrl === null ? false : !isValidUrl
                    }
                    onClick={() => {
                      form.setValue("published", true);
                    }}
                  >
                    {isPublishing ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />{" "}
                        {previousStatus ? "Updating" : "Publishing"}
                      </>
                    ) : (
                      <>{previousStatus ? "Update" : "Publish"}</>
                    )}
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          )
          }
        </form>
      </Form>
      <nav className="menu">
        <div className="menu-container fixed p-3.5 bg-background border-b w-full top-0 left-0">
          <div className="flex items-center gap-6">
            <Link
              href={`/@${props.user?.username}`}
              className="flex items-center"
            >
              <Avatar className="h-8 w-8 mr-1 border">
                <AvatarImage
                  src={props.user?.image}
                  alt={props.user?.name || props.user?.username}
                />
                <AvatarFallback>
                  {props.user?.name
                    ? props.user?.name.charAt(0)
                    : props.user?.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size={"sm"}
                className="hidden md:flex"
                asChild
              >
                <div className="font-medium">
                  {props.user?.name || props.user?.username}
                </div>
              </Button>
            </Link>
            {props.post?.published ? (
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-muted-foreground">Published</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-muted-foreground">Draft</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Dialog>
              <DialogTrigger asChild>
                <Button size={"icon"} variant={"outline"} disabled={isSaving}>
                  {isSaving ? (
                    <Icons.spinner className="h-[1.2rem] w-[1.2rem] animate-spin" />
                  ) : (

                    isSaved ? (
                      <Icons.cloud className="h-[1.2rem] w-[1.2rem]" />
                    ) : (
                      <Icons.cloudUpload className="h-[1.2rem] w-[1.2rem]" />
                    )
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="flex flex-col justify-center md:w-72">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto">
                  <RefreshCcw className={"h-10 w-10"} strokeWidth={1.25} />
                </div>
                <div className="flex flex-col space-y-2 text-center sm:text-left mx-auto">
                  <h1 className="text-lg font-semibold leading-none tracking-tight text-center">
                    Auto Saved, {dateFormat(lastSavedTime)}
                  </h1>
                  <p className="text-sm text-muted-foreground text-center">
                    FalseNotes automatically saves your post as a draft every 15
                    seconds. You can also save it manually by clicking the save
                    button.
                  </p>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      onClick={() => {
                        if (
                          (!form.getValues("content") ||
                            form.getValues("content") === "") &&
                          (!form.getValues("title") ||
                            form.getValues("title") === "")
                        ) {
                          toast.error(
                            "Please enter a title and content for your post!"
                          );
                        } else if (
                          !form.getValues("title") ||
                          form.getValues("title") === ""
                        ) {
                          toast.error("Please enter a title for your post!");
                        } else if (
                          !form.getValues("content") ||
                          form.getValues("content") === ""
                        ) {
                          toast.error("Please enter a content for your post!");
                        } else {
                          saveDraft();
                        }
                      }}
                      className="m-auto"
                      size={"lg"}
                      variant="outline"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />{" "}
                          Saving
                        </>
                      ) : (
                        <>Save</>
                      )}
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              size={"icon"}
              variant={"outline"}
              disabled={isSaving}
              onClick={() => setShowDeleteAlert(true)}
            >
              {isSaving ? (
                <Icons.spinner className="h-[1.2rem] w-[1.2rem] animate-spin" />
              ) : (
                <Icons.delete className="h-[1.2rem] w-[1.2rem]" />
              )}
            </Button>
            <PostDeleteDialog
              post={props.post}
              user={props.user}
              open={showDeleteAlert}
              onOpenChange={setShowDeleteAlert}
            />

            <Button
              size={"icon"}
              disabled={isSaving}
              onClick={() => {
                if (
                  (!form.getValues("content") ||
                    form.getValues("content") === "") &&
                  (!form.getValues("title") || form.getValues("title") === "")
                ) {
                  toast.error(
                    "Please enter a title and content for your post!"
                  );
                  setOpen(false);
                } else if (
                  !form.getValues("title") ||
                  form.getValues("title") === ""
                ) {
                  toast.error("Please enter a title for your post!");
                  setOpen(false);
                } else if (
                  !form.getValues("content") ||
                  form.getValues("content") === ""
                ) {
                  toast.error("Please enter a content for your post!");
                  setOpen(false);
                } else {
                  // Split the markdown content by sections
                  const sections = form.getValues("content").split("\n\n");

                  // Convert only the first section to text
                  const firstSection = sections[0];

                  // If first section is empty or has less than 100 characters, use the second section
                  if (firstSection.length < 100) {
                    const secondSection = sections[1]
                      ? sections[0] + " " + sections[1]
                      : sections[0];
                    const description = markdownToText(secondSection);

                    (form.getValues("subtitle") == "" ||
                      form.getValues("subtitle") === null) &&
                      form.setValue("subtitle", description);
                  } else {
                    const description = markdownToText(firstSection);

                    (form.getValues("subtitle") == "" ||
                      form.getValues("subtitle") === null) &&
                      form.setValue("subtitle", description);
                  }
                  setOpen(true);
                }
              }}
            >
              {isPublishing ? (
                <Icons.spinner className="h-[1.2rem] w-[1.2rem] animate-spin" />
              ) : (
                <ArrowUp className="h-[1.2rem] w-[1.2rem]" />
              )}
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
}
