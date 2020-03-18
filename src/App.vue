<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>
import io from "socket.io-client";
import paper from "paper";
import { mapState } from "vuex";

export default {
  data: () => ({
    socket:
      process.env.NODE_ENV === "production"
        ? io(window.origin)
        : io("localhost:3000")
  }),

  created() {
    paper.install(window);

    // LOAD APP
    if (window.document.location.search) {
      this.$store.commit("setMode", "Room");
    } else {
      this.$store.commit("setMode", "Start");
    }

    // ROOM //
    this.socket.on("SET_USER", user => {
      this.$store.commit("setUser", user);
    });

    this.socket.on("UPDATE_USERS", users => {
      this.$store.commit("updateUsers", users);
    });

    this.socket.on("GET_MESSAGE", str => {
      console.log(str);
    });

    // BOARD //
    this.socket.on("UPDATE_PROJECT", ({ project, last }) => {
      this.$store.commit("updateLast", last);
      this.$store.commit("updateProject", project);
    });

    // CHAT //
    this.socket.on("UPDATE_MESSAGES", messages => {
      this.$store.commit("updateMessages", messages);
    });

    this.socket.on("UPDATE_MESSAGE", message => {
      this.$store.commit("updateMessage", message);
    });

    this.socket.on("UPDATE_TYPING", typing => {
      this.$store.commit("updateTyping", typing);
    });
  },

  computed: {
    ...mapState([
      // ROOM //
      "mode",
      "user",
      "users",
      // BOARD //
      "new_project",
      "last",
      // CHAT //
      "new_message",
      "new_typing",
      "typing"
    ])
  },

  watch: {
    // ROOM //
    mode() {
      if (this.mode === "Room") {
        const room = window.document.location.search.replace("?id=", "");
        this.socket.emit("USER_JOINED", { room, device: this.$device });
      }

      if (this.mode === "Start" && this.user) {
        this.socket.emit("USER_LEAVE", {
          id: this.user.id,
          room: this.user.room
        });
        this.$store.commit("clearData");
      }
    },

    // BOARD //
    new_project(value) {
      this.socket.emit("UPDATE_PROJECT", {
        project: value,
        room: this.user.room,
        last: this.last
      });
    },

    // CHAT //
    new_message() {
      this.socket.emit("ADD_MESSAGE", {
        message: this.new_message,
        room: this.user.room
      });
    },

    new_typing() {
      this.socket.emit("UPDATE_TYPING", {
        typing: this.typing,
        room: this.user.room
      });
    }
  }
};
</script>
