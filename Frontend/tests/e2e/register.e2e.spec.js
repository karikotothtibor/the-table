// tests/register.e2e.spec.js
import { test, expect } from '@playwright/test'
//Mindig másik email
const uniqueEmail = `test_${Date.now()}@example.com`

test.describe('AuthForm - Regisztráció E2E', () => {
  test('sikeres regisztráció és siker modal', async ({ page }) => {
    // Oldal megnyitása
    await page.goto('http://localhost:5173/login')

    // Regisztráció fülre váltás
    await page.getByTestId('register-tab').click()

    // Adatok kitöltése
    await page.fill('#reg-name', 'Kovács János')
    await page.fill('#reg-tel', '06301234567')
    await page.fill('#reg-email', uniqueEmail)
    await page.fill('#reg-password', 'AbcDef12!@')
    await page.fill('#reg-confirm', 'AbcDef12!@')

    // Adatvédelmi checkbox
    await page.check('#terms')

    // Regisztráció gomb
    await page.locator('form').filter({ hasText: 'Már van felhasználói fiókod?' }).getByRole('button', { name: 'Regisztráció' }).click()

    // Várjuk a siker modalt
    const modal = page.locator('.modal.show')
    await expect(modal).toBeVisible()

    // Siker szöveg ellenőrzése
    await expect(modal).toContainText('Sikeres regisztráció!')
  })
})
