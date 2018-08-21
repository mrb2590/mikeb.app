<template>
  <div class="404">
    <h1 class="title">
      404
      <span v-if="resource">
        {{ resource }}
      </span>
      Not Found
    </h1>
  </div>
</template>

<script>
import MainLayout from '../layouts/Main'

export default {
  name: 'Four0Four',

  created () {
    this.$emit('update:layout', MainLayout)
  },

  props: {
    resource: {
      type: String,
      default: ''
    }
  }
  // page: {
  //   title: '404',
  //   meta: [{ name: 'description', content: '404' }],
  // },
}
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
}
</style>
