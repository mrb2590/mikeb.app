<template>
  <h1 class="title">The page timed out while loading</h1>
</template>

<script>
import MainLayout from '@layouts/Main'

export default {
  name: 'Loading',

  page: {
    title: 'Page timeout',
    meta: [
      {
        name: 'description',
        content: 'The page timed out while loading.'
      }
    ]
  },

  created () {
    this.$emit('update:layout', MainLayout)
  }
}
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
}
</style>
