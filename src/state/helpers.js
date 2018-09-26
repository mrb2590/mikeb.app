import { mapState, mapGetters, mapActions } from 'vuex'

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
  ...mapGetters('user', ['fullName', 'initials', 'formattedDates'])
}

export const userMethods = mapActions('user', ['fetchUser'])

export const settingsComputed = {
  ...mapState('settings', {
    userProfile: state => state.settings
  }),
  ...mapGetters('settings', [])
}

export const settingsMethods = mapActions('settings', ['setTheme'])

export const filesComputed = {
  ...mapGetters('files', ['formattedDates'])
}

export const filesMethods = mapActions('files', ['downloadFile'])

export const foldersComputed = {
  ...mapState('folders', {
    folder: state => state.folder,
    tree: state => state.tree
  }),
  ...mapGetters('folders', ['formattedDates'])
}

export const foldersMethods = mapActions('folders', [
  'updateTree', 'fetchFolder', 'downloadFolder', 'addFolder'
])
