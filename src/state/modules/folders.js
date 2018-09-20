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
  updateTree ({ commit, state }, folder) {
    if (state.tree && folder) {
      let tempTree = JSON.parse(JSON.stringify(state.tree))
      let foundFolder = searchTree(tempTree, folder)
      if ((foundFolder.children || []).length === 0) {
        foundFolder.children = folder.children
      }
      commit('SET_TREE', tempTree)
    } else {
      commit('SET_TREE', folder)
    }
  },

  fetchFolder ({ commit, dispatch }, { folderId }) {
    return axios.get(`${apiUrl}/v1/folders/${folderId}/children`)
      .then(response => {
        commit('SET_FOLDER', response.data)
        dispatch('updateTree', response.data)
        return response.data
      })
      // .catch(error => {
      //   commit('SET_FOLDER', null)
      //   console.log('Could not fetch folders.')
      //   console.log(error)
      // })
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

function searchTree (folder, folderToFind) {
  console.log(folder.id)
  console.log(folderToFind.id)
  if (folder.id === folderToFind.id) {
    return folder
  } else if (folder.children) {
    for (var k in folder.children) {
      if (folder.children[k].id === folderToFind.id) {
        return folder.children[k]
      } else if (folder.children.length) {
        return searchTree(folder.children[k], folderToFind.id)
      }
    }
  }
}
