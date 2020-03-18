<template>
  <div v-resize="checkResize">
    <canvas id="canvas" :style="board_size" resize="true"></canvas>

    <v-toolbar dense flat class="pa-0">
      <v-btn-toggle class="pa-0" color="primary" dense group multiple>
        <v-btn :value="1" text @click.prevent="clearCanvas">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-toolbar>
    <!--
        <v-btn :value="2" text>
          <v-icon>mdi-eraser</v-icon>
        </v-btn>

        <v-btn :value="3" text>
          <v-icon>mdi-pensil</v-icon>
        </v-btn>

        <v-btn :value="4" text>
          <v-icon>mdi-format-color-fill</v-icon>
        </v-btn>
      </v-btn-toggle>

      <div class="mx-4"></div>  -->
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["picture", "last", "resizing"])
  },

  data: () => ({
    board_size: "",
    size: 800
  }),

  created() {
    console.log("created");
    this.checkResize();
  },

  mounted() {
    this.reload();

    console.log("mounted");
    paper.setup("canvas");
    const store = this.$store;
    if (this.last) store.commit("updateLast", this.size);

    let tool = new Tool();
    let path;

    tool.onMouseDown = function(event) {
      event.preventDefault();

      path = new Path();
      path.strokeColor = "black";
      path.strokeWidth = 2;
      path.strokeCap = "round";
      path.strokeJoin = "round";
    };

    tool.onMouseDrag = function(event) {
      event.preventDefault();
      path.add(event.point);
    };

    tool.onMouseUp = function(event) {
      event.preventDefault();
      path.smooth();
      path.simplify();

      store.commit("addPicture", project.exportJSON());
      store.commit("updateLast", view.size.width);
    };
  },

  methods: {
    reload() {
      if (this.picture) {
        project.clear();
        project.importJSON(this.picture);

        view.viewSize = new Size(this.size, this.size);

        let scale = this.size / this.last;

        const picture = project.activeLayer.children;
        for (let i = 0; i < picture.length; i++) {
          picture[i].position.x *= scale;
          picture[i].position.y *= scale;
          picture[i].scale(scale);
        }
      }
    },
    checkResize() {
      if (window.innerHeight - 140 < window.innerWidth) {
        this.size = window.innerHeight - 140;
      } else {
        this.size = window.innerWidth;
      }
      this.board_size = `height: ${this.size}px; width: ${this.size}px`;
      this.reload();
    },
    clearCanvas() {
      project.clear();
      this.$store.commit("addPicture", project.exportJSON());
    }
  }
};
</script>
<style lang="sass">
canvas[resize]
    width: 100%
    height: 100%
    background: #E9FFFD
</style>
