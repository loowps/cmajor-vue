<template>
  <div class="about">
    <h3>About</h3>

    <p>A simple gain cmajor patch with Vue.js gui.</p>
    <br />
    <p>
      <button class="primary-button">
        <a href="https://github.com/SoundStacks/cmajor" target="_blank">cmajor on github</a>
      </button>
    </p>
  </div>
</template>

<style>
:host {
  display: block;
  width: 100%;
  height: 100%;
}

@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
