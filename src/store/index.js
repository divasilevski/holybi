import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    mode: undefined,
    user: undefined,
    messages: [],
    users: []
  },
  mutations: {
    setMode: (state, mode) => (state.mode = mode),

    setUser: (state, user) => (state.user = user),

    updateUsers: (state, users) => (state.users = users),

    updateMessages: (state, messages) => (state.messages = messages),

    clearData(state) {
      state.user = undefined;
      state.messages = [];
      state.users = [];
    },

    
    SOCKET_newMessage(state, message) {
      state.messages.push(message);
    }

    
  },
  actions: {},
  modules: {}
});
