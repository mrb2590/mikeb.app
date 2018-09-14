<template>
  <md-list class="file-breadcrumb">
    <md-list-item v-if="folder">
      <div class="folder-name">
        <md-icon v-if="$store.state.folders.currentFolder.id === folder.id">folder_open</md-icon>
        <md-icon v-if="$store.state.folders.currentFolder.id !== folder.id">folder</md-icon>
        <span class="md-list-item-text" @click="openFolder(folder.id)">{{ folder.name }}</span>
      </div>

      <FileBreadcrumb v-for="(childFolder, index) in folder.all_children"
        :folder="childFolder"
        :openFolder="openFolder"
        v-bind:key="index">
      </FileBreadcrumb>
    </md-list-item>
  </md-list>
</template>

<script>
export default {
  name: 'FileBreadcrumb',

  props: [ 'folder', 'openFolder' ]
}
</script>

<style lang="scss">
.file-breadcrumb {
  display: block;
  flex-flow: unset;
  padding: 0;
  margin: 0;

  .md-list-item-container {
    display: inline-flex;

    .md-list-item-content {
      display: inline-block;
      padding-top: 6px;
      padding-bottom: 0;
      min-height: auto;

      .folder-name {
        min-height: 24px;

        .md-icon {
          margin-right: 4px;
        }

        .md-list-item-text {
          display: inline-block;
          vertical-align: middle;
          cursor: pointer;
        }
      }
    }
  }
}

.file-breadcrumb::before {
  content: "";
  position: absolute;
  top: 30px;
  left: 26px;
  width: 1px;
  background-color: var(--md-theme-default-accent, #ff5252);
  height: calc(100% - 35px);
  z-index: 3;
}
</style>
