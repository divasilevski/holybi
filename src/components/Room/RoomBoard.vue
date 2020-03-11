<template>
  <div>
    <div class="div-board">
      <canvas class="canvas-board"></canvas>
    </div>

    <v-toolbar dense flat class="pa-0">
      <v-btn-toggle
        class="pa-0"
        color="primary"
        dense
        group
        multiple
      >
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

<style lang="sass">
.div-board
    position: relative
    width: 100%
    height: 0
    padding-bottom: 100%

.canvas-board
    position: absolute
    width: 100%
    height: 100%
    background-color: rgb(240,240,255)
</style>
