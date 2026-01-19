// tests/reviews.e2e.spec.js
import { test, expect } from '@playwright/test'

test.describe('AddReviews - Értékelés E2E', () => {
  test('review form kitöltése és beküldése hiba nélkül', async ({ page }) => {
    await page.goto('http://localhost:5173/#reviews')

    // Form mezők
    await page.fill('#name', 'Playwright Tesztelő')
    await page.fill('#email', `playwright+review${Date.now()}@example.com`)
    await page.fill('#review', 'Nagyon jó volt minden, köszi!')

    // Csillag rating – pl. 4. csillag
    const stars = page.locator('.rating-star')
    await stars.nth(3).click()

    const ratingText = page.locator('text=Aktuális értékelés')
    await expect(ratingText).toContainText('4')

    // Submit
    const reviewForm = page.locator('form').filter({ has: page.locator('#review') })
    await reviewForm.getByRole('button', { name: /Vélemény Küldése/i }).click()


    await page.waitForTimeout(500) // kis várakozás
  })
})
