import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginPage from '../LoginView.vue'

const mockLoginWithGoogle = vi.fn()
const mockLoginWithGithub = vi.fn()

vi.mock('@/composables/auth', () => ({
  useAuth: () => ({
    user: null,
    loginWithGoogle: mockLoginWithGoogle,
    loginWithGithub: mockLoginWithGithub,
    logout: vi.fn(),
  }),
}))

describe('LoginPage.vue', () => {
  const globalStubs = {
    global: {
      stubs: {
        UButton: {
          template: '<button @click="$emit(\'click\')"><slot /></button>',
        },
      },
    },
  }

  it('renders the login page elements correctly', () => {
    const wrapper = mount(LoginPage, globalStubs)

    expect(wrapper.text()).toContain('Sign in to SnipForge')
    expect(wrapper.text()).toContain('Access your snippets and boost your productivity.')
    expect(wrapper.text()).toContain('Continue with Google')
    expect(wrapper.text()).toContain('Continue with Github')
  })

  it('calls loginWithGoogle when the Google button is clicked', async () => {
    const wrapper = mount(LoginPage, globalStubs)

    const googleButton = wrapper
      .findAll('button')
      .find((btn) => btn.text().includes('Continue with Google'))
    await googleButton?.trigger('click')
    expect(mockLoginWithGoogle).toHaveBeenCalledTimes(1)
  })

  it('calls loginWithGithub when the Github button is clicked', async () => {
    const wrapper = mount(LoginPage, globalStubs)
    const githubButton = wrapper
      .findAll('button')
      .find((btn) => btn.text().includes('Continue with Github'))
    await githubButton?.trigger('click')
    expect(mockLoginWithGithub).toHaveBeenCalledTimes(1)
  })
})
