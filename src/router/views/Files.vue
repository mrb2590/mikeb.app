<template>
  <div class="files">
    <transition name="slide-fade">
      <BaseLoader v-if="!files || !folders"/>
    </transition>
    <transition name="slide-fade">
      <div class="files-page" v-if="files && folders">
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
                  @click="backFolder">
                  <md-icon>chevron_right</md-icon>
                </md-button>

                <md-button class="md-icon-button md-raised md-primary"
                  @click="openFolder(currentFolder.parent_id)">
                  <md-icon>expand_less</md-icon>
                </md-button>
              </div>
            </div>
          </div>
          <div class="folders-area">
            <h2 class="md-subheading">Folders</h2>
            <div class="md-layout md-gutter">
              <div class="md-layout md-layout-item md-size-25 md-large-size-33 md-medium-size-50 md-small-size-100 md-xsmall-size-100" v-for="(folder, index) in folders" v-bind:key="index">
                <div class="file-card" @dblclick="openFolder(folder.id)">
                  <md-card>
                    <md-card-header>
                      <div class="md-title">
                        <md-avatar class="md-avatar-icon md-large">
                          <md-icon>folder</md-icon>
                        </md-avatar>
                        {{ folder.name }}
                      </div>
                      <div class="md-subhead">
                        Folder
                      </div>
                    </md-card-header>

                    <md-card-content>
                      <ul class="md-block-1 info">
                        <li>Created by {{ folder.created_by.first_name }} {{ folder.created_by.last_name }}</li>
                        <li>Owned by {{ folder.owned_by.first_name }} {{ folder.owned_by.last_name }}</li>
                        <li>Created {{ formattedDates(folder).created_at }}</li>
                        <li>Last Modified {{ formattedDates(folder).updated_at }}</li>
                      </ul>
                    </md-card-content>

                    <md-card-actions>
                      <md-button class="md-icon-button md-raised md-accent" @click="downloadFolder(folder)">
                        <md-icon>cloud_download</md-icon>
                      </md-button>
                      <a href="#" v-bind:id="`folder_${folder.id}`" class="hidden-file-download"></a>
                    </md-card-actions>
                  </md-card>
                </div>
              </div>
            </div>
          </div>
          <div class="files-area">
            <h2 class="md-subheading">Files</h2>
            <div class="md-layout md-gutter">
              <div class="md-layout md-layout-item md-size-25 md-large-size-33 md-medium-size-50 md-small-size-100 md-xsmall-size-100" v-for="(file, index) in files" v-bind:key="index">
                <div class="file-card">
                  <md-card>
                    <md-card-header>
                      <div class="md-title">
                        <md-avatar class="md-avatar-icon md-large">
                          <md-icon>insert_drive_file</md-icon>
                        </md-avatar>
                        {{ file.display_filename }}
                      </div>
                      <div class="md-subhead">
                        {{ file.extension.toUpperCase() }} File - {{ file.size_readable }}
                      </div>
                    </md-card-header>

                    <md-card-content>
                      <ul class="md-block-1 info">
                        <li>Created by {{ file.created_by.first_name }} {{ file.created_by.last_name }}</li>
                        <li>Owned by {{ file.owned_by.first_name }} {{ file.owned_by.last_name }}</li>
                        <li>Uploaded {{ formattedDates(file).created_at }}</li>
                        <li>Last Modified {{ formattedDates(file).updated_at }}</li>
                      </ul>
                    </md-card-content>

                    <md-card-actions>
                      <md-button class="md-icon-button md-raised md-accent" @click="downloadFile(file)">
                        <md-icon>cloud_download</md-icon>
                      </md-button>
                      <a href="#" v-bind:id="`file_${file.id}`" class="hidden-file-download"></a>
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
  userComputed, foldersComputed, foldersMethods, filesComputed, filesMethods
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
        position: 0
      }
    }
  },

  components: { FileBreadcrumb },

  computed: {
    ...userComputed,
    ...filesComputed,
    ...foldersComputed
  },

  methods: {
    ...filesMethods,
    ...foldersMethods,
    openFolder: function (folderId, pushToHistory = true) {
      if (!folderId) return
      if (pushToHistory && folderId !== this.currentFolder.id) {
        this.history.stack.push(folderId)
      }
      let params = {
        ownedById: this.userProfile.id,
        parentId: folderId,
        folderId: folderId,
        page: 1,
        limit: 25
      }
      this.fetchFolder({
        folderId: folderId,
        setCurrent: true
      })
      this.fetchFiles(params)
      this.fetchFolders(params)
    },
    backFolder: function () {
      if (this.history.stack.length === 1) {
        return
      }
      this.history.stack.pop()
      let folderId = this.history.stack[this.history.stack.length - 1]
      this.openFolder(folderId, false)
    },
    forwardFolder: function () {
    },
    upFolder: function () {
      if (this.parents) {
        return
      }
      this.history.stack.pop()
      let folderId = this.history.stack[this.history.stack.length - 1]
      this.openFolder(folderId, false)
    }
  },

  created () {
    this.$emit('update:layout', MainLayout)
    let params = {
      ownedById: this.userProfile.id,
      parentId: this.userProfile.folder_id,
      page: 1,
      limit: 25
    }
    this.fetchTree(this.userProfile.folder_id)
    this.fetchFolder({
      folderId: this.userProfile.folder_id,
      setCurrent: true
    })
    this.fetchFiles(params)
    this.fetchFolders(params).then(() => {
      this.history.stack.push(this.userProfile.folder_id)
    })
  }
}
</script>

<style lang="scss" scoped>
.files {
  height: 100%;

  .files-sidebar {
    width: 285px;
    margin-right: 15px;
    float: left;
  }

  .files-content {
    float: left;
    width: calc(100% - 300px);
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
    }

    .files-content {
      float: none;
      width: 100%;
    }
  }
}
</style>
