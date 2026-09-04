import { expect, test } from './fixtures'

/**
 * The keyboard contract for overlays. These behaviours come from Base UI, but
 * they are exactly what breaks silently after an upgrade, so they are pinned
 * here against a real browser.
 */
test.describe('overlay keyboard behaviour', () => {
  test('traps focus, closes on Escape and restores focus to the trigger', async ({
    signedIn: page,
  }) => {
    const trigger = page.getByRole('button', { name: 'New device' })
    await trigger.click()

    const dialog = page.getByRole('dialog', { name: 'New device' })
    await expect(dialog).toBeVisible()

    // Tab well past the end of the dialog; focus must stay inside it.
    for (let step = 0; step < 12; step += 1) {
      await page.keyboard.press('Tab')
      const insideDialog = await dialog.evaluate((node) => node.contains(document.activeElement))
      expect(insideDialog).toBe(true)
    }

    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
    await expect(trigger).toBeFocused()
  })

  test('a destructive confirmation ignores an outside click', async ({ signedIn: page }) => {
    await page.getByRole('table', { name: 'Devices' }).getByRole('row').nth(1).click()
    await page
      .getByRole('complementary')
      .getByRole('button', { name: /^Delete/ })
      .click()

    const confirm = page.getByRole('alertdialog')
    await expect(confirm).toBeVisible()

    await page.mouse.click(8, 8)
    await expect(confirm).toBeVisible()

    await confirm.getByRole('button', { name: 'Cancel' }).click()
    await expect(confirm).not.toBeVisible()
  })

  test('a select opens, moves with arrows and commits with Enter', async ({ signedIn: page }) => {
    await page.getByRole('button', { name: 'New device' }).click()
    const dialog = page.getByRole('dialog', { name: 'New device' })

    const kind = dialog.getByRole('combobox', { name: 'Kind' })
    await kind.focus()
    await page.keyboard.press('Enter')

    const listbox = page.getByRole('listbox')
    await expect(listbox).toBeVisible()

    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')

    await expect(listbox).not.toBeVisible()
    await expect(kind).toHaveText(/gateway|sensor|controller/i)
  })
})
