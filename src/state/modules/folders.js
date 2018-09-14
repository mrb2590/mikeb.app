import axios from 'axios'
import moment from 'moment'
import { b64toBlob } from '@state/functions'

var apiUrl = process.env.VUE_APP_API_URL

export const state = {
  tree: null,
  folders: null,
  currentFolder: null
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
  SET_TREE (state, newValue) {
    state.tree = newValue
  },
  SET_FOLDERS (state, newValue) {
    state.folders = newValue
  },
  SET_CURRRENT_FOLDER (state, newValue) {
    state.currentFolder = newValue
  }
}

export const actions = {
  fetchTree ({ commit }, parentId = false) {
    return axios.get(`${apiUrl}/v1/folders/${parentId}/tree`)
      .then(response => {
        commit('SET_TREE', response.data)
        return response.data
      })
      .catch(error => {
        if (error) {
          commit('SET_TREE', null)
        }
        console.log('Could not fetch folder tree.')
        console.log(error)
      })
  },

  fetchFolders ({ commit }, {
    ownedById = null, parentId = null, page = 1, limit = 25
  }) {
    return axios.get(`${apiUrl}/v1/folders`, {
      params: {
        owned_by_id: ownedById,
        parent_id: parentId,
        page: page,
        limit: limit
      }
    })
      .then(response => {
        commit('SET_FOLDERS', response.data.data)
        return response.data.data
      })
      .catch(error => {
        if (error) {
          commit('SET_FOLDERS', null)
        }
        console.log('Could not fetch folders.')
        console.log(error)
      })
  },

  fetchFolder ({ commit }, { folderId, setCurrent = false }) {
    return axios.get(`${apiUrl}/v1/folders/${folderId}`)
      .then(response => {
        if (setCurrent) {
          commit('SET_CURRRENT_FOLDER', response.data)
        }
        return response.data
      })
      .catch(error => {
        if (error && setCurrent) {
          commit('SET_CURRRENT_FOLDER', null)
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
