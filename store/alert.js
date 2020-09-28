import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'
import VuexPersistence from 'vuex-persist'

const cookieparser = process.server ? require('cookieparser') : undefined

const vuexCookie = new VuexPersistence({
})

Vue.use(Vuex)

export const state = () => ({
  stsalert : false,
  msg :'',
  color : ''
})

export const mutations = {
  status_alert  (state, { sts, pesan, warna }) {
    state.stsalert = sts,
    state.msg = pesan
    state.color = warna
  },

  closed_alert  (state) {
    state.stsalert = false
  }


}

export const plugins = [
  vuexCookie.plugin
]
