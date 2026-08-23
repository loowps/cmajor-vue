import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SliderComponent from '@/components/SliderComponent.vue'

function mountSlider(modelValue = 0.5) {
  return mount(SliderComponent, { props: { label: 'Gain', modelValue } })
}

describe('SliderComponent', () => {
  it('renders the given label', () => {
    expect(mountSlider().get('label').text()).toBe('Gain')
  })

  it('reflects the model value on the range input', () => {
    expect(mountSlider(0.25).get('input').element.value).toBe('0.25')
  })

  it('restricts the input to the normalised parameter range', () => {
    const input = mountSlider().get('input')

    expect(input.attributes('type')).toBe('range')
    expect(input.attributes('min')).toBe('0')
    expect(input.attributes('max')).toBe('1')
  })

  it('points its label at its own input', () => {
    const wrapper = mountSlider()

    expect(wrapper.get('label').attributes('for')).toBe(wrapper.get('input').attributes('id'))
  })

  it('gives sibling sliders distinct input ids', () => {
    const wrapper = mount({
      components: { SliderComponent },
      template: `
        <SliderComponent label="A" :model-value="0" />
        <SliderComponent label="B" :model-value="0" />
      `
    })

    const [first, second] = wrapper.findAll('input')

    expect(first.attributes('id')).not.toBe(second.attributes('id'))
  })

  it('emits pointerDown so the host can start an automation gesture', async () => {
    const wrapper = mountSlider()

    await wrapper.get('input').trigger('pointerdown')

    expect(wrapper.emitted('pointerDown')).toHaveLength(1)
  })

  it('updates the model with a number when the value is dragged', async () => {
    const wrapper = mountSlider()

    await wrapper.get('input').setValue('0.75')

    expect(wrapper.emitted('update:modelValue')).toEqual([[0.75]])
  })

  it('does not emit while the model is changed from outside', async () => {
    const wrapper = mountSlider()

    await wrapper.setProps({ modelValue: 0.9 })

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
