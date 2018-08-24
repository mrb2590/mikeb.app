<template>
  <BaseLoader/>
</template>

<script>
import MainLayout from '@layouts/Main'

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
.wrapper {
  text-align: center;

  h1 {
    font-size: 1em;
  }
}
</style>
