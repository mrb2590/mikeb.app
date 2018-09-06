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
  },

  download ({ commit, state }, file) {
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
        anchor.setAttribute('download', `${file.original_filename}.${file.extension}`)
        anchor.click()
      })
      .catch(error => {
        console.log('Could not download file.')
        console.log(error)
      })
  }
}

function b64toBlob (b64Data, contentType, sliceSize) {
  contentType = contentType || ''
  sliceSize = sliceSize || 512
  var byteCharacters = atob(b64Data)
  var byteArrays = []
  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize)
    var byteNumbers = new Array(slice.length)
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }
    var byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }
  var blob = new Blob(byteArrays, {type: contentType})
  return blob
}
