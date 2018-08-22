<template>
  <div class="loading">
    <div class="icon">
      <div class="icon-inner">
        <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
        <!-- <h1>Loading...</h1> -->
      </div>
    </div>
  </div>
</template>

<script>
import MainLayout from '@router/layouts/Main'

export default {
  name: 'Loading',

  page: {
    title: 'Loading...',
    meta: [
      {
        name: 'description',
        content: 'Loading...'
      }
    ]
  },

  created () {
    this.$emit('update:layout', MainLayout)
  }
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

    .icon-inner {
      text-align: center;

      h1 {
        font-size: 1em;
      }
    }
  }
</style>
