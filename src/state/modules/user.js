import axios from 'axios'
import moment from 'moment'

var apiUrl = process.env.VUE_APP_API_URL

export const state = {
  userProfile: null
}

export const getters = {
  fullName (state) {
    if (state.userProfile) {
      return `${state.userProfile.first_name} ${state.userProfile.last_name}`
    }
  },

  initials (state) {
    if (state.userProfile) {
      return `${state.userProfile.first_name.charAt(0)}${state.userProfile.last_name.charAt(0)}`
    }
  },

  formattedDates (state) {
    if (state.userProfile) {
      return {
        created_at: moment(state.userProfile.created_at).format('MMMM Do, YYYY'),
        updated_at: moment(state.userProfile.updated_at).format('MMMM Do, YYYY')
      }
    }
  }
}

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
    if (process.env.VUE_APP_DEBUG) console.log('User Store - Called actions.fetchUser')
    return axios.get(`${apiUrl}/v1/user`)
      .then(response => {
        if (process.env.VUE_APP_DEBUG) console.log('User Store - Called actions.fetchUser - promise')
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
