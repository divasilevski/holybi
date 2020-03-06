<template>
  <v-app>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import io from "socket.io-client";
export default {
  data: () => ({
    socket: io('http://localhost:3000')
  }),
  created() {
    this.socket.on("connected", str => {
      console.log(str);
    });

    this.socket.on("disconnected", str => {
      console.log(str);
    });
  }
};

</script>