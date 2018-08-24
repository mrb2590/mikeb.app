<template>
  <div class="main-layout">
    <md-app md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <div class="md-toolbar-row">
          <div class="md-toolbar-section-start">
            <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
              <md-icon>menu</md-icon>
            </md-button>

            <span class="md-title">MikeB App</span>
          </div>

          <div class="md-toolbar-section-end">
            <md-button v-if="!loggedIn" to="/login">Sign In</md-button>
            <md-menu v-if="loggedIn" md-size="medium" md-align-trigger>
              <md-button class="md-icon-button" md-menu-trigger>
                <md-icon>account_circle</md-icon>
              </md-button>

              <md-menu-content>
                <md-menu-item to="/profile">
                  <!-- <md-icon>account_circle</md-icon> -->
                  Profile
                </md-menu-item>
                <md-menu-item to="/logout">
                  <!-- <md-icon>account_circle</md-icon> -->
                  Logout
                </md-menu-item>
              </md-menu-content>
            </md-menu>
          </div>
        </div>
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="menuVisible" class="md-scrollbar main-toolbar">
        <md-toolbar class="md-transparent toolbar-app-name" md-elevation="0">
          <AppName/>
        </md-toolbar>

        <md-list>
          <md-list-item @click="menuVisible = !menuVisible" to="/">
            <md-icon>home</md-icon>
            <span class="md-list-item-text">Home</span>
          </md-list-item>

          <md-list-item @click="menuVisible = !menuVisible" to="/files">
            <md-icon>file_copy</md-icon>
            <span class="md-list-item-text">Files</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content id="main-content">
        <slot/>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import AppName from '@components/AppName'
import { authComputed } from '@state/helpers'

export default {
  name: 'MainLayout',
  data: () => ({
    menuVisible: false
  }),

  computed: {
    ...authComputed
  },

  components: { AppName }
}
</script>

<style lang="scss">
.main-toolbar.md-drawer {
  width: 300px;

  .app-name {
    .md-avatar {
      font-size: 12px;
      width: 28px;
      min-width: 28px;
      height: 28px;
    }
  }
}
</style>
