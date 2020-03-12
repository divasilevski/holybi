import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    mode: "Room",
    user: {},
    messages: [],
    users: []
  },
  mutations: {
    clearData(state) {
      state.user = {};
      state.messages = [];
      state.users = [];
    },
    SOCKET_newMessage(state, message) {
      state.messages.push(message);
    },
    SOCKET_SET_USER(state, user) {
      state.user = user;
    },
    SOCKET_UPDATE_USERS(state, users) {
      state.users = users;
    },
    setMode(state, mode) {
      state.mode = mode;
    }
  },
  actions: {},
  modules: {}
});
