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
            <md-switch v-model="stayLoggedIn" class="md-primary">Stay signed in</md-switch>
            <div :class="{ visible: sendingError }" class="submitError">
              {{ sendingError }}
            </div>
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
import { authMethods, authComputed } from '@state/helpers'

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
    sending: false,
    sendingError: false
  }),

  computed: {
    stayLoggedIn: {
      get () {
        return this.$store.state.auth.stayLoggedIn
      },
      set (value) {
        this.setStayLoggedIn(value)
      }
    }
  },

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
    ...authMethods,
    ...authComputed,

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

    submitForm () {
      this.sending = true
      this.sendingError = false

      return this.logIn({
        email: this.form.email,
        password: this.form.password,
        stayLoggedIn: this.stayLoggedIn
      })
        .then(token => {
          this.sending = false
          this.clearForm()
          // Redirect to the originally requested page, or to the home page
          this.$router.push(this.$route.query.redirectFrom || { name: 'profile' })
        })
        .catch(error => {
          this.sending = false
          if (error.response.status === 401) {
            this.sendingError = 'Access denied.'
          } else {
            this.sendingError = 'Something went wrong.'
          }
        })
    },

    validateForm () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.submitForm()
      }
    }
  },

  created () {
    this.$emit('update:layout', MainLayout)
  }
}
</script>

<style lang="scss" scoped>
.login-form {
  width: 100%;
  max-width: 400px;

  .md-title, .md-subhead {
    text-align: center;
  }

  .submitError {
    opacity: 0;
    cursor: default;
    text-align: center;
    margin-top: 10px;
    color: var(--md-theme-default-fieldvariant, #ff1744);
    text-selection: none;
  }

  .submitError.visible {
    opacity: 1;
  }
}
</style>
