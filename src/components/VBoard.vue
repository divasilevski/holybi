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
    console.log("created");
    paper.install(window);

    this.checkResize();
  },

  mounted() {
    console.log("mounted");
    paper.setup("canvas");
    if (!project.last) {
      project.last = this.size;
    }

    if (this.picture) {
      project.clear();
      project.importJSON(this.picture);

      console.log(this.size, project.last);

      let scale = this.size / project.last;
      project.last = this.size;

      const picture = project.activeLayer.children;
      for (let i = 0; i < picture.length; i++) {
        picture[i].position.x *= scale;
        picture[i].position.y *= scale;
        picture[i].scale(scale);
      }
    }

    const store = this.$store;

    window.onload = function() {
      let tool = new Tool();
      let path;

      view.onResize = function(event) {
        // if (this.picture) {
        //   project.importJSON(this.picture);
        // }
        // console.log(123);
        // let scale = paper.view.size.width / project.last;
        // project.last = paper.view.size.width;
        // const picture = project.activeLayer.children;
        // for (let i = 0; i < picture.length; i++) {
        //   picture[i].position.x *= scale;
        //   picture[i].position.y *= scale;
        //   picture[i].scale(scale);
        // }
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
        path.viewSize = view.size.width;
        path.smooth();
        path.simplify();

        store.commit("addPicture", project.exportJSON());
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

      if (this.picture) {
        project.clear();
        project.importJSON(this.picture);

        console.log(this.size, project.last);

        let scale = this.size / project.last;
        project.last = this.size;

        const picture = project.activeLayer.children;
        for (let i = 0; i < picture.length; i++) {
          picture[i].position.x *= scale;
          picture[i].position.y *= scale;
          picture[i].scale(scale);
        }
      }
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
