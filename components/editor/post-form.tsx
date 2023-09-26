"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import ReactMarkdown from "react-markdown"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ArrowUp } from "lucide-react"
import { cp } from "fs"
import { useSession } from "next-auth/react"
import { getUserByUsername } from "../get-user"
import { ScrollArea } from "../ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TextareaAutosize from 'react-textarea-autosize';
import { Icons } from "../icon"
import { redirect, useRouter } from "next/navigation"
import { remark } from "remark";
import html from "remark-html";


const postFormSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters long.",
    })
    .max(100, {
      message: "Username must not be longer than 100 characters.",
    }),
  visibility: z.enum(["public", "private", "draft"], {
    required_error: "Please select a visibility option",
  }),
  content: z.string(),
  coverImage: z.string().optional(),
  tags: z
    .array(
      z.object({
        value: z.string(),
      })
    )
    .optional(),
  url: z.string(),
  description: z.string().max(280).optional(),
})

type PostFormValues = z.infer<typeof postFormSchema>

// This can come from your database or API.
const defaultValues: Partial<PostFormValues> = {
  visibility: "public",
  //set defaul value for url tobe generated random 10 characters
  url: Math.random().toString(36).substring(2, 15),
}

export function PostForm() {
  const sessionUser = useSession().data?.user as any;
  const [user, setUser] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getUserByUsername(sessionUser?.name);
        setUser(userData);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [sessionUser?.name!]);
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const { fields, append } = useFieldArray({
    name: "tags",
    control: form.control,
  })

  async function onSubmit(data: PostFormValues) {
    setIsPublishing(true);
    // Upload the cover image

    if(file) {
      try {
        const dataForm = new FormData()
        dataForm.set('file', file)
        // Construct the request body with postId and authorId
        const requestBody = {
          postId: form.getValues('url'),
          userId: user?.id,
        };
  
        dataForm.set('body', JSON.stringify(requestBody));
  
        const res = await fetch(`/api/upload?postId=${form.getValues('url')}&authorId=${user?.username}`, {
          method: 'POST',
          body: dataForm,
        });
        // get the image url
        const { data: coverUrl } = await res.json()
        data.coverImage = coverUrl.url;
  
      } catch (e: any) {
        // Handle errors here
        console.error(e)
      }
    }
    // Get the authorId from the session
    const authorId = user?.userid;
    try {
      // Submit the form
    const result = await fetch("/api/posts/submit", {
      method: "POST",
      body: JSON.stringify({ ...data, authorId }),
    })
    const json = await result.json()
    
    } catch (error) {
      console.error(error)
      setIsPublishing(false)
    }
    /* console.log(data.url)
    console.log(user?.username)
    // If successful, redirect to the post page
    redirect(`/${user?.username}/${data.url}`) */
    // If successful, redirect to the post page
    router.push(`/${user?.username}/${data.url}`);
  }

  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  async function validateUrl(value: string) {
    try {
      // Check if the url is already taken
      const result = await fetch(`/api/posts/validate-url?url=${value}&authorId=${user?.userid}`, {
        method: 'GET',
      });

      if (!result.ok) {
        setIsValidUrl(false);
        return
      } else {
        setIsValidUrl(true);
        return
      }
    } catch (error) {
      console.log(error);
    }
  }

  // URL-friendly link validation
  function handleUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    // Replace spaces with dashes and make lowercase of 2 words only
    validateUrl(value);
    // Update the form field value
    form.setValue('url', value);
  }

  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [file, setFile] = useState<File>(); // State for the uploaded file

  async function handleContentChange(value: string) {
    form.setValue('content', value); // Update the form field value

    // Use remark to convert markdown into HTML string
    const processedContent = await remark().use(html).process(value);
    const contentHtml = processedContent.toString();
    setMarkdownContent(contentHtml);
  }

  //Set url value from title value
  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    form.setValue('title', value);
    // Replace spaces with dashes and make lowercase of 2 words only
    if (value.split(' ').length > 1) {
      const url = value.split(' ')[0].toLowerCase() + '-' + value.split(' ')[1].toLowerCase();
      validateUrl(url);
      if (isValidUrl) {
        form.setValue('url', url);
      } else {
        setIsValidUrl(null);
      }
    } else {
      validateUrl(value.toLowerCase());
      if (isValidUrl) {
        form.setValue('url', value.toLowerCase());
      } else {
        setIsValidUrl(null);
      }
    }
  }



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full" id="PostForm">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Title of the post" className="border-none focus-visible:ring-none focus-visible:ring-offset-0 !ring-0" {...field} onChange={handleTitleChange} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym. You can only change this once every 30 days.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Tabs defaultValue="editor" className="min-h-[800px]">
          <TabsList className="mb-2">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="editor"> <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextareaAutosize
                    className="flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none border-none focus-visible:ring-none focus-visible:ring-offset-0 !ring-0 disabled:cursor-not-allowed disabled:opacity-50 w-full min-h-[40px]"
                    placeholder="Write your post here..."
                    {...field}
                    onChange={(e) => handleContentChange(e.target.value)}
                  />
                </FormControl>
                {/* <FormDescription>
                You can <span>@mention</span> other users and organizations to
                link to them.
              </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          /></TabsContent>
          <TabsContent value="preview" className="px-5 pb-5 bg-background py-4 text-sm">
            <div dangerouslySetInnerHTML={{ __html: markdownContent }}  className="markdown-body"/>
          </TabsContent>
        </Tabs>

        <Dialog>

          <DialogTrigger className="w-full"><Button size={"lg"} variant={"secondary"} className="w-full" asChild><span>Post Setting</span></Button></DialogTrigger>

          <DialogContent className="h-full max-h-[405px] md:max-h-[550px] !p-0">
            <ScrollArea className="h-full w-full px-6">
              <DialogHeader className="py-6">
                <DialogTitle className="font-bold">Post Settings for publishing</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pb-4 m-1">
                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Privacy</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="public" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Public
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="private" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Private
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="draft" />
                            </FormControl>
                            <FormLabel className="font-normal">Draft</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL-friendly Link</FormLabel>
                      <FormDescription>
                        {`falsenotes.app/${user?.username}/`}
                      </FormDescription>
                      <FormControl>
                        <Input placeholder="URL" {...field} onChange={handleUrlChange} />
                      </FormControl>
                      {isValidUrl !== null && (
                        isValidUrl ? (
                          <FormMessage className="text-green-500">
                            This URL is available.
                          </FormMessage>
                        ) : (
                          <FormMessage className="text-red-500">
                            This URL is unavailable. Please try another one.
                          </FormMessage>
                        )
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coverImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post Preview</FormLabel>
                      <FormControl>
                        <>
                          {
                            file ? (
                              <AspectRatio ratio={16 / 9} className="bg-muted">
                                <Image
                                  src={URL.createObjectURL(file)}
                                  alt="Cover Image"
                                  fill
                                  className="rounded-md object-cover"
                                />
                              </AspectRatio>
                            ) : ''
                          }
                          <Input type="file" {...field} accept="image/*" onChange={(e) => setFile(e.target.files?.[0])} />

                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post Description</FormLabel>
                      <FormControl>
                        <TextareaAutosize {...field} className="flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full min-h-[40px]" rows={1}
                        onChange={field.onChange}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-4 grid-cols-5">
                  {fields.map((field, index) => (
                    <FormField
                      control={form.control}
                      key={field.id}
                      name={`tags.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          {/* <FormDescription className={cn(index !== 0 && "sr-only")}>
                    Add links to your website, blog, or social media profiles.
                  </FormDescription> */}
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  <Button
                    variant="outline"
                    className="mt-2 col-span-5"
                    onClick={() => append({ value: "" })}
                  >
                    Add Tag
                  </Button>
                </div>
              </div>
              <DialogFooter className="pb-6">
                <Button
                  type="submit"
                  className="ml-auto w-full"
                  size={"lg"}
                  form="PostForm"
                  disabled={isPublishing}
                >
                  {
                    isPublishing ? (
                      <>
                        <Icons.spinner  className="mr-2 h-4 w-4 animate-spin" /> Publishing
                      </>
                    ) : (
                      <>Publish</>
                    )
                  }
                </Button>
              </DialogFooter>
            </ScrollArea>
          </DialogContent>
        </Dialog>

      </form>
    </Form>
  )
}