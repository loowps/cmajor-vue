<script setup lang="ts">
import { useParameterStore } from '@/stores/parameter'
import { storeToRefs } from 'pinia'
import { inject, onBeforeUnmount, onMounted, ref } from 'vue'
import type { PatchConnection } from '@/models/patch-connection.model'
import { PatchConnectionEndpoint } from '@/models/patch-connection-endpoints.enum'
import SliderComponent from '@/components/SliderComponent.vue'
import LevelMeterComponent from '@/components/LevelMeterComponent.vue'

const patchConnection = inject<PatchConnection>('patchConnection')

const parameterStore = useParameterStore()
const { gain } = storeToRefs(parameterStore)

const levels = ref<number[]>([0, 0])

function onGainChange(newValue: number) {
  parameterStore.setGain(newValue)
}

function onLevelChange(newLevels: number[]) {
  levels.value = newLevels
}

patchConnection?.addParameterListener(PatchConnectionEndpoint.Gain, onGainChange)
patchConnection?.addEndpointListener(PatchConnectionEndpoint.Level, onLevelChange)

onMounted(() => {
  patchConnection?.requestParameterValue(PatchConnectionEndpoint.Gain)
})

onBeforeUnmount(() => {
  endValueChange()
  patchConnection?.removeParameterListener(PatchConnectionEndpoint.Gain, onGainChange)
  patchConnection?.removeEndpointListener(PatchConnectionEndpoint.Level, onLevelChange)
})

let gestureIsOpen = false

function endValueChange() {
  if (!gestureIsOpen) {
    return
  }

  gestureIsOpen = false
  window.removeEventListener('pointerup', endValueChange)
  window.removeEventListener('pointercancel', endValueChange)
  patchConnection?.sendParameterGestureEnd(PatchConnectionEndpoint.Gain)
}

function beginValueChange(event: PointerEvent) {
  if (gestureIsOpen || event.detail === 2) {
    return
  }

  gestureIsOpen = true
  window.addEventListener('pointerup', endValueChange)
  window.addEventListener('pointercancel', endValueChange)
  patchConnection?.sendParameterGestureStart(PatchConnectionEndpoint.Gain)
}

let lastSentGain = -1

function onGainInput(newValue: number) {
  parameterStore.setGain(newValue)

  if (lastSentGain === newValue) {
    return
  }

  lastSentGain = newValue
  patchConnection?.sendEventOrValue(PatchConnectionEndpoint.Gain, newValue)
}
</script>

<template>
  <main>
    <SliderComponent
      :model-value="gain"
      label="Gain"
      @pointer-down="beginValueChange"
      @update:model-value="onGainInput"
    />
    <LevelMeterComponent :levels="levels" />
  </main>
</template>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 24px;
}
</style>
