<template>
  <div class="login center-align-outer">
    <div class="center-align-inner">
      <form class="login-form" novalidate @submit.prevent="validateForm">
        <md-card>
          <md-card-header>
            <div class="md-title">Sign In</div>
            <div class="md-subhead">You little bitch</div>
          </md-card-header>

          <md-card-content>
            <md-field :class="getValidationClass('email')">
              <label for="email">Email</label>
              <md-input type="email" name="email" id="email" autocomplete="email" v-model="form.email" :disabled="sending"/>
              <span class="md-error" v-if="!$v.form.email.required">The email is required</span>
              <span class="md-error" v-if="!$v.form.email.email">Invalid email</span>
            </md-field>
            <md-field :class="getValidationClass('password')">
              <label for="password">Password</label>
              <md-input type="password" name="password" id="password" v-model="form.password" :disabled="sending"/>
              <span class="md-error" v-if="!$v.form.password.required">The password is required</span>
              <span class="md-error" v-if="!$v.form.password.minLength">The password is too short</span>
            </md-field>
          </md-card-content>

          <md-progress-bar md-mode="indeterminate" v-if="sending" />

          <md-card-actions>
            <md-button type="submit" class="md-primary" :disabled="sending">Sign In</md-button>
          </md-card-actions>
        </md-card>
      </form>
    </div>
  </div>
</template>

<script>
import MainLayout from '@layouts/Main'
import { validationMixin } from 'vuelidate'
import {
  required,
  email,
  minLength
} from 'vuelidate/lib/validators'

export default {
  name: 'Login',

  page: {
    title: 'Sign In',
    meta: [
      {
        name: 'description',
        content: 'Sign in to the app.'
      }
    ]
  },

  mixins: [validationMixin],

  data: () => ({
    form: {
      email: null,
      password: null
    },
    userLoggedIn: false,
    sending: false
  }),

  validations: {
    form: {
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(6)
      }
    }
  },

  methods: {
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
      this.form.email = null
      this.form.password = null
    },

    signIn () {
      this.sending = true

      // Instead of this timeout, here you can call your API
      window.setTimeout(() => {
        this.email = this.form.email
        this.userSaved = true
        this.sending = false
        this.clearForm()
      }, 15000)
    },
    validateForm () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.signIn()
      }
    }
  },

  created () {
    this.$emit('update:layout', MainLayout)
  }}
</script>

<style lang="scss" scoped>
.login-form {
  width: 100%;
  max-width: 400px;
}
</style>
