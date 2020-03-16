<template>
  <v-app>
    <VStart v-if="mode === 'Start'"/>
    <VRoom v-else-if="mode === 'Room'" />
  </v-app>
</template>

<script>
import VStart from "../components/VStart";
import VRoom from "../components/VRoom";

import { mapState } from "vuex";

export default {
  name: "Home",
  computed: {
    ...mapState(["mode"])
  },

  components: {
    VStart,
   VRoom
  }
};
</script>
