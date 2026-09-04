import { z } from 'zod'

export const noteInputSchema = z.object({
  title: z.string().trim().min(3, 'Give the note a title of at least 3 characters.').max(120),
  body: z.string().trim().max(2000, 'Keep notes under 2000 characters.'),
  pinned: z.boolean(),
})

export const noteSchema = noteInputSchema.extend({
  id: z.string(),
  updatedAt: z.iso.datetime(),
})

export type Note = z.infer<typeof noteSchema>
export type NoteInput = z.infer<typeof noteInputSchema>
