<script setup lang="ts">
import { RouterView } from 'vue-router'
import ToolbarComponent from '@/components/ToolbarComponent.vue'
import pkg from '../package.json'
</script>

<template>
  <div class="layout">
    <ToolbarComponent />

    <div class="main">
      <RouterView v-slot="{ Component }">
        <transition name="slide-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </div>

    <footer>v{{ pkg.version }}</footer>
  </div>
</template>

<style>
body {
  background-color: #474b50;
  color: #ffffff;
}

.primary-button {
  background-color: #379a70;
  border-radius: 3px;
  padding: 6px;
  border: 0 none;
  color: #f8f8f8;
  cursor: pointer;
  font-weight: bold;
  transition:
    background-color,
    color 75ms ease;

  a {
    color: inherit;
    font-weight: normal;
    text-decoration: none;
  }

  &:active {
    background-color: #2d855d !important;
    color: #dcdcdc !important;
  }

  &:hover:not(:active) {
    background-color: #3cb17a;
    color: white;
  }
}
</style>

<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.2s ease-in-out;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: scale(0.8);
  opacity: 0;
}

.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

footer {
  padding: 4px 12px;
  background-color: #2e3135;
  color: #6e7278;
  font-size: 0.7rem;
  text-align: right;
  user-select: none;
}
</style>
