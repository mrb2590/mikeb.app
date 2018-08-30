<template>
  <div class="profile">
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-100 block">
        <h1 class="md-headline">Profile</h1>
      </div>
      <div class="md-layout md-layout-item md-size-50 md-xsmall-size-100">

        <div class="md-layout-item md-size-100 block">
          <BaseLoader v-if="!userProfile"/>
          <md-card v-if="userProfile">
            <md-card-header>
              <div class="md-title">
                <md-avatar class="md-avatar-icon md-large md-accent">
                  <md-ripple>{{ initials }}</md-ripple>
                </md-avatar>
                {{ fullName }}
              </div>
              <div class="md-subhead">{{ userProfile.slug }}</div>
            </md-card-header>

            <md-card-content>
              <ul class="md-block-1 info">
                <li>Joined {{ formattedDates.created_at }}</li>
                <li>Last updated on {{ formattedDates.updated_at }}</li>
              </ul>
            </md-card-content>
          </md-card>
        </div>

        <div class="md-layout-item md-size-100 block">
          <BaseLoader v-if="!userProfile"/>
          <md-card v-if="userProfile">
            <md-card-header>
              <div class="md-title">Update</div>
            </md-card-header>

            <md-card-content>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-50">
                  <md-field>
                    <label for="first-name">First Name</label>
                    <md-input name="first-name" id="first-name" autocomplete="given-name" />
                  </md-field>
                </div>

                <div class="md-layout-item md-small-size-50">
                  <md-field>
                    <label for="last-name">Last Name</label>
                    <md-input name="last-name" id="last-name" autocomplete="family-name" />
                  </md-field>
                </div>
              </div>
              <div class="md-layout">
                <div class="md-layout-item md-size-100">
                  <md-field>
                    <label for="email">Email</label>
                    <md-input type="email" name="email" id="email" autocomplete="email" />
                  </md-field>
                </div>
              </div>
            </md-card-content>

            <md-card-actions>
              <md-button>Update</md-button>
            </md-card-actions>
          </md-card>
        </div>
      </div>
      <div class="md-layout md-layout-item md-size-50 md-xsmall-size-100">

        <div class="md-layout-item md-size-100 block settings">
          <BaseLoader v-if="!userProfile"/>
          <md-card v-if="userProfile">
            <md-card-header>
              <div class="md-title">Settings</div>
            </md-card-header>

            <md-card-content>
              <ul>
                <li><md-switch v-model="notify" class="md-primary">Send notifitcations</md-switch></li>
                <li><md-switch v-model="emails" class="md-primary">Send emails</md-switch></li>
                <li><md-switch v-model="notify" class="md-primary">Send notifitcations</md-switch></li>
                <li><md-switch v-model="emails" class="md-primary">Send emails</md-switch></li>
                <li><md-switch v-model="notify" class="md-primary">Send notifitcations</md-switch></li>
                <li><md-switch v-model="emails" class="md-primary">Send emails</md-switch></li>
              </ul>
            </md-card-content>
          </md-card>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import MainLayout from '@layouts/Main'
import { userComputed } from '@state/helpers'

export default {
  name: 'Profile',

  data () {
    return {
      notify: false,
      emails: true
    }
  },

  page: {
    title: 'Profile',
    meta: [
      {
        name: 'description',
        content: 'User profile.'
      }
    ]
  },

  computed: {
    ...userComputed
  },

  created () {
    this.$emit('update:layout', MainLayout)
  }
}
</script>

<style lang="scss" scoped>
.profile {
  height: 100%;

  .md-headline {
    margin: 0;
  }

  .block {
    margin-bottom: 24px;
  }

  .md-card {
    margin: 0;

    .info {
      margin-top: 20px;
    }
  }

  ul {
    list-style: none;
    padding: 0;
  }
}
</style>
