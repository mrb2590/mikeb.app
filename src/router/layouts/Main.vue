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
            <md-menu v-if="loggedIn" md-align-trigger class="profile-menu">
              <md-button md-menu-trigger class="profile-btn">
                <span v-if="userProfile">{{ userProfile.first_name }}</span>
                <md-icon>account_circle</md-icon>
              </md-button>

              <md-menu-content>
                <md-menu-item to="/logout">
                  <md-icon>exit_to_app</md-icon>
                  <span>Logout</span>
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

        <md-list v-if="userProfile">
          <md-divider></md-divider>

          <md-list-item>
            <md-avatar class="md-avatar-icon md-large md-accent" to="/profile">
              {{ initials }}
            </md-avatar>

            <div class="md-list-item-text">
              <span>{{ fullName }}</span>
              <span>{{ userProfile.slug }}</span>
            </div>

            <md-button class="md-icon-button md-list-action">
              <md-icon class="md-primary">notifications_none</md-icon>
            </md-button>
          </md-list-item>

          <md-list-item @click="menuVisible = !menuVisible" to="/profile">
            <md-icon>person</md-icon>
            <span class="md-list-item-text">Profile</span>
          </md-list-item>

          <md-divider></md-divider>
        </md-list>

        <md-list>

          <md-list-item @click="menuVisible = !menuVisible" to="/">
            <md-icon>home</md-icon>
            <span class="md-list-item-text">Home</span>
          </md-list-item>

          <md-list-item @click="menuVisible = !menuVisible" to="/files">
            <md-icon>file_copy</md-icon>
            <span class="md-list-item-text">Files</span>
          </md-list-item>

          <md-list-item @click="menuVisible = !menuVisible" to="/chat">
            <md-icon>chat_bubble</md-icon>
            <span class="md-list-item-text">Chat</span>
          </md-list-item>

          <md-list-item to="/games">
            <md-icon>videogame_asset</md-icon>
            <span class="md-list-item-text">Games</span>
          </md-list-item>
        </md-list>

        <md-list>
          <md-divider></md-divider>

          <md-list-item class="md-no-proxy">
            <md-switch v-model="darkMode" class="md-primary"></md-switch>
            <span class="md-list-item-text">Dark Mode</span>
          </md-list-item>
        </md-list>

      </md-app-drawer>

      <md-app-content class="main-content">
        <transition name="slide-fade">
          <slot v-if="show"/>
        </transition>
      </md-app-content>
    </md-app>

    <md-snackbar :md-position="snackbarPosition" :md-duration="snackbarDuration" :md-active.sync="showSnackbar" md-persistent>
      <span>There was an error!</span>
      <md-button class="md-primary" @click="showSnackbar = false">Retry</md-button>
    </md-snackbar>
  </div>
</template>

<script>
import AppName from '@components/AppName'
import { authComputed, userComputed } from '@state/helpers'

export default {
  name: 'MainLayout',

  data: () => ({
    show: false, // For showing the animation on intial page load
    menuVisible: false,
    snackbarPosition: 'center',
    snackbarDuration: Infinity
  }),

  computed: {
    ...authComputed,
    ...userComputed,
    showSnackbar: {
      get () {
        return this.$store.state.app.showSnackbar
      },
      set (value) {
        this.$store.commit('app/showSnackbar', value)
        return value
      }
    },
    darkMode: {
      get () {
        return this.$store.state.settings.theme === 'dark'
      },
      set (value) {
        let theme = this.$material.theming.theme === 'dark' ? 'default' : 'dark'
        this.$material.theming.theme = theme
        this.$store.dispatch('settings/setTheme', theme)
        return !value
      }
    }
  },

  components: { AppName },

  mounted () {
    setTimeout(() => {
      this.show = true
    }, 1000)
  },

  beforeDestroy: () => {
    // Reset
    this.show = false
  }
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

#app  {
  .main-content {
    overflow-x: hidden;
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
}
</style>
