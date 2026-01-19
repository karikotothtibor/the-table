// tests/register.test.js 
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import AuthForm from '../../src/components/AuthForm.vue'

describe('AuthForm - Register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.localStorage.getItem = vi.fn(() => null)
    window.localStorage.setItem = vi.fn()
    window.bootstrap = { Modal: { getOrCreateInstance: vi.fn(() => ({ show: vi.fn() })) } }
      window.fetch = vi.fn().mockImplementation((url) => {
    console.log(`📡 Mocked fetch: ${url}`)
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ 
        message: url.includes('check-email') ? 'Az e-mail cím elérhető.' : {}
      })
    })
  })
  })

 
  it('register tab exists and switches', async () => {
    const wrapper = mount(AuthForm)
    await wrapper.find('[data-testid="register-tab"]').trigger('click')
    expect(wrapper.find('#reg-name').exists()).toBe(true)
  })

  it('register form fields exist', async () => {
    const wrapper = mount(AuthForm)
    await wrapper.find('[data-testid="register-tab"]').trigger('click')
    expect(wrapper.find('#reg-name').exists()).toBe(true)
  })

  it('register without checkbox shows warning modal', async () => {
    const wrapper = mount(AuthForm)
    await wrapper.find('[data-testid="register-tab"]').trigger('click')
    const forms = wrapper.findAll('form')
    await forms[1].trigger('submit.prevent')
    await flushPromises()
    expect(window.bootstrap.Modal.getOrCreateInstance).toHaveBeenCalled()
  })

  it('checkEmailAvailability works', async () => {
    
    const wrapper = mount(AuthForm)
    const result = await wrapper.vm.checkEmailAvailability('test@example.com')
    expect(result).toBe(true)
    expect(window.fetch).toHaveBeenCalledWith('http://localhost:3300/check-email', expect.any(Object))
  })


  it('register function is called and validates', async () => {
    const wrapper = mount(AuthForm)
    wrapper.vm.name = 'Kovács János Csaba'
    wrapper.vm.email = 'test@example.com'
    wrapper.vm.password = 'AbcDefG1!@#'
    wrapper.vm.passwordConfirm = 'AbcDefG1!@#'
    wrapper.vm.phone = '+36301234567'
    
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Elérhető' })
    })
    
    await wrapper.vm.register()
    await flushPromises()
    
   
    expect(window.fetch).toHaveBeenCalledWith('http://localhost:3300/check-email', expect.any(Object))
  })
})
