<template>
  <div class="files">
    <transition name="slide-fade">
      <BaseLoader v-if="!folder"/>
    </transition>
    <transition name="slide-fade">
      <div class="files-page" v-if="folder">
        <div class="files-sidebar">
          <md-content class="md-scrollbar">
            <FileBreadcrumb v-if="tree" :folder="tree" :openFolder="openFolder"></FileBreadcrumb>
            <div class="server-info">
              <div>Total Storage: {{ folder.server.storage.total.readable }}</div>
              <div>Used Storage: {{ folder.server.storage.used.readable }}</div>
              <div>Free Storage: {{ folder.server.storage.free.readable }}</div>
            </div>
          </md-content>
        </div>
        <div class="files-content">
          <md-toolbar md-elevation="0">
            <h3 class="md-title" style="flex: 1">{{ folder.name }}</h3>

            <div class="md-toolbar-section-end">
              <md-button class="md-icon-button md-raised md-primary"
                @click="backFolder"
                :disabled="!history.stack.length">
                <md-icon>chevron_left</md-icon>
              </md-button>

              <md-button class="md-icon-button md-raised md-primary"
                @click="forwardFolder"
                :disabled="!history.backStack.length">
                <md-icon>chevron_right</md-icon>
              </md-button>

              <md-button class="md-icon-button md-raised md-primary"
                @click="openFolder(folder.id, true, false, true)">
                <md-icon>refresh</md-icon>
              </md-button>

              <md-button class="md-icon-button md-raised md-primary"
                @click="upFolder()"
                :disabled="!folder.parent_id">
                <md-icon>expand_less</md-icon>
              </md-button>

              <md-button class="md-icon-button md-raised md-primary"
                @click="showAddFolderDialog = true">
                <md-icon>create_new_folder</md-icon>
              </md-button>
            </div>
          </md-toolbar>
          <md-content class="md-scrollbar">
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
                <File :file="childFile" v-for="(childFile, index) in folder.files" v-bind:key="index"/>
              </div>
            </div>
          </md-content>
        </div>
      </div>
    </transition>
    <AddFolderForm @showAddFolderDialog="setShowAddFolderDialog"/>
  </div>
</template>

<script>
import MainLayout from '@layouts/Main'
import FileBreadcrumb from '@components/FileBreadcrumb'
import AddFolderForm from '@components/AddFolderForm'
import File from '@components/File'
import {
  userComputed, foldersComputed, foldersMethods
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

  data: () => ({
    history: {
      stack: [],
      backStack: []
    },
    showAddFolderDialog: false
  }),

  components: { FileBreadcrumb, AddFolderForm, File },

  computed: {
    ...userComputed,
    ...foldersComputed
  },

  methods: {
    setShowAddFolderDialog (value) {
      this.showAddFolderDialog = value
    },
    ...foldersMethods,
    openFolder: function (folderId, pushToHistory = true, resetBackStack = false, force = false) {
      if (pushToHistory && folderId !== (this.folder || {}).id) {
        this.history.stack.push(folderId)
      }
      if (resetBackStack) {
        this.history.backStack = []
      }
      this.fetchFolder({
        folderId: folderId,
        force: force
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
    if (!this.folder) {
      this.openFolder(this.userProfile.folder_id)
    }
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

    .md-content {
      height: 100%;
      overflow: auto;
      position: relative;

      .server-info {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 10;
        background: inherit;
        padding: 16px;
        width: 100%;
      }
    }
  }

  .files-content {
    float: left;
    width: calc(100% - 300px);
    height: 100%;

    .md-content {
      height: calc(100% - 64px);
      overflow-y: auto;
    }

    .md-toolbar .md-button+.md-button {
      margin-right: 6px;
    }

    .md-toolbar .md-button:last-child {
      margin-right: 0;
    }
  }

  .md-headline {
    margin: 0;
  }

  .folders-area,
  .files-area {
    width: 99%;
    padding: 16px;
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

      .md-content {
        max-height: 300px;
      }
    }

    .files-content {
      float: none;
      width: 100%;
    }
  }
}
</style>
