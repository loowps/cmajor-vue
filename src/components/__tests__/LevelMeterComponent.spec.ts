import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LevelMeterComponent from '@/components/LevelMeterComponent.vue'

function createFrameDriver() {
  let currentTime = 0
  let pendingFrame: { id: number; callback: FrameRequestCallback } | undefined
  let nextFrameId = 1

  vi.spyOn(performance, 'now').mockImplementation(() => currentTime)
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    pendingFrame = { id: nextFrameId, callback }
    return nextFrameId++
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => {
    if (pendingFrame?.id === id) {
      pendingFrame = undefined
    }
  })

  return {
    advance(milliseconds: number) {
      currentTime += milliseconds
      const frame = pendingFrame
      pendingFrame = undefined
      frame?.callback(currentTime)
    },
    get isRunning() {
      return pendingFrame !== undefined
    }
  }
}

let frames: ReturnType<typeof createFrameDriver>

beforeEach(() => {
  frames = createFrameDriver()
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('LevelMeterComponent', () => {
  it('renders one meter per channel with the default labels', () => {
    const wrapper = mount(LevelMeterComponent, { props: { levels: [0, 0] } })

    expect(wrapper.findAll('.meter')).toHaveLength(2)
    expect(wrapper.findAll('.label').map((label) => label.text())).toEqual(['L', 'R'])
  })

  it('renders custom labels', () => {
    const wrapper = mount(LevelMeterComponent, {
      props: { levels: [0], labels: ['M'] }
    })

    expect(wrapper.get('.label').text()).toBe('M')
  })

  it('shows no peak marker while the channels are silent', async () => {
    const wrapper = mount(LevelMeterComponent, { props: { levels: [0, 0] } })

    frames.advance(16)
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.peak')).toHaveLength(0)
  })

  it('raises a peak marker once a channel receives signal', async () => {
    const wrapper = mount(LevelMeterComponent, { props: { levels: [0.5, 0] } })

    frames.advance(16)
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.peak')).toHaveLength(1)
  })

  it('holds the peak briefly before letting it decay away', async () => {
    const wrapper = mount(LevelMeterComponent, { props: { levels: [0.5] } })

    frames.advance(16)
    await wrapper.setProps({ levels: [0] })

    frames.advance(500)
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.peak')).toHaveLength(1)

    frames.advance(3000)
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.peak')).toHaveLength(0)
  })

  it('latches a clip indicator when a channel reaches full scale', async () => {
    const wrapper = mount(LevelMeterComponent, { props: { levels: [1, 0.5] } })

    frames.advance(16)
    await wrapper.vm.$nextTick()

    const indicators = wrapper.findAll('.clip-indicator')
    expect(indicators[0].classes()).toContain('active')
    expect(indicators[1].classes()).not.toContain('active')
  })

  it('keeps the clip indicator latched after the level drops', async () => {
    const wrapper = mount(LevelMeterComponent, { props: { levels: [1] } })

    frames.advance(16)
    await wrapper.setProps({ levels: [0] })

    frames.advance(3000)
    await wrapper.vm.$nextTick()

    expect(wrapper.get('.clip-indicator').classes()).toContain('active')
  })

  it('clears latched clips when the meters are clicked', async () => {
    const wrapper = mount(LevelMeterComponent, { props: { levels: [1] } })

    frames.advance(16)
    await wrapper.get('.meters').trigger('click')

    expect(wrapper.get('.clip-indicator').classes()).not.toContain('active')
  })

  it('stops its animation frame loop when unmounted', () => {
    const wrapper = mount(LevelMeterComponent, { props: { levels: [0.5] } })

    frames.advance(16)
    expect(frames.isRunning).toBe(true)

    wrapper.unmount()

    expect(frames.isRunning).toBe(false)
  })
})
