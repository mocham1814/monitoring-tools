import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'
import VuexPersistence from 'vuex-persist'
const cookieparser = process.server ? require('cookieparser') : undefined

const vuexCookie = new VuexPersistence({
})

Vue.use(Vuex)

export const state = () => ({
  auth: null,
  username: null,
  userid:null,
})

export const mutations = {
  setAuth(state, auth) {
    state.auth = auth
  },
  setUsername(state, username) {
    state.username = username
  },
  setUserId(state, userid) {
    state.userid = userid
  },
}

export const plugins = [
  vuexCookie.plugin
]





