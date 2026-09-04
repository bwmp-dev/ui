import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { endSession, readSessionUser, startSession, type SessionUser } from '~/server/session'

/**
 * Authentication, as three server functions.
 *
 * Everything provider-specific lives here. Moving to OAuth or an external
 * identity service means rewriting this file and `~/server/session.ts`; the
 * routes and components keep calling the same three functions.
 */

export const credentialsSchema = z.object({
  email: z.email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
})

/**
 * Read by the root route on every navigation, including the server render, so
 * the first HTML already reflects who is signed in.
 */
export const getCurrentUser = createServerFn({ method: 'GET' }).handler(
  async (): Promise<SessionUser | null> => readSessionUser(),
)

export const signIn = createServerFn({ method: 'POST' })
  .validator(credentialsSchema)
  .handler(async ({ data }): Promise<SessionUser> => {
    // Replace with a real lookup and a constant-time password comparison.
    // Returning the same error for "no such user" and "wrong password" is
    // deliberate: distinguishing them tells an attacker which emails exist.
    if (data.password !== 'password') {
      throw new Error('Those credentials did not match.')
    }

    const user: SessionUser = {
      id: 'usr_1',
      name: 'Ada Byron',
      email: data.email,
      role: 'admin',
    }

    await startSession(user)
    return user
  })

export const signOut = createServerFn({ method: 'POST' }).handler(async () => {
  await endSession()
  return { ok: true } as const
})
