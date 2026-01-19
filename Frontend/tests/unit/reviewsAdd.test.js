// tests/reviewsAdd.test.js 
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import AddReviews from '../../src/pages/Home.vue'
import {nextTick, ref} from 'vue'

describe('AddReviews', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.localStorage.getItem = vi.fn(() => 'fake-token')
  })

  it('mounts without crashing', () => {
    mount(AddReviews)
  })

  describe('Review form', () => {
    it('form fields exist', () => {
      const wrapper = mount(AddReviews)
     
      expect(wrapper.find('#name').exists()).toBe(true)
      expect(wrapper.find('#email').exists()).toBe(true)
      expect(wrapper.find('#review').exists()).toBe(true)
      
    })

    it('star rating works', async () => {
      const wrapper = mount(AddReviews)
      const stars = wrapper.findAll('.rating-star')
      
      await stars[2].trigger('click')
      
      expect(wrapper.find('#rating-input').element.value).toBe('3')
    })

    it('logged in user shows readonly name', async () => {
      const wrapper = mount(AddReviews, {
        data() {
          return {
            me: ref({ name: 'Teszt Elek', id: 1 })
          }
        }
      })
      
      const nameInput = wrapper.find('#name')
      expect(nameInput.attributes()['readonly']).toBeDefined()
    })

   it('submit review calls API', async () => {
  const mockFetch = vi.fn().mockResolvedValue({ ok: true })
  window.fetch = mockFetch
  
  const wrapper = mount(AddReviews, {
    global: {
      provide: {
        me: { id: 1, name: 'Kovács János' },
        reservation: ref({ id: 1, restaurantId: 1 })
      }
    }
  })
  
  // Form kitöltés...
  await wrapper.get('#name').setValue('Kovács János')
  await wrapper.get('#email').setValue('teszt@example.com')
  await wrapper.get('#review').setValue('Szuper!')
  await wrapper.findAll('.rating-star')[0].trigger('click')
  
  await wrapper.find('form').trigger('submit')
  await flushPromises()
  await nextTick()
  
  const calls = mockFetch.mock.calls
  console.table(calls.map((call, i) => ({
    '#': i+1,
    url: call[0],
    method: call[1]?.method
  })))
  
  expect(calls.length).toBeGreaterThan(0)// Tartalmazza a nevet

})

})


    it('name validation shows modal', async () => {
      window.fetch = vi.fn().mockResolvedValue({ ok: true })
      
      const wrapper = mount(AddReviews)
      
      await wrapper.get('#email').setValue('test@example.com')
      await wrapper.get('#review').setValue('Test')
      await wrapper.findAll('.rating-star')[0].trigger('click')
      
      await wrapper.find('form').trigger('submit')
      
      // Modal szöveg ellenőrzés
      expect(window.bootstrap.Modal.getOrCreateInstance).toHaveBeenCalled()
      
    })
    
  })

