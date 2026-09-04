import { expect, test } from './fixtures'

test('appearance and density preferences apply immediately and persist', async ({
  signedIn: page,
}) => {
  await page.goto('/settings?tab=appearance')

  const html = page.locator('html')

  await page.getByRole('radio', { name: 'Light' }).click()
  await expect(html).toHaveAttribute('data-appearance', 'light')

  await page.getByRole('radio', { name: 'Compact' }).click()
  await expect(html).toHaveAttribute('data-density', 'compact')

  // The pre-paint script in index.html must restore both on reload.
  await page.reload()
  await expect(html).toHaveAttribute('data-appearance', 'light')
  await expect(html).toHaveAttribute('data-density', 'compact')
})

test('a brand theme changes the accent without a rebuild', async ({ signedIn: page }) => {
  // The primary button lives on the profile tab; measure it there.
  await page.goto('/settings')
  const button = page.getByRole('button', { name: 'Save changes' })
  const before = await button.evaluate((node) => getComputedStyle(node).backgroundColor)

  await page.getByRole('tab', { name: 'Appearance' }).click()
  await page.getByRole('radio', { name: 'Summa' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'summa')

  await page.getByRole('tab', { name: 'Profile' }).click()
  const after = await button.evaluate((node) => getComputedStyle(node).backgroundColor)
  expect(after).not.toBe(before)
})

test('compact density shortens controls', async ({ signedIn: page }) => {
  await page.goto('/settings')
  const button = page.getByRole('button', { name: 'Save changes' })
  const comfortable = await button.evaluate((node) => node.getBoundingClientRect().height)

  await page.getByRole('tab', { name: 'Appearance' }).click()
  await page.getByRole('radio', { name: 'Compact' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-density', 'compact')

  await page.getByRole('tab', { name: 'Profile' }).click()
  const compact = await button.evaluate((node) => node.getBoundingClientRect().height)
  expect(compact).toBeLessThan(comfortable)
})
