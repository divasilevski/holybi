<template>
  <v-container class="fill-height justify-center">
    <Loading v-if="mode === 'loading'" />

    <Start v-else-if="mode === 'start'" />

    <Room v-else-if="mode === 'room'" />
  </v-container>
</template>

<script>
import Loading from "../components/Loading";
import Start from "../components/Start";
import Room from "../components/Room";

export default {
  name: "Home",
  data: () => ({
    mode: "room"
  }),

  components: {
    Loading,
    Start,
    Room
  }
};
</script>
