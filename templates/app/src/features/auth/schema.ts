import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  role: z.enum(['admin', 'member', 'viewer']),
})

export const sessionSchema = z.object({
  token: z.string(),
  user: userSchema,
})

export const credentialsSchema = z.object({
  email: z.email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
})

export type User = z.infer<typeof userSchema>
export type Session = z.infer<typeof sessionSchema>
export type Credentials = z.infer<typeof credentialsSchema>

/** Coarse permissions. Real rules belong on the server; this only shapes the UI. */
export function canEdit(user: User | null): boolean {
  return user?.role === 'admin' || user?.role === 'member'
}
