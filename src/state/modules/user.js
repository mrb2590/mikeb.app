import axios from 'axios'

var apiUrl = process.env.VUE_APP_API_URL

export const state = {
  userProfile: null
}

export const getters = {}

export const mutations = {
  SET_USER_PROFILE (state, profile) {
    state.userProfile = profile
  }
}

export const actions = {
  fetchUser ({ commit, state }) {
    if (state.userProfile) {
      return
    }
    return axios.get(`${apiUrl}/v1/user`)
      .then(response => {
        const profile = response.data
        commit('SET_USER_PROFILE', profile)
        return profile
      })
      .catch(error => {
        if (error) {
          commit('SET_USER_PROFILE', null)
        }
        console.log('Could not fetch profile.')
        console.log(error)
      })
  }
}
