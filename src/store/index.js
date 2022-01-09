import Vue from 'vue'
import Vuex from 'vuex'
import UserPage from './user'
import Trajectory from './trajectory'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  getters: {},
  modules: {
    UserPage,
    Trajectory
  }
})