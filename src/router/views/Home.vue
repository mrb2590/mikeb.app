<template>
  <div class="home center-align-outer">
    <div class="center-align-inner">
      <AppName/>
    </div>
  </div>
</template>

<script>
import MainLayout from '@layouts/Main'
import AppName from '@components/AppName'

export default {
  name: 'Home',

  page: {
    title: 'Home',
    meta: [
      {
        name: 'description',
        content: 'Homepage of MikeB app.'
      }
    ]
  },

  components: { AppName },

  created () {
    this.$emit('update:layout', MainLayout)
  }}
</script>

<style lang="scss" scoped>
.home {
  .separator {
    display: flex;
    width: 100%;
    max-width: 600px;
  }
}
</style>
