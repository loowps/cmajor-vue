<script setup lang="ts">
import { useParameterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'
import { inject, onMounted } from 'vue'
import type { PatchConnection } from '@/models/patch-connection.model'
import { PatchConnectionEndpoint } from '@/models/patch-connection-endpoints.enum'
import SliderComponent from '@/components/SliderComponent.vue'

const patchConnection = inject<PatchConnection>('patchConnection')

const { gain } = storeToRefs(useParameterStore())
const { setGain } = useParameterStore()

patchConnection?.addParameterListener(PatchConnectionEndpoint.Gain, (newValue: number) => {
  setGain(newValue)
})

onMounted(() => {
  patchConnection?.requestParameterValue(PatchConnectionEndpoint.Gain)
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

function onMouseDown(event: any) {
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
      label="Gain"
      v-model="gain"
      @mouse-down="onMouseDown"
      @value-change="onValueChange"
    />
  </main>
</template>

<style scoped lang="scss">
main {
  padding: 24px;
}
</style>
