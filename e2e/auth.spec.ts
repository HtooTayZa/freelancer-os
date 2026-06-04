import { test, expect } from '@playwright/test'

test('homepage loads successfully with correct brand title', async ({ page }) => {
  // Navigate to your local server
  await page.goto('http://localhost:3000/')
  
  // Verify the Metadata polish we applied earlier is working
  await expect(page).toHaveTitle(/Freelancer OS/)
})