import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Login from '../../src/components/AuthForm.vue'

describe('Login Form', () => {
  it('renders login tab by default', () => {
    const wrapper = mount(Login)
    expect(wrapper.find('.nav-link.active').text()).toContain('Bejelentkezés')
  })

  it('login form fields exist', () => {
    const wrapper = mount(Login)
    expect(wrapper.find('#email-login').exists()).toBe(true)
    expect(wrapper.find('#password-login').exists()).toBe(true)
  })

  it('successful login', async () => {
    // Mock fetch
    window.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ token: 'login-success' })
    })

    const wrapper = mount(Login)
    
    await wrapper.get('#email-login').setValue('test@example.com')
    await wrapper.get('#password-login').setValue('pass123')
    await wrapper.find('button[type="submit"]').trigger('click')
    
    // Várakozás ÖSSZES async műveletre!
    await flushPromises()
    
    expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'login-success')
  })
})
