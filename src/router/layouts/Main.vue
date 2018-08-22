<template>
  <div class="main-layout">
    <md-app md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title">MikeB App</span>
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="menuVisible" class="md-scrollbar">
        <md-toolbar class="md-transparent" md-elevation="0">
          Navigation
        </md-toolbar>

        <md-list>
          <md-list-item @click="menuVisible = !menuVisible" to="/">
            <md-icon>move_to_inbox</md-icon>
            <span class="md-list-item-text">Home</span>
          </md-list-item>

          <md-list-item @click="menuVisible = !menuVisible" to="/about">
            <md-icon>move_to_inbox</md-icon>
            <span class="md-list-item-text">About</span>
          </md-list-item>

          <md-list-item @click="menuVisible = !menuVisible" to="files">
              <md-icon>insert_drive_file</md-icon>
              <span class="md-list-item-text">Files</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content id="main-content">
        <transition
          name="bounce"
          enter-active-class="bounceInLeft"
          leave-active-class="bounceOutRight"
        >
          <slot/>
        </transition>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
export default {
  name: 'MainLayout',

  data: () => ({
    menuVisible: false
  })
}
</script>

<style lang="scss" module>

</style>
