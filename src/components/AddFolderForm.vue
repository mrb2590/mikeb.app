<template>
  <div class="md-layout md-layout-item md-size-25 md-large-size-33 md-medium-size-50 md-small-size-100 md-xsmall-size-100">
    <div class="file-card">
      <form class="add-folder-form" novalidate @submit.prevent="validateForm">
        <md-card>
          <md-card-header>
            <div class="md-title">
              <md-avatar class="md-avatar-icon md-large">
                <md-icon>create_new_folder</md-icon>
              </md-avatar>
              <md-field :class="getValidationClass('folderName')">
                <label for="folder-name">Name</label>
                <md-input name="folder-name" id="folder-name" v-model="form.folderName" :disabled="sending"/>
                <span class="md-error" v-if="!$v.form.folderName.required">The folder name is required</span>
              </md-field>
            </div>
          </md-card-header>

          <md-card-actions>
            <md-button type="submit" class="md-icon-button md-raised md-primary" :disabled="sending">
              <md-icon>add</md-icon>
            </md-button>
          </md-card-actions>
        </md-card>
      </form>
    </div>
  </div>
</template>

<script>
import { foldersMethods, foldersComputed } from '@state/helpers'
import { validationMixin } from 'vuelidate'
import {
  required
} from 'vuelidate/lib/validators'

export default {
  name: 'AddFolderForm',

  computed: {
    ...foldersComputed
  },

  mixins: [validationMixin],

  data: () => ({
    form: {
      folderName: null
    },
    sending: false,
    sendingError: false
  }),

  validations: {
    form: {
      folderName: {
        required
      }
    }
  },

  methods: {
    ...foldersMethods,
    getValidationClass (fieldName) {
      const field = this.$v.form[fieldName]

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },

    clearForm () {
      this.$v.$reset()
      this.form.folderName = null
    },

    submitForm () {
      this.sending = true
      this.sendingError = false

      return this.addFolder({
        name: this.form.folderName,
        parentId: this.folder.id
      })
        .then(token => {
          this.sending = false
          this.clearForm()
          console.log('Folder added')
        })
    },

    validateForm () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitForm()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-field {
    width: auto;
    margin-right: 0;
  }
</style>
