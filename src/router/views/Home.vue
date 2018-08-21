<template>
  <div class="home">
    <h1>Home Page</h1>
<!--     <img
      src="../../../src/assets/logo.png"
      alt="Logo"
    > -->
  </div>
</template>

<script>
import MainLayout from '../layouts/Main'

export default {
  name: 'Home',

  created () {
    this.$emit('update:layout', MainLayout)
  }
  // page: {
  //   title: 'Home',
  //   meta: [{ name: 'description', content: appConfig.description }],
  // },
}
</script>
