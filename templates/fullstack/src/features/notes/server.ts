import { createMiddleware, createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { readSessionUser, type SessionUser } from '~/server/session'
import * as store from '~/server/notes'
import { noteInputSchema, type Note } from './schema'

/**
 * Server functions are the RPC layer of this template.
 *
 * They run only on the server — the client gets a typed stub that posts to
 * them — so the database, the session and the secrets never reach the bundle.
 * The transport is generated; what matters is that authorisation is enforced
 * here rather than in the component that happens to call it.
 */

export class UnauthorizedError extends Error {
  override readonly name = 'UnauthorizedError'
}

/**
 * Every function below runs behind this. Requiring the session in middleware
 * rather than in each handler means a new endpoint is authenticated by default
 * instead of by remembering to check.
 */
const authed = createMiddleware({ type: 'function' }).server(async ({ next }) => {
  const user = await readSessionUser()
  if (!user) throw new UnauthorizedError('Not signed in.')
  return next({ context: { user } })
})

export const fetchNotes = createServerFn({ method: 'GET' })
  .middleware([authed])
  .handler(({ context }): Note[] => store.listNotes((context.user as SessionUser).id))

export const addNote = createServerFn({ method: 'POST' })
  .middleware([authed])
  // Validated on the server, using the same schema the form uses on the client.
  // The client copy is a convenience; this one is the rule.
  .validator(noteInputSchema)
  .handler(({ data }): Note => store.createNote(data))

export const editNote = createServerFn({ method: 'POST' })
  .middleware([authed])
  .validator(z.object({ id: z.string(), input: noteInputSchema.partial() }))
  .handler(({ data }): Note => {
    const note = store.updateNote(data.id, data.input)
    if (!note) throw new Error('That note no longer exists.')
    return note
  })

export const removeNote = createServerFn({ method: 'POST' })
  .middleware([authed])
  .validator(z.object({ id: z.string() }))
  .handler(({ data }) => {
    store.deleteNote(data.id)
    return { ok: true } as const
  })
