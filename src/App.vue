<template>
  <div id="app">
    <component :is="layout">
      <router-view :layout.sync="layout"/>
    </component>
  </div>
</template>

<script>
import appConfig from './app.config'

export default {
  name: 'App',

  page: {
    // All subcomponent titles will be injected into this template.
    titleTemplate (title) {
      title = typeof title === 'function' ? title(this.$store) : title
      return title ? `${title} | ${appConfig.title}` : appConfig.title
    }
  },

  mounted () {
    this.$material.theming.theme = this.$store.state.settings.theme
  },

  data () {
    return {
      // A default layout incase none are passed
      layout: 'div'
    }
  }
}
</script>

<!-- This should generally be the only global CSS in the app. -->
<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic|Material+Icons");
@import '~normalize.css/normalize.css';
@import '~nprogress/nprogress.css';

// Vue Material Theme
@import "~vue-material/dist/theme/engine"; // Import the theme engine

// // Default theme
@include md-register-theme("default", (
    primary: md-get-palette-color(blue, A200), // The primary color of your application
    accent: md-get-palette-color(red, A200), // The accent or secondary color
    theme: light
));

// Dark theme
@include md-register-theme("dark", (
    primary: md-get-palette-color(green, A700), // The primary color of your application
    accent: md-get-palette-color(blue, A200), // The accent or secondary color
    theme: dark
));

// Import themes
@import "~vue-material/dist/theme/all"; // Apply the theme

// Design variables and utilities from src/design.
@import '@design';

html, body, #app {
  height: 100vh;
  width: 100%;
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: hidden
}
.md-app {
  height: 100vh;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.md-theme-dark input:-webkit-autofill {
    -webkit-text-fill-color: #303030 !important;
}

.md-app-content.md-theme-dark,
.md-app-scroller.md-theme-dark {
  background-color: darken(#424242, 4%) !important;
}

// ===
// Vendor
// ===
#nprogress .bar {
  background: $theme-secondary;
  top: 64px;
  z-index: 500;
}
</style>
