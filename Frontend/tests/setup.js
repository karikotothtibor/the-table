// tests/setup.js
import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// ✅ TOTAL FETCH MOCK - SEMMI nem megy ki hálózatra
const mockFetch = vi.fn()
mockFetch.mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ token: null })
})

Object.defineProperty(window, 'fetch', {
  value: mockFetch,
  writable: true
})

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn()
  },
  writable: true
})

Object.defineProperty(window, 'alert', {
  value: vi.fn(),
  writable: true
})

window.bootstrap = {
  Modal: {
    getOrCreateInstance: vi.fn(() => ({ show: vi.fn(), hide: vi.fn() }))
  }
}

global.HTMLElement.prototype.scrollIntoView = vi.fn()

config.global.stubs = {
  RouterLink: true,
  Footer: true,
  transition: true
}
