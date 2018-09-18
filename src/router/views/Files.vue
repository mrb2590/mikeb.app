<template>
  <div class="files">
    <transition name="slide-fade">
      <BaseLoader v-if="!folder"/>
    </transition>
    <transition name="slide-fade">
      <div class="files-page" v-if="folder">
        <div class="files-sidebar">
          <FileBreadcrumb v-if="tree" :folder="tree" :openFolder="openFolder"></FileBreadcrumb>
        </div>
        <div class="files-content">
          <div class="md-layout md-gutter files-layout">
            <div class="md-layout-item md-size-100 block">
              <div class="path-controls">
                <md-button class="md-icon-button md-raised md-primary" @click="backFolder">
                  <md-icon>chevron_left</md-icon>
                </md-button>

                <md-button class="md-icon-button md-raised md-primary"
                  @click="forwardFolder">
                  <md-icon>chevron_right</md-icon>
                </md-button>

                <md-button class="md-icon-button md-raised md-primary"
                  @click="upFolder()">
                  <md-icon>expand_less</md-icon>
                </md-button>
              </div>
            </div>
          </div>
          <div class="folders-area">
            <h2 class="md-subheading">Folders in {{ folder.name }}</h2>
            <div class="md-layout md-gutter">
              <div class="md-layout md-layout-item md-size-25 md-large-size-33 md-medium-size-50 md-small-size-100 md-xsmall-size-100" v-for="(childFolder, index) in folder.children" v-bind:key="index">
                <div class="file-card" @dblclick="openFolder(childFolder.id, true, true)">
                  <md-card>
                    <md-card-header>
                      <div class="md-title">
                        <md-avatar class="md-avatar-icon md-large">
                          <md-icon>folder</md-icon>
                        </md-avatar>
                        {{ childFolder.name }}
                      </div>
                      <div class="md-subhead">
                        Folder
                      </div>
                    </md-card-header>

                    <md-card-content>
                      <ul class="md-block-1 info">
                        <li>Created by {{ childFolder.created_by.first_name }} {{ childFolder.created_by.last_name }}</li>
                        <li>Owned by {{ childFolder.owned_by.first_name }} {{ childFolder.owned_by.last_name }}</li>
                        <li>Created {{ formattedDates(childFolder).created_at }}</li>
                        <li>Last Modified {{ formattedDates(childFolder).updated_at }}</li>
                      </ul>
                    </md-card-content>

                    <md-card-actions>
                      <md-button class="md-icon-button md-raised md-accent" @click="downloadFolder(childFolder)">
                        <md-icon>cloud_download</md-icon>
                      </md-button>
                      <a href="#" v-bind:id="`folder_${childFolder.id}`" class="hidden-file-download"></a>
                    </md-card-actions>
                  </md-card>
                </div>
              </div>
            </div>
          </div>
          <div class="files-area">
            <h2 class="md-subheading">Files in {{ folder.name }}</h2>
            <div class="md-layout md-gutter">
              <div class="md-layout md-layout-item md-size-25 md-large-size-33 md-medium-size-50 md-small-size-100 md-xsmall-size-100" v-for="(childFile, index) in folder.files" v-bind:key="index">
                <div class="file-card">
                  <md-card>
                    <md-card-header>
                      <div class="md-title">
                        <md-avatar class="md-avatar-icon md-large">
                          <md-icon>insert_drive_file</md-icon>
                        </md-avatar>
                        {{ childFile.display_filename }}
                      </div>
                      <div class="md-subhead">
                        {{ childFile.extension.toUpperCase() }} File - {{ childFile.size_readable }}
                      </div>
                    </md-card-header>

                    <md-card-content>
                      <ul class="md-block-1 info">
                        <li>Created by {{ childFile.created_by.first_name }} {{ childFile.created_by.last_name }}</li>
                        <li>Owned by {{ childFile.owned_by.first_name }} {{ childFile.owned_by.last_name }}</li>
                        <li>Uploaded {{ formattedDates(childFile).created_at }}</li>
                        <li>Last Modified {{ formattedDates(childFile).updated_at }}</li>
                      </ul>
                    </md-card-content>

                    <md-card-actions>
                      <md-button class="md-icon-button md-raised md-accent" @click="downloadFile(childFile)">
                        <md-icon>cloud_download</md-icon>
                      </md-button>
                      <a href="#" v-bind:id="`file_${childFile.id}`" class="hidden-file-download"></a>
                    </md-card-actions>
                  </md-card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import MainLayout from '@layouts/Main'
import FileBreadcrumb from '@components/FileBreadcrumb'
import {
  userComputed, foldersComputed, foldersMethods, filesMethods
} from '@state/helpers'

export default {
  name: 'Files',

  page: {
    title: 'Files',
    meta: [
      {
        name: 'description',
        content: 'User files.'
      }
    ]
  },

  data () {
    return {
      history: {
        stack: [],
        backStack: []
      }
    }
  },

  components: { FileBreadcrumb },

  computed: {
    ...userComputed,
    ...foldersComputed
  },

  methods: {
    ...foldersMethods,
    ...filesMethods,
    openFolder: function (folderId, pushToHistory = true, resetBackStack = false) {
      if (pushToHistory && folderId !== (this.folder || {}).id) {
        this.history.stack.push(folderId)
      }
      if (resetBackStack) {
        this.history.backStack = []
      }
      this.fetchFolder({
        folderId: folderId
      })
    },
    backFolder: function () {
      if (this.history.stack.length <= 1) {
        return
      }
      this.history.backStack.push(this.history.stack.pop())
      let folderId = this.history.stack[this.history.stack.length - 1]
      this.openFolder(folderId, false)
    },
    forwardFolder: function () {
      if (this.history.backStack.length <= 1) {
        return
      }
      this.history.stack.push(this.history.backStack.pop())
      let folderId = this.history.backStack[this.history.backStack.length - 1]
      this.openFolder(folderId, false)
    },
    upFolder: function () {
      if (this.folder.parent_id) {
        this.openFolder(this.folder.parent_id)
      }
    }
  },

  created () {
    this.$emit('update:layout', MainLayout)
    this.openFolder(this.userProfile.folder_id)
  }
}
</script>

<style lang="scss" scoped>
.files {
  height: 100%;

  .files-page {
    width: 100%;
    height: 100%;
  }

  .files-sidebar {
    width: 284px;
    margin-right: 16px;
    float: left;
    height: 100%;

    > .file-breadcrumb {
      padding-top: 8px;
      padding-bottom: 8px;
    }
  }

  .files-content {
    float: left;
    width: calc(100% - 300px);
    height: 100%;
  }

  .md-headline {
    margin: 0;
  }

  .block {
    margin-bottom: 24px;
  }

  .folders-area,
  .files-area {
    min-height: 343px;
  }

  .file-card {
    width: 100%;
    margin-bottom: 20px;

    ul {
      list-style: none;
      padding: 0;
    }

    .md-card {
      margin: 0;
      width: 100%;

      > .loading {
        height: 200px;
      }

      .info {
        margin-top: 20px;
      }

      .hidden-file-download {
        display: none !important;
      }
    }
  }
}

@media (max-width: 600px) {
  .files {
    height: 100%;

    .files-sidebar {
      width: 100%;
      float: none;
      height: auto;
      padding-bottom: 16px;
    }

    .files-content {
      float: none;
      width: 100%;
    }
  }
}
</style>
