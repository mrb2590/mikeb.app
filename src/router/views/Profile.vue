<template>
  <div class="profile center-align-outer">
    <div class="center-align-inner">
      <span>your access token type is {{ user.token.token_type }}</span>
    </div>
  </div>
</template>

<script>
import MainLayout from '@layouts/Main'

export default {
  name: 'Profile',

  page: {
    title: 'Profile',
    meta: [
      {
        name: 'description',
        content: 'User profile.'
      }
    ]
  },

  props: {
    user: {
      type: Object,
      required: true,
    },
  },

  created () {
    this.$emit('update:layout', MainLayout)
  }}
</script>

<style lang="scss" scoped>

</style>
