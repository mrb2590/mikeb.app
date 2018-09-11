import axios from 'axios'
import moment from 'moment'
import { b64toBlob } from '@state/functions'

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
  fetchFiles ({ commit, state }, { ownedById = null, parentId = 0, page = 1, limit = 25 }) {
    return axios.get(`${apiUrl}/v1/files`, {
      params: {
        owned_by_id: ownedById,
        parent_id: parentId,
        page: page,
        limit: limit
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
  },

  downloadFile ({ commit, state }, file) {
    return axios.get(`${apiUrl}/v1/files/${file.id}/download`, {
      params: {
        _: +new Date(),
        encoded: 1
      }
    })
      .then(response => {
        let anchor = document.getElementById(`file_${file.id}`)
        let blob = b64toBlob(response.data.file, file.mime_type)
        let windowUrl = window.URL || window.webkitURL
        let url = windowUrl.createObjectURL(blob)
        anchor.setAttribute('href', url)
        anchor.setAttribute('download', response.data.filename)
        anchor.click()
      })
      .catch(error => {
        console.log('Could not download file.')
        console.log(error)
      })
  }
}
