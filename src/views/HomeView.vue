<script setup lang="ts">
import { useParameterStore } from '@/stores/parameter'
import { storeToRefs } from 'pinia'
import { inject, onBeforeUnmount, onMounted, ref } from 'vue'
import type { PatchConnection } from '@/models/patch-connection.model'
import { PatchConnectionEndpoint } from '@/models/patch-connection-endpoints.enum'
import SliderComponent from '@/components/SliderComponent.vue'
import LevelMeterComponent from '@/components/LevelMeterComponent.vue'

const patchConnection = inject<PatchConnection>('patchConnection')

const { gain } = storeToRefs(useParameterStore())
const { setGain } = useParameterStore()

const levels = ref<number[]>([0, 0])

patchConnection?.addParameterListener(PatchConnectionEndpoint.Gain, (newValue: number) => {
  setGain(newValue)
})

function onLevelChange(newLevels: number[]) {
  levels.value = newLevels
}

patchConnection?.addEndpointListener(PatchConnectionEndpoint.Level, onLevelChange)

onMounted(() => {
  patchConnection?.requestParameterValue(PatchConnectionEndpoint.Gain)
})

onBeforeUnmount(() => {
  patchConnection?.removeEndpointListener(PatchConnectionEndpoint.Level, onLevelChange)
})

function beginValueChange() {
  patchConnection?.sendParameterGestureStart(PatchConnectionEndpoint.Gain)
}

function endValueChange() {
  patchConnection?.sendParameterGestureEnd(PatchConnectionEndpoint.Gain)
}

function onMouseUp() {
  window.removeEventListener('pointerup', onMouseUp)
  endValueChange()
}

function onMouseDown(event: MouseEvent) {
  if (event.detail === 2) {
    return
  }
  beginValueChange()
  window.addEventListener('pointerup', onMouseUp)
}

let prevValue = -1
const onValueChange = (newValue: number) => {
  if (prevValue !== newValue) {
    prevValue = newValue
    patchConnection?.sendEventOrValue(PatchConnectionEndpoint.Gain, newValue)
  }
}
</script>

<template>
  <main>
    <SliderComponent
      v-model="gain"
      label="Gain"
      @mouse-down="onMouseDown"
      @value-change="onValueChange"
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
