<script setup lang="ts">
import { onBeforeUnmount, reactive } from 'vue'

const { levels, labels = ['L', 'R'] } = defineProps<{
  levels: number[]
  labels?: string[]
}>()

const minDb = -60
const maxDb = 0
const peakHoldMs = 1000
const decayPerSecond = 0.6

interface ChannelState {
  display: number
  peak: number
  peakSetAt: number
}

const channels = reactive<ChannelState[]>(levels.map(() => ({ display: 0, peak: 0, peakSetAt: 0 })))

function toNormalized(linear: number): number {
  if (linear <= 0) {
    return 0
  }
  const db = 20 * Math.log10(linear)
  return Math.min(1, Math.max(0, (db - minDb) / (maxDb - minDb)))
}

let lastFrame = performance.now()

function tick(now: number) {
  const elapsedSeconds = (now - lastFrame) / 1000
  lastFrame = now

  levels.forEach((linear, index) => {
    const target = toNormalized(linear)
    const channel = channels[index] ?? (channels[index] = { display: 0, peak: 0, peakSetAt: 0 })

    channel.display =
      target >= channel.display
        ? target
        : Math.max(target, channel.display - decayPerSecond * elapsedSeconds)

    if (channel.display >= channel.peak) {
      channel.peak = channel.display
      channel.peakSetAt = now
    } else if (now - channel.peakSetAt > peakHoldMs) {
      channel.peak = Math.max(channel.display, channel.peak - decayPerSecond * elapsedSeconds)
    }
  })

  rafId = requestAnimationFrame(tick)
}

let rafId = requestAnimationFrame(tick)

onBeforeUnmount(() => cancelAnimationFrame(rafId))
</script>

<template>
  <div class="meters">
    <div v-for="(channel, index) in channels" :key="index" class="meter">
      <span class="label">{{ labels[index] }}</span>
      <div class="track">
        <div class="unlit" :style="{ width: (1 - channel.display) * 100 + '%' }"></div>
        <div class="peak" :style="{ left: channel.peak * 100 + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.meters {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.meter {
  display: flex;
  gap: 16px;
  place-items: center;
}

.label {
  width: 1ch;
  font-size: 0.8rem;
  color: #cfd2d6;
}

.track {
  position: relative;
  width: 100%;
  height: 10px;
  border-radius: 15px;
  overflow: hidden;
  background: linear-gradient(to right, #3cb079 0%, #3cb079 70%, #e6d22e 88%, #d6432e 100%);
}

.unlit {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  background: #2a2d30;
}

.peak {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  transform: translateX(-1px);
  background: #f8f8f8;
}
</style>
