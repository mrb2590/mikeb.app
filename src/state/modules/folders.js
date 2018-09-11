import axios from 'axios'
import moment from 'moment'
import { b64toBlob } from '@state/functions'

var apiUrl = process.env.VUE_APP_API_URL

export const state = {
  folders: null,
  parents: null
}

export const getters = {
  formattedDates: (state) => (folder) => {
    if (state.folders) {
      return {
        created_at: moment(folder.created_at).format('MMMM Do, YYYY'),
        updated_at: moment(folder.updated_at).format('MMMM Do, YYYY')
      }
    }
  }
}

export const mutations = {
  SET_FOLDERS (state, newValue) {
    state.folders = newValue
  },
  SET_PARENTS (state, newValue) {
    state.parents = newValue
  }
}

export const actions = {
  fetchFolders ({ commit, state }, {
    ownedById = null, parentId = 0, withParents = false, page = 1, limit = 25
  }) {
    return axios.get(`${apiUrl}/v1/folders`, {
      params: {
        owned_by_id: ownedById,
        parent_id: parentId,
        with_parents: withParents,
        page: page,
        limit: limit
      }
    })
      .then(response => {
        commit('SET_PARENTS', response.data.all_parents)
        commit('SET_FOLDERS', response.data.data)
        return response.data.data
      })
      .catch(error => {
        if (error) {
          commit('SET_PARENTS', null)
          commit('SET_FOLDERS', null)
        }
        console.log('Could not fetch folders.')
        console.log(error)
      })
  },

  downloadFolder ({ commit, state }, folder) {
    return axios.get(`${apiUrl}/v1/folders/${folder.id}/download`, {
      params: {
        _: +new Date(),
        encoded: 1
      }
    })
      .then(response => {
        let anchor = document.getElementById(`folder_${folder.id}`)
        let blob = b64toBlob(response.data.file, 'application/zip')
        let windowUrl = window.URL || window.webkitURL
        let url = windowUrl.createObjectURL(blob)
        anchor.setAttribute('href', url)
        anchor.setAttribute('download', response.data.filename)
        anchor.click()
      })
      .catch(error => {
        console.log('Could not download folder.')
        console.log(error)
      })
  }
}
