<template>
  <div class="files">
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-100 block">
        <h1 class="md-headline">Files</h1>
      </div>
      <div class="md-layout md-layout-item md-size-10 md-large-size-20 md-medium-size-25 md-small-size-33 md-xsmall-size-100" v-for="(file, index) in files" v-bind:key="index">
        <div class="file-card">
          <md-card>
            <md-card-header>
              <div class="md-title">
                {{ file.original_filename }}
              </div>
              <div class="md-subhead">
                {{ file.extension }} - {{ file.size_readable }}
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
              <md-button class="md-icon-button md-raised md-primary" @click="download(file)">
                <md-icon>cloud_download</md-icon>
              </md-button>
              <a href="#" v-bind:id="`file_${file.id}`" class="hidden-file-download"></a>
            </md-card-actions>
          </md-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MainLayout from '@layouts/Main'
import { filesComputed, filesMethods } from '@state/helpers'

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

  computed: {
    ...filesComputed
  },

  methods: {
    ...filesMethods
  },

  mounted () {
    if (!this.files) {
      this.fetchFiles()
    }
  },

  created () {
    this.$emit('update:layout', MainLayout)
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
