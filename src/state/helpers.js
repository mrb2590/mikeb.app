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
  ...mapState('files', {
    files: state => state.files
  }),
  ...mapGetters('files', ['formattedDates'])
}

export const filesMethods = mapActions('files', ['fetchFiles', 'downloadFile'])

export const foldersComputed = {
  ...mapState('folders', {
    folders: state => state.folders,
    parents: state => state.parents
  }),
  ...mapGetters('folders', ['formattedDates', 'parentsFolders'])
}

export const foldersMethods = mapActions('folders', ['fetchFolders', 'downloadFolder'])
