<template>
  <div class="loading center-align-outer">
    <div class="center-align-inner">
      <div :class="$style.wrapper">
        <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  text-align: center;
}
</style>
