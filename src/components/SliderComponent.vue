<script setup lang="ts">
import { computed, type ModelRef } from 'vue'

defineProps({
  label: String
})
const model: ModelRef<number> = defineModel({ required: true })

const emit = defineEmits<{
  mouseDown: [MouseEvent]
  valueChange: [number]
}>()

const value = computed(() => {
  return model.value * 100 + '%'
})

const onMouseDown = (evt: MouseEvent) => {
  emit('mouseDown', evt)
}

const onValueChange = (evt: any) => {
  emit('valueChange', evt.target?.value)
}
</script>

<template>
  <div class="slider-wrapper">
    <label for="slider">{{ label }}</label>
    <input
      id="slider"
      class="slider"
      type="range"
      min="0"
      max="1"
      v-model="model"
      step="0.0001"
      @mousedown="onMouseDown"
      @input="onValueChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.slider-wrapper {
  display: flex;
  gap: 16px;
  place-items: center;
}

.slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  outline: none;
  border-radius: 15px;
  height: 6px;
  background: linear-gradient(to right, #3cb079 v-bind('value'), #ccc v-bind('value'));
}

.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-runnable-track {
  height: 6px;
  border-radius: 16px;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 14px;
  width: 14px;
  background-color: #3caf78;
  border-radius: 50%;
  border: none;
  transition: 0.2s ease-in-out;
  transform: translateY(-30%);
}

.slider::-webkit-slider-thumb:hover {
  box-shadow: 0 0 0 6px rgba(0, 255, 119, 0.1);
  cursor: grab;
}

.slider:active::-webkit-slider-thumb {
  box-shadow: 0 0 0 8px rgba(0, 255, 102, 0.15);
  cursor: grabbing;
}
</style>
