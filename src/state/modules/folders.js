import axios from 'axios'
import moment from 'moment'
import { b64toBlob } from '@state/functions'
import lang from 'lodash/lang'

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
  // sortByKey (sortable = [], key = 'name') {
  //   return sortable.sort((a, b) => {
  //     return a[key].localeCompare(b[key], 'en', {
  //       numeric: true,
  //       sensitivity: 'base'
  //     })
  //   })
  // }
}

export const mutations = {
  SET_FOLDER (state, newValue) {
    state.folder = lang.cloneDeep(newValue)
    // if (newValue) {
    //   state.folder.children = getters.sortByKey(newValue.children, 'name')
    //   state.folder.files = getters.sortByKey(newValue.files, 'display_filename')
    // }
  },
  ADD_CHILD_FOLDER (state, folder) {
    state.folder.children.push(lang.cloneDeep(folder))
    let parent = searchTree(state.tree, state.folder.id)
    if (parent) parent.children.push(lang.cloneDeep(folder))
    // parent.children = getters.sortByKey(parent.children, 'name')
  },
  SET_TREE (state, newValue) {
    state.tree = lang.cloneDeep(newValue)
  },
  ADD_FOLDER_TO_TREE (state, folder) {
    let foundFolder = searchTree(state.tree, folder.id)
    foundFolder.children = folder.children
    state.tree = lang.cloneDeep(state.tree)
    // foundFolder.children = getters.sortByKey(foundFolder.children, 'name')
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

  fetchFolder ({ commit, state, dispatch }, { folderId, force = false, setCurrent = true }) {
    // Search tree first for cached folder
    if (!force) {
      let folder = searchTree(state.tree, folderId)
      if (folder.children) {
        if (setCurrent) commit('SET_FOLDER', folder)
        return Promise.resolve(folder)
      }
    }
    return axios.get(`${apiUrl}/v1/folders/${folderId}/children`)
      .then(response => {
        if (setCurrent) commit('SET_FOLDER', response.data)
        dispatch('updateTree', response.data)
        return response.data
      })
      .catch(error => {
        if (setCurrent) commit('SET_FOLDER', null)
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
        commit('ADD_FOLDER_TO_TREE', response.data)
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
