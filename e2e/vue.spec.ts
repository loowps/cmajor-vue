import { expect, test } from '@playwright/test'

test('visits the app root url with included cmajor title', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('header')).toHaveText('Cmajor + VueJs')
})
