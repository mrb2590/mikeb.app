<template>
  <div class="md-layout md-layout-item md-size-25 md-large-size-33 md-medium-size-50 md-small-size-100 md-xsmall-size-100">
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
            <li>Uploaded {{ formatDate(file.created_at) }}</li>
            <li>Last Modified {{ formatDate(file.updated_at) }}</li>
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
</template>

<script>
import { folderComputed, folderMethods } from '@state/helpers'

export default {
  name: 'File',

  props: [ 'file' ],

  computed: {
    ...folderComputed
  },

  methods: {
    ...folderMethods
  }
}
</script>

<style lang="scss">
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
</style>
