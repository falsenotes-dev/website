"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { RefreshCcw, User } from "lucide-react";
import { Icons } from "../icon";
import { useRouter } from "next/navigation";
import { ToastAction } from "../ui/toast";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { useState } from "react";
import ProfileDeleteDialog from "./profile-delete-dialog";
import { AspectRatio } from "../ui/aspect-ratio";
import { log } from "console";
import { Badge } from "../ui/badge";

const profileFormSchema = z.object({
  id: z.string(),
  username: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  cover: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  bio: z.string().max(160).nullable().optional(),
  location: z.string().max(30).nullable().optional(),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
      })
    )
    .optional(),
});
type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm({ data }: { data: any }) {
  const router = useRouter();
  // This can come from your database or API.
  const defaultValues: Partial<ProfileFormValues> = {
    id: data.id,
    username: data.username,
    image: data.image,
    cover: data.cover,
    name: data.name,
    bio: data.bio ?? "",
    location: data.location,
    urls: [
      data.githubProfile && { value: data.githubProfile },
      data.twitterProfile && { value: `https://twitter.com/${data.twitterProfile}` },
      ...data.urls,
    ].filter(Boolean),
  };
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "urls",
    control: form.control,
  })

  async function onSubmit(data: ProfileFormValues) {
    const response = await fetch(`/api/user/${data.id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    if (!response?.ok) {
      return toast.error("Something went wrong.", {
        description: "Your profile could not be updated.",
        action: {
          label: "Try again",
          onClick: async () => {
            //resubmit
            await onSubmit(data);
          },
        },
      });
    }

    toast.success("Profile updated!", {
      action: {
        label: "View profile",
        onClick: () => {
          router.push(`/@${data.username}`);
        },
      },
    });

    router.refresh();
  }

  const [file, setFile] = useState<File | null>(null);
  const [cover, setCover] = useState<string | undefined>(data.cover);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isValidUsername, setIsValidUsername] = useState<boolean>(true);
  const [deleteProfile, setDeleteProfile] = useState<boolean>(false);

  async function upload(file: File) {
    try {
      const dataForm = new FormData()
      dataForm.set('file', file)
      const requestBody = {
        id: form.getValues('id'),
      };

      dataForm.set('body', JSON.stringify(requestBody));

      const res = await fetch(`/api/upload-avatar?id=${form.getValues('id')}`, {
        method: 'POST',
        body: dataForm,
      });

      if (!res.ok) {
        toast.error("Something went wrong.", {
          description: "Your image could not be uploaded.",
          action: {
            label: "Try again",
            onClick: async () => {
              //resubmit
              await upload(file)
            },
          }
        });
      }
      // get the image url
      const { data: avatarUrl } = await res.json()
      return avatarUrl.url;
    } catch (e: any) {
      // Handle errors here
      console.error(e);
      return null
    }
  }
  async function uploadCover(cover: File | null) {
    try {
      if (!cover) {
        return null;
      }
      const dataForm = new FormData()
      dataForm.set('file', cover)
      const requestBody = {
        id: form.getValues('id'),
      };

      dataForm.set('body', JSON.stringify(requestBody));

      const res = await fetch(`/api/upload-cover?id=${form.getValues('id')}`, {
        method: 'POST',
        body: dataForm,
      });

      if (!res.ok) {
        toast.error("Something went wrong.", {
          description: "Your image could not be uploaded.",
          action: {
            label: "Try again",
            onClick: async () => {
              //resubmit
              await uploadCover(cover)
            },
          }
        });
      }
      // get the image url
      const { data: coverUrl } = await res.json()
      return coverUrl.url;
    } catch (e: any) {
      // Handle errors here
      console.error(e);
      return null
    }
  }

  async function checkUsername(username: string) {
    try {
      if (!username || username === data.username || username.length < 3) {
        setIsValidUsername(true);
        return;

      }
      const res = await fetch(`/api/users/validate-username?username=${username}`, {
        method: 'GET',
      });

      if (!res.ok) {
        toast.error("Something went wrong.", {
          description: "Your username could not be validated.",
          action: {
            label: "Try again",
            onClick: async () => {
              //resubmit
              await checkUsername(username)
            },
          }
        });
      }

      const { isValid } = await res.json()
      setIsValidUsername(isValid);
      console.log(isValid);
    } catch (e: any) {
      // Handle errors here
      console.error(e);
      return null
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="justify-between gap-8 flex flex-col items-start w-full"
        >
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Profile photo</FormLabel>
                <FormControl>
                  <div className="flex items-center w-full">
                    <Label htmlFor="avatar" className="flex items-center">
                      {
                        file || field.value ? (
                          <Avatar className="h-20 w-20 border">
                            <AvatarImage
                              src={file ? URL.createObjectURL(file) as string : field.value as string}
                              alt={data.name ?? ""}
                            />
                            <AvatarFallback>
                              {data.name?.charAt(0) || data.username?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <Avatar className="h-20 w-20 border bg-muted justify-center items-center">
                            <Icons.upload className="w-5 h-5" />
                          </Avatar>
                        )
                      }
                      <Input
                        id="avatar"
                        placeholder="Avatar"
                        accept="image/jpeg, image/png, image/gif"
                        type="file"
                        className="sr-only"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              toast.warning("File size must be less than 2MB.");
                            } else {
                              const img = new Image();
                              img.src = URL.createObjectURL(file);
                              img.onload = async () => {
                                if (img.width !== img.height) {
                                  toast.warning("Image must be square.");
                                } else if (
                                  !["image/png", "image/jpeg", "image/gif"].includes(file.type)
                                ) {
                                  toast.warning("File type must be PNG, JPG, or GIF.");
                                } else {
                                  setFile(file);
                                  const url = await upload(file);
                                  form.setValue("image", url);
                                }
                              };
                            }
                          }
                        }}
                      />
                      <Button
                        variant={'ghost'}
                        asChild
                        className="ml-2"
                      >
                        <span>Upload</span>
                      </Button>
                    </Label>
                    <Button
                      variant="ghost"
                      className="ml-2"
                      asChild
                      disabled={!file && !field.value}
                      onClick={() => {
                        setFile(null);
                        form.setValue("image", null);
                      }}
                    >
                      <span>Remove</span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cover"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Cover Image <Badge>New</Badge></FormLabel>
                <FormDescription>
                  Add a cover image to give your profile a personal touch.
                </FormDescription>
                <FormControl>
                  <>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col aspect-[114/25] items-center relative justify-center w-full border border-dashed rounded-md cursor-pointer bg-popover/50">
                        {cover ? (
                          <AspectRatio
                            ratio={114 / 25}
                            className="bg-muted rounded-md"
                          >
                            <div
                              className="object-cover rounded-md w-full h-full bg-cover bg-center aspect-[114/25]"
                              style={{
                                backgroundImage: `url(${coverFile
                                  ? (URL.createObjectURL(
                                    coverFile
                                  ) as string)
                                  : (field.value as string)
                                  })`,
                              }}
                            />
                          </AspectRatio>
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            <Icons.upload className="w-6 h-6 mb-4" />
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
                                setCoverFile(cover);
                                setCover(URL.createObjectURL(cover));
                                const url = await uploadCover(cover);
                                form.setValue("cover", url);
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
                            onClick={async () => {
                              const coverUrl = await uploadCover(
                                coverFile
                              );
                              if (coverUrl) {
                                form.setValue("cover", coverUrl);
                              }
                            }}
                            disabled={!coverFile && form.getValues('cover') == ''}
                          >
                            <Icons.upload className="h-4 w-4" />
                            <span className="sr-only">Upload</span>
                          </Button>
                          <Button
                            variant="secondary"
                            size={"icon"}
                            className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hover:bg-secondary"
                            onClick={() => {
                              form.setValue("cover", "");
                              setCover("");
                              setCoverFile(null);
                            }}
                            disabled={!coverFile && form.getValues('cover') == ''}
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
            name="username"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Username"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      field.onChange(e);
                      checkUsername(e.target.value);
                    }}
                  />
                </FormControl>
                {!isValidUsername && (
                  <FormMessage className="text-destructive">
                    Username is already taken.
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name"
                    {...field}
                    onChange={async (e) => {
                      field.onChange(e);
                      await checkUsername(e.target.value);
                    }
                    }
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    {...field}
                    value={field.value ?? ""}
                    className="resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Location"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            {fields.map((field, index) => (
              <FormField
                control={form.control}
                key={field.id}
                name={`urls.${index}.value`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className={cn(index !== 0 && "sr-only")}>
                      URLs
                    </FormLabel>
                    <FormDescription className={cn(index !== 0 && "sr-only")}>
                      Add links to your website, blog, or social media profiles.
                    </FormDescription>
                    <FormControl>
                      <div className="flex gap-1">
                        <Input {...field} className="flex-1" />
                        <Button
                          variant="outline"
                          asChild
                          className="text-foreground h-10 w-10"
                          size={'icon'}
                          onClick={() => remove(index)}
                        >
                          <span>
                            <Icons.cancel className="w-4 h-4" />
                            <span className="sr-only">Remove</span>
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ value: "" })}
            >
              Add URL
            </Button>
          </div>
          <div className="grid items-center gap-2">
            <Label htmlFor="delete-profile">Delete profile</Label>
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={() => {
                setDeleteProfile(true);
              }}
              asChild
            >
              <div>Delete profile</div>
            </Button>
          </div>
          <Button type="submit" disabled={!form.formState.isValid || !isValidUsername || (form.control._formValues == form.formState.defaultValues)}>Update profile</Button>
        </form>
      </Form>
      <ProfileDeleteDialog open={deleteProfile} onOpenChange={setDeleteProfile} session={data} />
    </>
  );
}
