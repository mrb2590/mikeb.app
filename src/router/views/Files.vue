<template>
  <div class="files">
    <transition name="slide-fade">
      <BaseLoader v-if="!files || !folders"/>
    </transition>
    <transition name="slide-fade">
      <div class="files-page" v-if="files && folders">
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-size-100 block">
            <h1 class="md-headline">Files</h1>
            <div class="path-controls">
              <md-button class="md-icon-button" @click="backFolder">
                <md-icon>chevron_left</md-icon>
              </md-button>

              <md-button class="md-icon-button md-primary">
                <md-icon>chevron_right</md-icon>
              </md-button>

              <md-button class="md-icon-button" @click="openFolder(parents)">
                <md-icon>expand_less</md-icon>
              </md-button>
            </div>
          </div>
        </div>
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-size-100 block">
            <div class="breadcrumb">
              <FileBreadcrumb :folder="parents" :openFolder="openFolder"></FileBreadcrumb>
            </div>
          </div>
        </div>
        <div class="folders-area">
          <h2 class="md-subheading">Folders</h2>
          <div class="md-layout md-gutter">
            <div class="md-layout md-layout-item md-size-20 md-large-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100" v-for="(folder, index) in folders" v-bind:key="index">
              <div class="file-card" @dblclick="openFolder(folder)">
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
            <div class="md-layout md-layout-item md-size-20 md-large-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100" v-for="(file, index) in files" v-bind:key="index">
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
      historyStack: []
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
    openFolder: function (folder) {
      this.historyStack.push(Object.assign({}, folder))
      let params = {
        ownedById: this.userProfile.id,
        parentId: folder.id,
        folderId: folder.id,
        page: 1,
        limit: 25
      }
      this.fetchFiles(params)
      this.fetchFolders(params)
    },
    backFolder: function () {
      var folder = this.historyStack.pop()
      if (folder) {
        var params = {
          ownedById: this.userProfile.id,
          parentId: folder.id,
          page: 1,
          limit: 25
        }
        this.fetchFiles(params)
        this.fetchFolders(params)
      }
    },
    forwardFolder: function () {
      let folder = this.historyStack.pop()
      let params = {
        ownedById: this.userProfile.id,
        parentId: folder.id,
        page: 1,
        limit: 25
      }
      this.fetchFiles(params)
      this.fetchFolders(params)
    }
  },

  created () {
    this.$emit('update:layout', MainLayout)
    let params = {
      ownedById: this.userProfile.id,
      parentId: this.userProfile.folder_id,
      withParents: true,
      page: 1,
      limit: 25
    }
    this.fetchFiles(params)
    this.fetchFolders(params).then(() => {
      this.folder = this.folders[0]
    })
  }
}
</script>

<style lang="scss" scoped>
.files {
  height: 100%;

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

  ul {
    list-style: none;
    padding: 0;
  }
}
</style>
