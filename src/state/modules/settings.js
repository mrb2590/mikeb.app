export const state = {
  theme: getSavedState('settings.theme', 'local')
}

export const getters = {}

export const mutations = {
  SET_THEME (state, theme) {
    state.theme = theme
    saveState('settings.theme', theme, 'local')
  }
}

export const actions = {}

function getSavedState (key, type = 'local') {
  return JSON.parse(window[`${type}Storage`].getItem(key))
}

function saveState (key, state, type = 'local') {
  window[`${type}Storage`].setItem(key, JSON.stringify(state))
}
