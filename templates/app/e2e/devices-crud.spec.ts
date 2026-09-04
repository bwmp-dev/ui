import { expect, test } from './fixtures'

test.describe('devices', () => {
  test('filters the table and keeps the filter in the URL', async ({ signedIn: page }) => {
    const table = page.getByRole('table', { name: 'Devices' })
    await expect(table.getByRole('row')).not.toHaveCount(1)

    await page.getByRole('searchbox', { name: 'Search devices' }).fill('gateway-001')

    await expect(table.getByRole('cell', { name: 'gateway-001' })).toBeVisible()
    await expect(page).toHaveURL(/q=gateway-001/)

    // The filtered view must survive a reload.
    await page.reload()
    await expect(page.getByRole('searchbox', { name: 'Search devices' })).toHaveValue('gateway-001')
  })

  test('offers to clear filters when nothing matches', async ({ signedIn: page }) => {
    await page.getByRole('searchbox', { name: 'Search devices' }).fill('zzzzzz')
    await expect(page.getByText('No devices match these filters')).toBeVisible()

    await page.getByRole('button', { name: 'Clear filters' }).click()
    await expect(page.getByRole('table', { name: 'Devices' }).getByRole('row')).not.toHaveCount(1)
  })

  test('sorts by a column header and records it in the URL', async ({ signedIn: page }) => {
    const nameHeader = page.getByRole('columnheader', { name: /Name/ })
    // The list starts sorted by name ascending, and the header says so.
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending')
    // Defaults are stripped, so a default view has no query string at all.
    await expect(page).not.toHaveURL(/order=/)

    await nameHeader.getByRole('button').click()
    await expect(nameHeader).toHaveAttribute('aria-sort', 'descending')
    await expect(page).toHaveURL(/order=desc/)

    const firstName = await page
      .getByRole('table', { name: 'Devices' })
      .getByRole('row')
      .nth(1)
      .getByRole('cell')
      .nth(1)
      .innerText()
    expect(firstName.startsWith('s')).toBe(true)
  })

  test('shows a device in the details panel when its row is selected', async ({
    signedIn: page,
  }) => {
    const firstRow = page.getByRole('table', { name: 'Devices' }).getByRole('row').nth(1)
    const name = await firstRow.getByRole('cell').nth(1).innerText()

    await firstRow.click()

    const details = page.getByRole('complementary')
    await expect(details.getByRole('heading', { name })).toBeVisible()
    await expect(details.getByText('Firmware')).toBeVisible()
  })

  test('creates, edits and deletes a device', async ({ signedIn: page }) => {
    // --- create -------------------------------------------------------------
    await page.getByRole('button', { name: 'New device' }).click()

    // Toasts are also `role="dialog"` (the ARIA pattern for a toast with
    // actions), so dialogs are always addressed by their accessible name here.
    const dialog = page.getByRole('dialog', { name: 'New device' })
    await expect(dialog.getByRole('heading', { name: 'New device' })).toBeVisible()

    await dialog.getByRole('textbox', { name: 'Name' }).fill('edge-e2e-001')

    await dialog.getByRole('combobox', { name: 'Region' }).click()
    await page.getByRole('option', { name: 'us-east-1' }).click()

    await dialog.getByRole('button', { name: 'Create device' }).click()

    await expect(dialog).not.toBeVisible()
    await expect(page.getByText('Device created')).toBeVisible()

    // --- read ---------------------------------------------------------------
    await page.getByRole('searchbox', { name: 'Search devices' }).fill('edge-e2e-001')
    const row = page.getByRole('row', { name: /edge-e2e-001/ })
    await expect(row).toBeVisible()
    await row.click()

    const details = page.getByRole('complementary')
    await expect(details.getByRole('heading', { name: 'edge-e2e-001' })).toBeVisible()

    // --- update -------------------------------------------------------------
    await details.getByRole('button', { name: 'Edit' }).click()
    const editDialog = page.getByRole('dialog', { name: /Edit edge-e2e-001/ })
    await editDialog.getByRole('textbox', { name: 'Name' }).fill('edge-e2e-renamed')
    await editDialog.getByRole('button', { name: 'Save changes' }).click()

    await expect(page.getByText('Device updated')).toBeVisible()
    await page.getByRole('searchbox', { name: 'Search devices' }).fill('edge-e2e-renamed')
    await expect(page.getByRole('row', { name: /edge-e2e-renamed/ })).toBeVisible()

    // --- delete -------------------------------------------------------------
    await page.getByRole('row', { name: /edge-e2e-renamed/ }).click()
    await details.getByRole('button', { name: /^Delete/ }).click()

    const confirm = page.getByRole('alertdialog')
    await expect(confirm).toBeVisible()
    await confirm.getByRole('button', { name: 'Delete device' }).click()

    await expect(page.getByText('Device deleted')).toBeVisible()
    await expect(page.getByRole('row', { name: /edge-e2e-renamed/ })).toHaveCount(0)
  })

  test('reports validation errors on the offending field', async ({ signedIn: page }) => {
    await page.getByRole('button', { name: 'New device' }).click()
    const dialog = page.getByRole('dialog', { name: 'New device' })

    const name = dialog.getByRole('textbox', { name: 'Name' })
    await name.fill('Not A Valid Name')
    await dialog.getByRole('combobox', { name: 'Region' }).click()
    await page.getByRole('option', { name: 'eu-west-1' }).click()
    await dialog.getByRole('button', { name: 'Create device' }).click()

    await expect(
      dialog.getByText('Use lower-case letters, numbers and hyphens only.'),
    ).toBeVisible()
    await expect(name).toHaveAttribute('aria-invalid', 'true')
    // The dialog stays open so the value can be corrected.
    await expect(dialog).toBeVisible()
  })
})
