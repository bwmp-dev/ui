import { getSession, updateSession, clearSession } from '@tanstack/react-start/server'
import { getServerEnv } from './env'

/**
 * Cookie sessions.
 *
 * The session is encrypted and signed by the framework and stored in an
 * httpOnly cookie, so there is no session table to run and nothing readable
 * from JavaScript. Swapping this for a JWT or an external identity provider
 * means rewriting this file; `useAuth` and the routes do not change.
 */
export type SessionUser = {
  id: string
  name: string
  email: string
  role: 'admin' | 'member'
}

type SessionData = { user?: SessionUser }

function config() {
  const env = getServerEnv()
  return {
    name: 'stack_session',
    password: env.sessionSecret,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.isProduction,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    },
  } as const
}

export async function readSessionUser(): Promise<SessionUser | null> {
  const session = await getSession<SessionData>(config())
  return session.data.user ?? null
}

export async function startSession(user: SessionUser): Promise<void> {
  await updateSession<SessionData>(config(), { user })
}

export async function endSession(): Promise<void> {
  await clearSession(config())
}
