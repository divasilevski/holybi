import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    mode: undefined,
    user: undefined,
    messages: [],
    new_message: undefined,
    users: [],
    draw: [],
    drawing: undefined
  },
  mutations: {
    setMode: (state, mode) => (state.mode = mode),

    setUser: (state, user) => (state.user = user),

    addMessage: (state, message) => (state.new_message = message),

    updateUsers: (state, users) => (state.users = users),

    updateMessage: (state, message) => state.messages.push(message),

    updateMessages: (state, messages) => (state.messages = messages),

    setDraw: (state, draw) => (state.draw = draw),

    setDrawing: (state, drawing) => (state.drawing = drawing),

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
