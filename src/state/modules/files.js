import axios from 'axios'
import moment from 'moment'
import { b64toBlob } from '@state/functions'

var apiUrl = process.env.VUE_APP_API_URL

export const state = {}

export const getters = {
  formattedDates: (state) => (file) => {
    return {
      created_at: moment(file.created_at).format('MMMM Do, YYYY'),
      updated_at: moment(file.updated_at).format('MMMM Do, YYYY')
    }
  }
}

export const mutations = {}

export const actions = {
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
