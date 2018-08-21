<template>
  <div class="loading">
    <div class="icon">
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </div>
  </div>
</template>

<script>
import MainLayout from '../layouts/Main'

export default {
  name: 'Loading',

  created () {
    this.$emit('update:layout', MainLayout)
  }

  // page: {
  //   title: 'Loading page...',
  //   meta: [{ name: 'description', content: 'Loading page...' }],
  // },
}
</script>

<style lang="scss" scoped>
  .loading {
    display: flex;
    height: 100%;

    .icon {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
