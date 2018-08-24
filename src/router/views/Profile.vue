<template>
  <div class="profile">
    <BaseLoader v-if="!userProfile"/>
    <div class="center-align-outer" v-if="userProfile">
      <div class="center-align-inner">
        <span>email: {{ userProfile.email }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import MainLayout from '@layouts/Main'
import { userComputed } from '@state/helpers'

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

  computed: {
    ...userComputed
  },

  created () {
    this.$emit('update:layout', MainLayout)
  }}
</script>

<style lang="scss" scoped>
.profile {
  height: 100%;
}
</style>
