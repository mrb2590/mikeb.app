import { mapState, mapGetters, mapActions } from 'vuex'

export const globalComputed = {
  ...mapState('global', {
    global: state => state.global
  }),
  ...mapGetters('global', [])
}

export const globalMethods = mapActions('global', [])

export const authComputed = {
  ...mapState('auth', {
    userToken: state => state.userToken
  }),
  ...mapGetters('auth', ['loggedIn'])
}

export const authMethods = mapActions('auth', ['logIn', 'logOut'])

export const userComputed = {
  ...mapState('user', {
    userProfile: state => state.userProfile
  }),
  ...mapGetters('user', [])
}

export const userMethods = mapActions('user', [])
