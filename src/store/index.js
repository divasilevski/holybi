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
    project: undefined,
    new_project: undefined,
    last: 800,
    drawing: false
  },
  mutations: {
    setMode: (state, mode) => (state.mode = mode),

    setUser: (state, user) => (state.user = user),

    addMessage: (state, message) => (state.new_message = message),

    updateUsers: (state, users) => (state.users = users),

    updateMessage: (state, message) => state.messages.push(message),

    updateMessages: (state, messages) => (state.messages = messages),

    drawing: (state, drawing) => (state.drawing = drawing),

    addTyping: (state, obj) => {
      state.typing.push(obj);
      state.new_typing = true;
    },

    updateTyping: (state, array) => (state.typing = array),

    delTyping: (state, id) => {
      state.typing = state.typing.filter(obj => obj.id != id);
      state.new_typing = false;
    },

    updateProject: (state, project) => (state.project = project),

    newProject: (state, new_project) => {
      state.project = new_project;
      state.new_project = new_project;
    },

    updateLast: (state, last) => (state.last = last),

    clearData(state) {
      state.user = undefined;
      state.messages = [];
      state.users = [];
      state.picture = undefined;
      state.last = 800;
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
