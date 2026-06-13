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
  clipped: boolean
}

const channels = reactive<ChannelState[]>(
  levels.map(() => ({ display: 0, peak: 0, peakSetAt: 0, clipped: false }))
)

function toNormalized(linear: number): number {
  if (linear <= 0) return 0
  const db = 20 * Math.log10(linear)
  return Math.min(1, Math.max(0, (db - minDb) / (maxDb - minDb)))
}

let lastFrame = performance.now()

function tick(now: number) {
  const elapsedSeconds = (now - lastFrame) / 1000
  lastFrame = now

  levels.forEach((linear, index) => {
    const target = toNormalized(linear)
    const channel =
      channels[index] ?? (channels[index] = { display: 0, peak: 0, peakSetAt: 0, clipped: false })

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

    if (linear >= 1.0) channel.clipped = true
  })

  rafId = requestAnimationFrame(tick)
}

let rafId = requestAnimationFrame(tick)

onBeforeUnmount(() => cancelAnimationFrame(rafId))

function clearAllClips() {
  channels.forEach((channel) => (channel.clipped = false))
}
</script>

<template>
  <div class="meters" @click="clearAllClips">
    <div v-for="(channel, index) in channels" :key="index" class="meter">
      <span class="label">{{ labels[index] }}</span>
      <div class="track">
        <div class="unlit" :style="{ width: `calc(${(1 - channel.display) * 100}% + ${channel.display * 14}px)` }"></div>
        <div
          v-if="channel.peak > 0"
          class="peak"
          :style="{ left: `min(calc(100% - 16px), ${channel.peak * 100}%)` }"
        ></div>
        <div class="clip-indicator" :class="{ active: channel.clipped }"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.meters {
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
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
  flex: 1;
  height: 10px;
  border-radius: 15px;
  overflow: hidden;
  background:
    linear-gradient(#2a2d30, #2a2d30) right / 14px 100% no-repeat,
    linear-gradient(to right, #3cb079 0%, #3cb079 70%, #e6d22e 88%, #d6432e 100%);
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
  z-index: 1;
}

.clip-indicator {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 14px;
  z-index: 2;
  background: #2a2d30;
  transition: background-color 150ms ease;

  &.active {
    background: #ff3520;
  }
}
</style>
