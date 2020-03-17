import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    mode: undefined,
    user: undefined,
    typing: [],
    new_typing: undefined,
    messages: [],
    new_message: undefined,
    users: [],
    picture: undefined,
    draw: [],
    drawIt: undefined,
    last: 800
  },
  mutations: {
    setMode: (state, mode) => (state.mode = mode),

    setUser: (state, user) => (state.user = user),

    addMessage: (state, message) => (state.new_message = message),

    updateUsers: (state, users) => (state.users = users),

    updateMessage: (state, message) => state.messages.push(message),

    updateMessages: (state, messages) => (state.messages = messages),

    addTyping: (state, obj) => {
      state.typing.push(obj);
      state.new_typing = true;
    },

    updateTyping: (state, array) => (state.typing = array),

    delTyping: (state, id) => {
      state.typing = state.typing.filter(obj => obj.id != id);
      state.new_typing = false;
    },

    addPicture: (state, picture) => (state.picture = picture),

    updateLast: (state, last) => (state.last = last),

    setDraw: (state, draw) => (state.draw = draw),

    setDrawing: (state, drawing) => (state.drawIt = drawing),

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
  modules: {},
  getters: {
    getPicture(state) {
      return state.picture;
    }
  }
});
