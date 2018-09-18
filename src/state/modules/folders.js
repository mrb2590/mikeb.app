import axios from 'axios'
import moment from 'moment'
import { b64toBlob } from '@state/functions'

var apiUrl = process.env.VUE_APP_API_URL

export const state = {
  folder: null,
  tree: null
}

export const getters = {
  formattedDates: (state) => (folder) => {
    if (state.folder) {
      return {
        created_at: moment(folder.created_at).format('MMMM Do, YYYY'),
        updated_at: moment(folder.updated_at).format('MMMM Do, YYYY')
      }
    }
  }
}

export const mutations = {
  SET_FOLDER (state, newValue) {
    state.folder = newValue
  },
  SET_TREE (state, newValue) {
    state.tree = newValue
  }
}

export const actions = {
  updateTree ({ commit, state }, { folder }) {
    if (state.tree && state.folder) {
      searchTree(state.folder, folder, function (matchingFolder) {
        matchingFolder = folder
      })
      commit('SET_TREE', state.tree)
    } else {
      commit('SET_TREE', folder)
    }
  },

  fetchFolder ({ commit, dispatch }, { folderId }) {
    return axios.get(`${apiUrl}/v1/folders/${folderId}/children`)
      .then(response => {
        commit('SET_FOLDER', response.data)
        dispatch('updateTree', { folder: response.data })
        return response.data
      })
      .catch(error => {
        commit('SET_FOLDER', null)
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

function searchTree (folder, folderToFind, callback) {
  if (folder.id === folderToFind.id) {
    return folder
  } else if (folder.id != null) {
    var result = null
    for (var i = 0; result === null && i < folder.children.length; i++) {
      result = searchTree(folder.children[i], folderToFind)
    }
    callback(result)
    return result
  }
  return null
}
