import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    mode: "Room"
  },
  mutations: {
    setMode(state, mode) {
      state.mode = mode;
    }
  },
  actions: {},
  modules: {}
});
