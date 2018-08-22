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
import MainLayout from '@router/layouts/Main'

export default {
  name: 'Four0Four',

  page: {
    title: '404',
    meta: [
      {
        name: 'description',
        content: 'Page not found.'
      }
    ]
  },

  created () {
    this.$emit('update:layout', MainLayout)
  },

  props: {
    resource: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
}
</style>
