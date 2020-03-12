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
    // const user = firebase.auth().currentUser;
    // this.socket.emit("USER_JOINED", {
    //   room: this.$route.query.room,
    //   king: user ? this.$route.query.user === user.uid : false
    // });
    // // Help emit to find vuex
    // this.socket.on("UPDATE_USERS", users => {
    //   this.$store.commit("SOCKET_UPDATE_USERS", users);
    // });
    // this.socket.on("SET_USER", user => {
    //   this.$store.commit("SOCKET_SET_USER", user);
    // });
    // this.socket.on("ACCESS_DENIED", () => {
    //   this.$router.push("/error?message=access_denied");
    // });
    // this.socket.on("ROOM_FULL", () => {
    //   this.$router.push("/error?message=room_full");
    // });

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

  // methods: {
  //   exit() {
  //     this.socket.emit("USER_LEAVE", this.user.id);
  //     this.$store.commit("clearData");
  //   }
  // },
  // destroyed() {
  //   this.socket.emit("USER_LEAVE", this.user.id);
  //   this.$store.commit("clearData");
  // }, 

};
</script>
