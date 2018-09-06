import axios from 'axios'
import moment from 'moment'

var apiUrl = process.env.VUE_APP_API_URL

export const state = {
  files: null
}

export const getters = {
  formattedDates: (state) => (file) => {
    if (state.files) {
      return {
        created_at: moment(file.created_at).format('MMMM Do, YYYY'),
        updated_at: moment(file.updated_at).format('MMMM Do, YYYY')
      }
    }
  }
}

export const mutations = {
  SET_FILES (state, newValue) {
    state.files = newValue
  }
}

export const actions = {
  fetchFiles ({ commit, state }, page = 1, limit = 10) {
    return axios.get(`${apiUrl}/v1/files`, {
      params: {
        limit: limit,
        page: page
      }
    })
      .then(response => {
        commit('SET_FILES', response.data.data)
        return response.data.data
      })
      .catch(error => {
        if (error) {
          commit('SET_FILES', null)
        }
        console.log('Could not fetch files.')
        console.log(error)
      })
  }
}
