import { test as base, expect, type Page } from '@playwright/test'

/**
 * Signing in is the precondition for almost every test, so it lives here rather
 * than being copy-pasted. The mock API accepts any email with the password
 * `password`.
 */
export async function signIn(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.getByRole('heading', { name: 'Devices' })).toBeVisible()
}

export const test = base.extend<{ signedIn: Page }>({
  // Playwright names this callback `use` by convention; renamed here because
  // that is also a React hook, and the lint rules cannot tell them apart.
  signedIn: async ({ page }, provide) => {
    await signIn(page)
    await provide(page)
  },
})

export { expect }
