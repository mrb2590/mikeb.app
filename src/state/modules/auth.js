import axios from 'axios'

var apiUrl = process.env.VUE_APP_API_URL

export const state = {
  userToken: null,
  stayLoggedIn: getSavedState('auth.stayLoggedIn', 'local')
}

export const mutations = {
  SET_USER_TOKEN (state, newValue) {
    state.userToken = newValue
    let storageType = state.stayLoggedIn ? 'local' : 'session'
    saveState('auth.userToken', newValue, storageType)
    setDefaultAuthHeaders(state)
  },

  SET_STAY_LOGGED_IN (state, newValue) {
    state.stayLoggedIn = newValue
    saveState('auth.stayLoggedIn', newValue, 'local')
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
  init ({ state, dispatch, commit }) {
    setDefaultAuthHeaders(state)

    commit('SET_STAY_LOGGED_IN', state.stayLoggedIn ? state.stayLoggedIn : false)

    if (state.stayLoggedIn) {
      commit('SET_USER_TOKEN', getSavedState('auth.userToken', 'local'))
    } else {
      getSavedState('auth.userToken', 'session')
    }

    // this will end up being called twice if logged and load the app from a route
    // that requires auth - do I need this?
    dispatch('validate')
  },

  // Logs in the current user.
  logIn ({ commit, dispatch, getters }, { email, password, stayLoggedIn } = {}) {
    if (getters.loggedIn) return dispatch('validate')

    this.commit('globalapp/SET_FETCHING_TOKEN', true)

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
        this.commit('globalapp/SET_FETCHING_TOKEN', false)
        this.dispatch('user/fetchUser')
        return token
      })
  },

  // Logs out the current user.
  logOut ({ commit }) {
    commit('SET_USER_TOKEN', null)
  },

  // Logs out the current user.
  setStayLoggedIn ({ commit }, stayLoggedIn) {
    commit('SET_STAY_LOGGED_IN', stayLoggedIn)
  },

  // Validates the current user's token and refreshes it
  // with new data from the API.
  validate ({ commit, state }) {
    // Check if token is set
    if (!state.userToken) return Promise.resolve(null)

    // If the token is expired, try to refresh it
    let date = new Date()
    if (date.getTime() >= state.userToken.expires_on) {
      this.commit('globalapp/SET_FETCHING_TOKEN', true)
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
          this.commit('globalapp/SET_FETCHING_TOKEN', false)
          this.dispatch('user/fetchUser')
          return token
        })
        .catch(error => {
          this.commit('globalapp/SET_FETCHING_TOKEN', false)
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

function getSavedState (key, type = 'local') {
  return JSON.parse(window[`${type}Storage`].getItem(key))
}

function saveState (key, state, type = 'local') {
  window[`${type}Storage`].setItem(key, JSON.stringify(state))
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
