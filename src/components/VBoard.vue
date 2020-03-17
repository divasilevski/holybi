<template>
  <div v-resize="checkResize">
    <canvas id="canvas" :style="board_size" resize="true"></canvas>

    <!-- <v-toolbar dense flat class="pa-0">
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
    </v-toolbar> -->
  </div>
</template>

<script>
import paper from "paper";
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["picture"])
  },

  data: () => ({
    board_size: "",
    size: 800
  }),

  created() {
    paper.install(window);
    this.checkResize();
  },

  mounted() {
    paper.setup("canvas");
    if (this.picture) {

      paper.project.activeLayer.importJSON(this.picture)
      //this.picture.activeLayer.copyTo(project);

      // const items = this.picture.activeLayer.children;
      // for (let i = 0; i < items.length; i++) {
      //   new Path(items[i]);
      // }
    }
    let last_w = this.size;
    const store = this.$store;

    window.onload = function() {
      let tool = new Tool();
      let path;

      view.onResize = function(event) {
        paper.view.setViewSize(
          new paper.Size(this.size.width, this.size.height)
        );

        let scale = this.size.width / last_w;
        last_w = this.size.width;

        const picture = project.activeLayer.children;
        for (let i = 0; i < picture.length; i++) {
          picture[i].position.x *= scale;
          picture[i].position.y *= scale;
          picture[i].scale(scale);
        }

        console.log(project.activeLayer);
      };

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

        store.commit("addPicture", project.activeLayer.exportJSON());
      };
    };
  },

  methods: {
    checkResize() {
      if (window.innerHeight - 140 < window.innerWidth) {
        this.size = window.innerHeight - 140;
      } else {
        this.size = window.innerWidth;
      }
      this.board_size = `height: ${this.size}px; width: ${this.size}px`;
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
