import axios from 'axios'

export const state = {
  currentUser: {
    profile: getSavedState('auth.currentUser.profile'),
    token: getSavedState('auth.currentUser.token')
  }
}

export const mutations = {
  SET_CURRENT_USER_TOKEN (state, newValue) {
    state.currentUser.token = newValue
    saveState('auth.currentUser.token', newValue)
    setDefaultAuthHeaders(state)
  },
  SET_CURRENT_USER_PROFILE (state, newValue) {
    state.currentUser.profile = newValue
    saveState('auth.currentUser.profile', newValue)
  }
}

export const getters = {
  // Whether the user is currently logged in.
  loggedIn (state) {
    return !!state.currentUser.token
  }
}

export const actions = {
  // This is automatically run in `src/state/store.js` when the app
  // starts, along with any other actions named `init` in other modules.
  init ({ state, dispatch }) {
    setDefaultAuthHeaders(state)
    dispatch('validate')
  },

  // Logs in the current user.
  logIn ({ commit, dispatch, getters }, { email, password } = {}) {
    if (getters.loggedIn) return dispatch('validate')

    return axios.post(`${process.env.VUE_APP_API_URL}/oauth/token`, {
      grant_type: 'password',
      username: email,
      password: password,
      client_id: process.env.VUE_APP_CLIENT_ID,
      client_secret: process.env.VUE_APP_CLIENT_SECRET,
      scope: '*'
    }).then(response => {
      const token = response.data
      commit('SET_CURRENT_USER_TOKEN', token)
      return token
    })
  },

  // Logs out the current user.
  logOut ({ commit }) {
    commit('SET_CURRENT_USER_TOKEN', null)
    commit('SET_CURRENT_USER_PROFILE', null)
  },

  // Validates the current user's token and refreshes it
  // with new data from the API.
  validate ({ commit, state }) {
    if (!state.currentUser.token) return Promise.resolve(null)

    return axios.post(`${process.env.VUE_APP_API_URL}/oauth/token`, {
      grant_type: 'refresh_token',
      refresh_token: state.currentUser.token.refresh_token,
      client_id: process.env.VUE_APP_CLIENT_ID,
      client_secret: process.env.VUE_APP_CLIENT_SECRET,
      scope: '*'
    })
      .then(response => {
        const token = response.data
        commit('SET_CURRENT_USER_TOKEN', token)
        commit('SET_CURRENT_USER_PROFILE', null)
        return token
      })
      .catch(error => {
        if (error.response.status === 401) {
          commit('SET_CURRENT_USER_TOKEN', null)
          commit('SET_CURRENT_USER_PROFILE', null)
        }
        return null
      })
  }
}

// ===
// Private helpers
// ===

function getSavedState (key) {
  return JSON.parse(window.localStorage.getItem(key))
}

function saveState (key, state) {
  window.localStorage.setItem(key, JSON.stringify(state))
}

function setDefaultAuthHeaders (state) {
  axios.defaults.headers.common.Accept = 'application/json'
  axios.defaults.headers.common.Authorization = state.currentUser
    ? state.currentUser.token
    : ''
}
