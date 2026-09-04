import { createFileRoute, redirect } from '@tanstack/react-router'

/** The app has one destination; send people there or to the login page. */
export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    throw redirect({ to: context.user ? '/notes' : '/login' })
  },
})
