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
  ADD_CHILD_FOLDER (state, folder) {
    let parent = searchTree(state.tree, state.folder.id)
    if (parent) {
      if (!parent.children) parent.children = []
      parent.children.push(folder)
    }
  },
  SET_TREE (state, newValue) {
    state.tree = newValue
  },
  ADD_FOLDER_TO_TREE (state, folder) {
    let foundFolder = searchTree(state.tree, folder.id)
    if ((foundFolder.children || []).length < 1) {
      foundFolder.children = folder.children
    }
  }
}

export const actions = {
  updateTree ({ commit, state }, folder) {
    if (state.tree && folder) {
      commit('ADD_FOLDER_TO_TREE', folder)
    } else {
      commit('SET_TREE', folder)
    }
  },

  fetchFolder ({ commit, state, dispatch }, { folderId, force = false }) {
    // Search tree first for cached folder
    if (!force) {
      let folder = searchTree(state.tree, folderId)
      if (folder.children) {
        commit('SET_FOLDER', folder)
        return Promise.resolve(folder)
      }
    }
    return axios.get(`${apiUrl}/v1/folders/${folderId}/children`)
      .then(response => {
        commit('SET_FOLDER', response.data)
        dispatch('updateTree', response.data)
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
  },

  addFolder ({ commit, state }, { name = null, parentId = null }) {
    return axios.post(`${apiUrl}/v1/folders`, {
      name: name,
      parent_id: parentId
    })
      .then(response => {
        commit('ADD_CHILD_FOLDER', response.data)
      })
      .catch(error => {
        this.commit('app/SET_SHOWSNACKBAR', true)
        console.log('Could not add folder.')
        console.log(error)
      })
  }
}

let searchTree = (folder, folderToFindId) => {
  if (!folder) return false
  if (folder.id === folderToFindId) {
    return folder
  }
  if (folder.children) {
    for (let i in folder.children) {
      let result = searchTree(folder.children[i], folderToFindId)
      if (result) return result
    }
  }
  return false
}
