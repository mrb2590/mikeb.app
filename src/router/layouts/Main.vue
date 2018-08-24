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

          <div class="md-toolbar-section-end right-navbar">
            <md-button v-if="!loggedIn" to="/login">Sign In</md-button>
            <md-menu v-if="loggedIn" md-size="medium" md-align-trigger class="profile-menu">
              <md-button md-menu-trigger class="profile-btn">
                <span v-if="userProfile">{{ userProfile.first_name }}</span>
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

      <md-app-drawer :md-active.sync="menuVisible" class="md-scrollbar main-sidebar">
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
import { authComputed, userComputed } from '@state/helpers'

export default {
  name: 'MainLayout',
  data: () => ({
    menuVisible: false
  }),

  computed: {
    ...authComputed,
    ...userComputed
  },

  components: { AppName }
}
</script>

<style lang="scss">
.right-navbar {
  .profile-btn {
    span {
      margin-right: 10px;
      text-transform: none;
    }
  }
}
.main-sidebar {
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
