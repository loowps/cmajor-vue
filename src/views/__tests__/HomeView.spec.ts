import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import HomeView from '@/views/HomeView.vue'
import { createStubPatchConnection } from '@/__tests__/patch-connection.stub'

let patchConnection: ReturnType<typeof createStubPatchConnection>
let wrapper: VueWrapper

function pressSlider(options: PointerEventInit = {}) {
  const slider = wrapper.get('input[type="range"]').element

  slider.dispatchEvent(new PointerEvent('pointerdown', { detail: 1, bubbles: true, ...options }))

  return nextTick()
}

function releasePointer(type: 'pointerup' | 'pointercancel' = 'pointerup') {
  window.dispatchEvent(new PointerEvent(type))
}

beforeEach(() => {
  patchConnection = createStubPatchConnection()
  wrapper = mount(HomeView, {
    global: {
      plugins: [createPinia()],
      provide: { patchConnection }
    }
  })
})

afterEach(() => {
  wrapper.unmount()
})

describe('HomeView automation gestures', () => {
  it.each(['mouse', 'touch', 'pen'])('opens a gesture for a %s drag', async (pointerType) => {
    await pressSlider({ pointerType })

    expect(patchConnection.sendParameterGestureStart).toHaveBeenCalledWith('gainParam')
  })

  it('closes the gesture when the pointer is released', async () => {
    await pressSlider()
    releasePointer()

    expect(patchConnection.sendParameterGestureEnd).toHaveBeenCalledWith('gainParam')
  })

  it('closes the gesture when a touch or pen drag is cancelled', async () => {
    await pressSlider({ pointerType: 'touch' })
    releasePointer('pointercancel')

    expect(patchConnection.sendParameterGestureEnd).toHaveBeenCalledWith('gainParam')
  })

  it('leaves double-clicks alone so they can reset the parameter', async () => {
    await pressSlider({ detail: 2 })

    expect(patchConnection.sendParameterGestureStart).not.toHaveBeenCalled()
  })

  it('opens only one gesture when a second pointer joins the drag', async () => {
    await pressSlider({ pointerType: 'touch' })
    await pressSlider({ pointerType: 'touch' })
    releasePointer()

    expect(patchConnection.sendParameterGestureStart).toHaveBeenCalledTimes(1)
    expect(patchConnection.sendParameterGestureEnd).toHaveBeenCalledTimes(1)
  })

  it('matches every start with an end across repeated drags', async () => {
    await pressSlider()
    releasePointer()
    await pressSlider()
    releasePointer()

    expect(patchConnection.sendParameterGestureStart).toHaveBeenCalledTimes(2)
    expect(patchConnection.sendParameterGestureEnd).toHaveBeenCalledTimes(2)
  })

  it('closes an open gesture when the view is torn down mid-drag', async () => {
    await pressSlider()
    wrapper.unmount()

    expect(patchConnection.sendParameterGestureEnd).toHaveBeenCalledTimes(1)
  })

  it('stops listening for pointer releases once the view is gone', async () => {
    await pressSlider()
    wrapper.unmount()
    releasePointer()

    expect(patchConnection.sendParameterGestureEnd).toHaveBeenCalledTimes(1)
  })
})
