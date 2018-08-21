<template>
  <div id="app">
    <component :is="layout">
      <router-view :layout.sync="layout"/>
    </component>
  </div>
</template>

<script>
// import appConfig from '@src/app.config'

export default {
  name: 'App',

  mounted () {
    console.log(`ENV: ${process.env.NODE_ENV}`)
  },

  data () {
    return {
      // A default layout incase none are passed
      layout: 'div'
    }
  }
  // page: {
  //   // All subcomponent titles will be injected into this template.
  //   titleTemplate(title) {
  //     title = typeof title === 'function' ? title(this.$store) : title
  //     return title ? `${title} | ${appConfig.title}` : appConfig.title
  //   },
  // }
}
</script>

<!-- This should generally be the only global CSS in the app. -->
<style lang="scss">
// Allow element/type selectors, because this is global CSS.
// stylelint-disable selector-max-type, selector-class-pattern
// Normalize default styles across browsers,
// https://necolas.github.io/normalize.css/
@import '~normalize.css/normalize.css';
// Style loading bar between pages.
// https://github.com/rstacruz/nprogress
@import '~nprogress/nprogress.css';

// Vue Material Theme
@import '~vue-material/dist/vue-material.min.css';
@import "~vue-material/dist/theme/engine"; // Import the theme engine

// Default theme
@include md-register-theme("default", (
    primary: md-get-palette-color(blue, A200), // The primary color of your application
    accent: md-get-palette-color(green, A200) // The accent or secondary color
));

// Dark theme
@include md-register-theme("dark", (
    primary: md-get-palette-color(blue, A200), // The primary color of your application
    accent: md-get-palette-color(green, A200), // The accent or secondary color
    theme: dark
));

// Import themes
@import "~vue-material/dist/theme/all"; // Apply the theme

// Design variables and utilities from src/design.
@import './design/index';

html, body, #app {
  height: 100vh;
  width: 100%;
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.md-app {
  height: 100vh;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}
// ===
// Vendor
// ===
#nprogress .bar {
  background: $theme-secondary;
  top: 64px;
}
</style>
