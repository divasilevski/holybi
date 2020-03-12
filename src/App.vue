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
<<<<<<< HEAD
    socket: io(window.origin)
=======
    socket:
      process.env.NODE_ENV === "production"
        ? io(window.origin)
        : io("localhost:3000")
>>>>>>> master
  }),

  created() {
    this.socket.on("connected", str => {
      console.log(str);
    });

    this.socket.on("disconnected", str => {
      console.log(str);
    });

    // Help emit to find vuex
    this.socket.on("UPDATE_USERS", users => {
      this.$store.commit("SOCKET_UPDATE_USERS", users);
    });
    this.socket.on("SET_USER", user => {
      this.$store.commit("SOCKET_SET_USER", user);
    });
  },

  computed: {
    ...mapState(["user", "users"])
  }
};
</script>
