// tests/login.e2e.spec.js
import { test, expect } from '@playwright/test'

test.describe('AuthForm - Login E2E', () => {
  test('sikeres bejelentkezés és token mentés', async ({ page }) => {
    await page.goto('http://localhost:5173/login')

    // Login tab
    await page.getByTestId('login-tab').click().catch(() => {})

    // IDE valós user adataid kellenek!
    await page.fill('#email-login', 'test1@test.hu')
    await page.fill('#password-login', 'Test65eset!')

    // Login form submit gomb
    const forms = page.locator('form')
    await forms.nth(0).getByRole('button', { name: 'Bejelentkezés' }).click()

    // Várakozás a fetch + token mentésre
    await page.waitForTimeout(1000)

    // Csak token ellenőrzés – ez a lényeg
    const token = await page.evaluate(() => localStorage.getItem('token'))
    expect(token).not.toBeNull()
  })
})
