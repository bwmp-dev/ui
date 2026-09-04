import { expect, test } from './fixtures'

test('redirects an anonymous visitor to the login page', async ({ page }) => {
  await page.goto('/devices')
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
  // The intended destination is preserved so signing in returns there.
  expect(page.url()).toContain('redirect=')
})

test('signs in and lands on the requested page', async ({ page }) => {
  await page.goto('/settings')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
})

test('navigates between sections and keeps the sidebar in step', async ({ signedIn: page }) => {
  await page.getByRole('link', { name: 'Settings' }).first().click()
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Settings' }).first()).toHaveAttribute('data-active')

  await page.getByRole('link', { name: 'Devices' }).click()
  await expect(page.getByRole('heading', { name: 'Devices' })).toBeVisible()
})

test('shows a 404 page for an unknown route', async ({ signedIn: page }) => {
  await page.goto('/nope')
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
  // The 404 links home rather than at a specific feature, so it survives
  // `--no-example`, where /devices does not exist.
  await page.getByRole('link', { name: 'Go home' }).click()
  await expect(page.getByRole('heading', { name: 'Devices' })).toBeVisible()
})

test('opens the command palette with the keyboard and navigates', async ({ signedIn: page }) => {
  await page.keyboard.press('ControlOrMeta+k')

  const palette = page.getByRole('dialog', { name: 'Command palette' })
  await expect(palette).toBeVisible()

  await palette.getByRole('combobox').fill('settings')
  await palette.getByRole('option', { name: /Go to settings/ }).click()

  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
  await expect(palette).not.toBeVisible()
})

test('closes the command palette on Escape', async ({ signedIn: page }) => {
  const palette = page.getByRole('dialog', { name: 'Command palette' })

  await page.keyboard.press('ControlOrMeta+k')
  await expect(palette).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(palette).not.toBeVisible()
})
