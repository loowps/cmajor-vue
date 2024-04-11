<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const isHome = computed(() => {
  return route.path === '/'
})
</script>

<template>
  <header>
    <a class="logo" href="https://github.com/loowps/cmajor-vue-js" target="_blank">
      <img alt="Vue logo" class="img" src="@/assets/logo.svg" width="30" height="30" />
      <span>Cmajor + VueJs</span>
    </a>
    <nav>
      <RouterLink to="/" v-if="!isHome">Home</RouterLink>
      <RouterLink to="/about" v-else>About</RouterLink>
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

header .wrapper {
  display: flex;
  place-items: flex-start;
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
  @media screen and (min-width: 265px) {
    margin-left: auto;
  }

  display: flex;
  text-align: left;
  font-size: 1rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
