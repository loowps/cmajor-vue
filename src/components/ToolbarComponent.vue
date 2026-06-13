<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

const isHome = computed(() => route.path === '/')

function navigate() {
  router.push(isHome.value ? '/about' : '/')
}
</script>

<template>
  <header>
    <a class="logo" href="https://github.com/loowps/cmajor-vue" target="_blank">
      <img alt="Vue logo" class="img" src="@/assets/logo.svg" width="30" height="30" />
      <span>Cmajor + VueJs</span>
    </a>
    <nav>
      <button class="nav-button" @click="navigate">
        {{ isHome ? 'About' : 'Home' }}
      </button>
    </nav>
  </header>
</template>

<style scoped lang="scss">
header {
  line-height: 1.5;
  padding: 16px;
  background-color: #dedfe3;
  display: flex;
  place-items: center;
  flex-wrap: wrap;
}

.logo {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  place-items: center;
  color: #1f1f1f;
  text-decoration: none;
  transition: transform 50ms ease-in-out;
  transform-origin: center center;

  &:hover {
    transform: scaleX(1.05) scaleY(1.05);
  }
}

.img {
  display: block;
}

nav {
  margin-left: auto;
}

.nav-button {
  padding: 4px 10px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  background: transparent;
  color: #555a61;
  font-size: 0.78rem;
  font-weight: 400;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition:
    background-color 100ms ease,
    border-color 100ms ease;

  &:hover {
    background: rgba(0, 0, 0, 0.06);
    border-color: rgba(0, 0, 0, 0.25);
  }

  &:active {
    background: rgba(0, 0, 0, 0.1);
  }
}
</style>
