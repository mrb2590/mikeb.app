// import axios from 'axios'

// var apiUrl = process.env.VUE_APP_API_URL

export const state = {
  actions: {
    fetchingToken: false
  }
}

export const getters = {}

export const mutations = {
  SET_FETCHING_TOKEN (state, fetching) {
    state.actions.fetchingToken = fetching
  }
}

export const actions = {}
