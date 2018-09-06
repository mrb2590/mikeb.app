export const state = {
  theme: 'default'
}

export const getters = {}

export const mutations = {
  SET_THEME (state, newValue) {
    state.theme = newValue
    saveState('settings', state, 'local')
  }
}

export const actions = {
  // This is automatically run in `src/state/store.js` when the app
  // starts, along with any other actions named `init` in other modules.
  init ({ state, dispatch, commit }) {
    if (process.env.VUE_APP_DEBUG) console.log('Settings Store - Called actions.init')
    let theme = getSavedState('settings') ? getSavedState('settings').theme : state.theme
    commit('SET_THEME', theme)
  },

  setTheme ({ state, commit }, theme = 'default') {
    commit('SET_THEME', theme)
  }
}

function getSavedState (key, type = 'local') {
  return JSON.parse(window[`${type}Storage`].getItem(key))
}

function saveState (key, state, type = 'local') {
  window[`${type}Storage`].setItem(key, JSON.stringify(state))
}
