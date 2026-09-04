import { useState } from 'react'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { z } from 'zod'
import { Alert, Button, Card, Field, Input } from '@stack/ui'
import { signIn } from '~/features/auth/server'

const searchSchema = z.object({ redirect: z.string().optional() })

export const Route = createFileRoute('/login')({
  validateSearch: searchSchema,
  beforeLoad: ({ context, search }) => {
    if (context.user) throw redirect({ to: search.redirect ?? '/notes' })
  },
  component: LoginPage,
})

function LoginPage() {
  const router = useRouter()
  const search = Route.useSearch()
  const [email, setEmail] = useState('ada@example.com')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setPending(true)
    setError(null)

    try {
      await signIn({ data: { email, password } })
      // The session cookie is set by the server function; invalidating makes
      // the root route re-read it so `context.user` is populated everywhere.
      await router.invalidate()
      await router.navigate({ to: search.redirect ?? '/notes' })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not sign in.')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center p-6">
      <div className="w-full max-w-narrow">
        <Card variant="raised">
          <Card.Header>
            <div>
              <Card.Title>Sign in</Card.Title>
              <Card.Description>The session is a signed, httpOnly cookie.</Card.Description>
            </div>
          </Card.Header>

          {/*
            `method="post"` matters even though `submit` prevents the default:
            if the JavaScript fails to load, the browser falls back to a native
            submit, and a GET would put the password in the URL and the history.
          */}
          <form method="post" onSubmit={submit}>
            <Card.Content className="flex flex-col gap-4">
              {error ? <Alert tone="danger">{error}</Alert> : null}

              <Field name="email">
                <Field.Label required>Email</Field.Label>
                <Input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Field>

              <Field name="password">
                <Field.Label required>Password</Field.Label>
                <Input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Field>
            </Card.Content>

            <Card.Footer>
              <Button type="submit" variant="primary" loading={pending}>
                Sign in
              </Button>
            </Card.Footer>
          </form>
        </Card>

        <p className="mt-3 text-center text-2xs text-fg-subtle">
          Sample credentials: any email with the password{' '}
          <code className="font-mono">password</code>.
        </p>
      </div>
    </main>
  )
}
