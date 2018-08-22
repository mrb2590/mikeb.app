<template>
  <div class="home">
    <div class="welcome">
      <h1 class="separator">
        <md-avatar class="md-avatar-icon md-primary">M</md-avatar>
        <md-avatar class="md-avatar-icon md-accent">I</md-avatar>
        <md-avatar class="md-avatar-icon">K</md-avatar>
        <md-avatar class="md-avatar-icon md-primary">E</md-avatar>
        <md-avatar class="md-avatar-icon md-accent">B</md-avatar>
        <md-avatar class="md-avatar-icon">.</md-avatar>
        <md-avatar class="md-avatar-icon md-primary">A</md-avatar>
        <md-avatar class="md-avatar-icon md-accent">P</md-avatar>
        <md-avatar class="md-avatar-icon">P</md-avatar>
      </h1>
    </div>
  </div>
</template>

<script>
import MainLayout from '@router/layouts/Main'

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

  created () {
    this.$emit('update:layout', MainLayout)
  }}
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  height: 100%;

  .welcome {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .separator {
    display: flex;
    width: 100%;
    max-width: 600px;
  }
}
</style>
