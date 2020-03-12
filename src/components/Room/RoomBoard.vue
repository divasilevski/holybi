<template>
  <div v-resize="checkResize">
    <canvas :style="board_size" class="canvas-board"></canvas>

    <v-toolbar dense flat class="pa-0">
      <v-btn-toggle class="pa-0" color="primary" dense group multiple>
        <v-btn :value="1" text>
          <v-icon>mdi-format-bold</v-icon>
        </v-btn>

        <v-btn :value="2" text>
          <v-icon>mdi-format-italic</v-icon>
        </v-btn>

        <v-btn :value="3" text>
          <v-icon>mdi-format-underline</v-icon>
        </v-btn>

        <v-btn :value="4" text>
          <v-icon>mdi-format-color-fill</v-icon>
        </v-btn>
      </v-btn-toggle>

      <div class="mx-4"></div>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  data: () => ({
    message: "",
    board_size: "height: 0px"
  }),
  mounted() {
    this.checkResize();
  },
  methods: {
    checkResize() {
      if (window.innerHeight - 140 < window.innerWidth) {
        this.board_size = `height: ${window.innerHeight -
          140}px; width: ${window.innerHeight - 140}px`;
      } else {
        this.board_size = `height: ${window.innerWidth}px; width: ${window.innerWidth}px`;
      }
    }
  },
  computed: {}
};
</script>
<style lang="sass">
.canvas-board
    background-color: rgb(240,240,255)
</style>
