<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>
import io from "socket.io-client";
import { mapState } from "vuex";

export default {
  data: () => ({
    socket:
      process.env.NODE_ENV === "production"
        ? io(window.origin)
        : io("localhost:3000")
  }),

  created() {
    // LOAD APP
    if (window.document.location.search) {
      this.$store.commit("setMode", "Room");
    } else {
      this.$store.commit("setMode", "Start");
    }

    // SOCKET LISTENING
    this.socket.on("SET_USER", user => {
      this.$store.commit("setUser", user);
    });

    this.socket.on("UPDATE_USERS", users => {
      this.$store.commit("updateUsers", users);
    });

    this.socket.on("UPDATE_MESSAGES", messages => {
      this.$store.commit("updateMessages", messages);
    });

    this.socket.on("UPDATE_MESSAGE", message => {
      this.$store.commit("updateMessage", message);
    });

    // // Help emit to find vuex
    // this.socket.on("UPDATE_USERS", users => {
    //   this.$store.commit("SOCKET_UPDATE_USERS", users);
    // });
    //
    // this.socket.on("ACCESS_DENIED", () => {
    //   this.$router.push("/error?message=access_denied");
    // });
    // this.socket.on("ROOM_FULL", () => {
    //   this.$router.push("/error?message=room_full");
    // });

    this.socket.on("GET_MESSAGE", str => {
      console.log(str);
    });
  },

  computed: {
    ...mapState(["mode", "user", "users", "new_message"])
  },

  watch: {
    mode() {
      if (this.mode === "Room") {
        const room = window.document.location.search.replace("?id=", "");
        this.socket.emit("USER_JOINED", room);
      }

      if (this.mode === "Start" && this.user) {
        this.socket.emit("USER_LEAVE", {
          id: this.user.id,
          room: this.user.room
        });
        this.$store.commit("clearData");
      }
    },
    new_message() {
      this.socket.emit("ADD_MESSAGE", {
        message: this.new_message,
        room: this.user.room
      });
    }
  }
};
</script>
