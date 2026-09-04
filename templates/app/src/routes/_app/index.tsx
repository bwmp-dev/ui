import { createFileRoute, redirect } from '@tanstack/react-router'

/**
 * There is no separate overview page in this template, so `/` goes straight to
 * the devices list. Replace the redirect with a `component` when you add one.
 */
export const Route = createFileRoute('/_app/')({
  beforeLoad: () => {
    throw redirect({ to: '/devices' })
  },
})
