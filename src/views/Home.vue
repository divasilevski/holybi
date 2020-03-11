<template>
  <v-app>
    <v-container v-if="mode === 'loading'" class="fill-height justify-center">
      <Loading />
    </v-container>

    <v-container
      v-else-if="mode === 'start'"
      class="fill-height justify-center"
    >
      <Start />
    </v-container>

    <Room v-else-if="mode === 'room'" />
  </v-app>
</template>

<script>
import Loading from "../components/Loading";
import Start from "../components/Start";
import Room from "../components/Room/Room";

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
