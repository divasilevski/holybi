<template>
  <v-app>
    <v-container v-if="mode === 'Loading'" class="fill-height justify-center">
      <Loading />
    </v-container>

    <v-container
      v-else-if="mode === 'Start'"
      class="fill-height justify-center"
    >
      <Start />
    </v-container>

    <Room v-else-if="mode === 'Room'" />
  </v-app>
</template>

<script>
import Loading from "../components/Loading";
import Start from "../components/Start";
import Room from "../components/Room/Room";

import { mapState } from "vuex";

export default {
  name: "Home",

  beforeCreate() {
    if (this.$route.query.id) {
      this.$store.commit("setMode", "Room")
    }
  },

  computed: {
    ...mapState(["mode"])
  },

  components: {
    Loading,
    Start,
    Room
  }
};
</script>
