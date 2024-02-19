import { z } from "zod";

export const profileSchema = z.object({
  id: z.string(),
  username: z.string(),
  image: z.string().nullable().optional(),
  cover: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  bio: z.string().max(160).nullable().optional(),
  location: z.string().max(30).nullable().optional(),
  urls: z
    .array(z.object({ value: z.string().url() }))
    .nullable()
    .optional(),
});
