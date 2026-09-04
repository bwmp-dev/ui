import { useState } from 'react'
import { Link, createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { Alert, Button, Card, Field, Input } from '@bwmp-dev/ui'
import { isApiError, userMessage } from '~/api/errors'
import { useAuth } from '~/features/auth/auth-context'
import { env } from '~/lib/env'

const searchSchema = z.object({
  /** Where to return to after signing in. */
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/login')({
  validateSearch: searchSchema,
  // Someone already signed in has no business on the login page.
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) throw redirect({ to: search.redirect ?? '/devices' })
  },
  component: LoginPage,
})

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const search = Route.useSearch()

  const [email, setEmail] = useState('ada@example.com')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [pending, setPending] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setPending(true)
    setError(null)
    setFieldErrors({})

    try {
      await login({ email, password })
      await navigate({ to: search.redirect ?? '/devices' })
    } catch (cause) {
      if (isApiError(cause) && cause.fields) setFieldErrors(cause.fields)
      else setError(userMessage(cause))
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center p-6">
      <div className="w-full max-w-narrow">
        <div className="mb-5 flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-sm bg-accent text-xs font-bold text-accent-fg">
            {env.appName.slice(0, 1).toUpperCase()}
          </span>
          <span className="text-ui font-semibold text-fg">{env.appName}</span>
        </div>

        <Card variant="raised">
          <Card.Header>
            <div>
              <Card.Title>Sign in</Card.Title>
              <Card.Description>Use your team account to continue.</Card.Description>
            </div>
          </Card.Header>

          <form onSubmit={submit}>
            <Card.Content className="flex flex-col gap-4">
              {error ? <Alert tone="danger">{error}</Alert> : null}

              <Field name="email" invalid={Boolean(fieldErrors.email)}>
                <Field.Label required>Email</Field.Label>
                <Input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                {fieldErrors.email ? <Field.Error match>{fieldErrors.email}</Field.Error> : null}
              </Field>

              <Field name="password" invalid={Boolean(fieldErrors.password)}>
                <Field.Label required>Password</Field.Label>
                <Input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                {fieldErrors.password ? (
                  <Field.Error match>{fieldErrors.password}</Field.Error>
                ) : null}
              </Field>
            </Card.Content>

            <Card.Footer className="justify-between">
              <Link
                to="/login"
                className="rounded-xs text-xs text-fg-muted focus-ring hover:text-fg"
              >
                Forgot password?
              </Link>
              <Button type="submit" variant="primary" loading={pending}>
                Sign in
              </Button>
            </Card.Footer>
          </form>
        </Card>

        {env.useMockApi ? (
          <p className="mt-3 text-center text-2xs text-fg-subtle">
            Mock API: any email works with the password <code className="font-mono">password</code>.
          </p>
        ) : null}
      </div>
    </main>
  )
}
