<template>
  <Layout>
    <h1 :class="$style.title">
      The page timed out while loading
    </h1>
  </Layout>
</template>

<script>
import MainLayout from '../layouts/Main'

export default {
  name: 'Loading',

  created () {
    this.$emit('update:layout', MainLayout)
  }

  // page: {
  //   title: 'Page timeout',
  //   meta: [
  //     { name: 'description', content: 'The page timed out while loading.' },
  //   ],
  // },
}
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
}
</style>
