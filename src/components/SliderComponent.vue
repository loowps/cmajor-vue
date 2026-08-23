<script setup lang="ts">
import { computed, useId } from 'vue'

const { label = '' } = defineProps<{
  label?: string
}>()

const model = defineModel<number>({ required: true })

const emit = defineEmits<{
  pointerDown: [PointerEvent]
}>()

const sliderId = useId()

const filledWidth = computed(() => model.value * 100 + '%')
</script>

<template>
  <div class="slider-wrapper">
    <label :for="sliderId">{{ label }}</label>
    <input
      :id="sliderId"
      v-model.number="model"
      class="slider"
      type="range"
      min="0"
      max="1"
      step="0.0001"
      @pointerdown="emit('pointerDown', $event)"
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
  background: linear-gradient(to right, #3cb079 v-bind('filledWidth'), #ccc v-bind('filledWidth'));
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
