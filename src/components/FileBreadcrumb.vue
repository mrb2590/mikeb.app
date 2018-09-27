<template>
  <md-list class="file-breadcrumb">
    <md-list-item v-if="folder">
      <div class="folder-name">
        <md-button class="md-icon-button md-dense md-primary" @click="expandFolder">
          <md-icon :class="{ expanded: isExpanded }">arrow_right</md-icon>
        </md-button>
        <md-icon class="folder-icon" v-if="$store.state.folder.folder.id === folder.id">folder_open</md-icon>
        <md-icon class="folder-icon" v-if="$store.state.folder.folder.id !== folder.id">folder</md-icon>
        <span class="md-list-item-text" @click="open(folder.id)">{{ folder.name }}</span>
      </div>

      <FileBreadcrumb v-for="(childFolder, index) in folder.children"
        :folder="childFolder"
        :openFolder="openFolder"
        v-bind:key="index"
        v-if="isExpanded">
      </FileBreadcrumb>
    </md-list-item>
  </md-list>
</template>

<script>
export default {
  name: 'FileBreadcrumb',

  props: [ 'folder', 'openFolder' ],

  data () {
    return {
      isExpanded: false
    }
  },

  methods: {
    open (folderId) {
      this.isExpanded = true
      this.openFolder(folderId, true, true)
    },
    expandFolder () {
      this.$store.dispatch('folder/fetchFolder', {
        folderId: this.folder.id,
        setCurrent: false
      })
      this.isExpanded = !this.isExpanded
    }
  }
}
</script>

<style lang="scss">
.file-breadcrumb {
  display: block;
  flex-flow: unset;
  padding: 0;
  margin: 0;
  height: 100%;

  .md-list-item-container {
    display: inline-flex;

    .md-list-item-content {
      display: inline-block;
      padding: 0 0 0 20px;
      min-height: auto;

      .folder-name {
        min-height: 24px;

        .md-button {
          margin: 0;

          .md-icon {
            transition: all .4s;
          }

          .md-icon.expanded {
            transform: rotate(90deg);
          }
        }

        .folder-icon {
          margin-right: 4px;
          position: relative;
          top: 4px;
        }

        .md-list-item-text {
          display: inline-block;
          vertical-align: middle;
          cursor: pointer;
          position: relative;
          top: 6px;
        }
      }
    }
  }
}

// .file-breadcrumb::before {
//   content: "";
//   position: absolute;
//   top: 30px;
//   left: 26px;
//   width: 1px;
//   background-color: var(--md-theme-default-accent, #ff5252);
//   height: calc(100% - 35px);
//   z-index: 3;
// }
</style>
