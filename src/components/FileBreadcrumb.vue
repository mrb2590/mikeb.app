<template>
  <ul class="file-breadcrumb">
    <li v-if="folder">
      <md-button @click="openFolder(folder)">{{ folder.name }}</md-button>
      <FileBreadcrumb v-if="folder.all_parents" :folder="folder.all_parents" :openFolder="openFolder">
      </FileBreadcrumb>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'FileBreadcrumb',

  props: [ 'folder', 'openFolder' ]
}
</script>

<style lang="scss" scoped>
.file-breadcrumb {
  padding: 0;
  margin: 0;
  list-style: none;
  float: left;

  > *::after {
    content: "chevron_right";
    font-family: Material Icons;
    font-size: 1.3em;
    position: relative;
    top: 12px;
  }
}
</style>
