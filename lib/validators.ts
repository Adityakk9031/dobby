import { z } from "zod";

export const authSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});

export const folderSchema = z.object({
  name: z.string().trim().min(1).max(80),
  parentId: z.string().cuid().nullable(),
});

export const fileSchema = z.object({
  name: z.string().trim().min(1).max(120),
  type: z.string().trim().min(1).max(30),
  size: z.coerce.number().int().min(0).max(1024 * 1024 * 1024).default(0),
  url: z.string().trim().url().nullable().or(z.literal("")).transform((value) => value || null),
  note: z.string().trim().max(300).nullable().or(z.literal("")).transform((value) => value || null),
  folderId: z.string().cuid().nullable(),
});
