import { mapState, mapGetters, mapActions } from 'vuex'

export const globalappComputed = {
  ...mapState('globalapp', {
    globalapp: state => state.globalapp
  }),
  ...mapGetters('globalapp', [])
}

export const globalappMethods = mapActions('globalapp', [])

export const authComputed = {
  ...mapState('auth', {
    userToken: state => state.userToken
  }),
  ...mapGetters('auth', ['loggedIn'])
}

export const authMethods = mapActions('auth', ['logIn', 'logOut', 'setStayLoggedIn'])

export const userComputed = {
  ...mapState('user', {
    userProfile: state => state.userProfile
  }),
  ...mapGetters('user', [])
}

export const userMethods = mapActions('user', [])
