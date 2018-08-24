import axios from 'axios'

var apiUrl = process.env.VUE_APP_API_URL

export const state = {
  userToken: getSavedState('auth.userToken')
}

export const mutations = {
  SET_USER_TOKEN (state, newValue) {
    state.userToken = newValue
    saveState('auth.userToken', newValue)
    setDefaultAuthHeaders(state)
  }
}

export const getters = {
  // Whether the user is currently logged in.
  loggedIn (state) {
    return !!state.userToken
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

    return axios.post(`${apiUrl}/oauth/token`, {
      grant_type: 'password',
      username: email,
      password: password,
      client_id: process.env.VUE_APP_CLIENT_ID,
      client_secret: process.env.VUE_APP_CLIENT_SECRET,
      scope: '*'
    })
      .then(response => {
        response.data.expires_on = computeExpiry(response.data.expires_in)
        const token = response.data
        commit('SET_USER_TOKEN', token)
        this.dispatch('user/fetchUser')
        return token
      })
      .catch(error => {
        if (error.response.status === 401) {
          console.log('Invalid credentials.')
        }
        return null
      })
  },

  // Logs out the current user.
  logOut ({ commit }) {
    commit('SET_USER_TOKEN', null)
  },

  // Validates the current user's token and refreshes it
  // with new data from the API.
  validate ({ commit, state }) {
    // Check if token is set
    if (!state.userToken) return Promise.resolve(null)

    // If the token is expired, try to refresh it
    let date = new Date()
    if (date.getTime() >= state.userToken.expires_on) {
      return axios.post(`${apiUrl}/oauth/token`, {
        grant_type: 'refresh_token',
        refresh_token: state.userToken.refresh_token,
        client_id: process.env.VUE_APP_CLIENT_ID,
        client_secret: process.env.VUE_APP_CLIENT_SECRET,
        scope: '*'
      })
        .then(response => {
          response.data.expires_on = computeExpiry(response.data.expires_in)
          const token = response.data
          commit('SET_USER_TOKEN', token)
          this.dispatch('user/fetchUser')
          return token
        })
        .catch(error => {
          if (error.response.status === 401) {
            commit('SET_USER_TOKEN', null)
          }
          return null
        })
    }

    // Otherwise token is set and should be valid
    this.dispatch('user/fetchUser')
    return state.userToken
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
  axios.defaults.headers.common.Authorization = state.userToken
    ? `Bearer ${state.userToken.access_token}`
    : ''
}

// Set a timestamp for when the token expires
function computeExpiry (expiresIn) {
  let date = new Date()
  return date.getTime() + (expiresIn * 1000 - 10000)
}
