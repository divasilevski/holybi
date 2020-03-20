<template>
  <div v-resize="checkResize">
    <canvas
      id="canvas"
      :style="board_size"
      resize="true"
      v-on:mousedown.prevent="onStart"
      v-on:touchstart.prevent="onStart"
      v-on:mousemove.prevent="onMove"
      v-on:touchmove.prevent="onMove"
      v-on:mouseup.prevent="onEnd"
      v-on:touchend.prevent="onEnd"
    ></canvas>

    <v-toolbar dense flat class="pa-0">
      <v-btn
        icon
        @click.prevent="toggle = 'pen'"
        :color="toggle === 'pen' ? 'blue' : ''"
      >
        <v-icon>mdi-pen</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.prevent="toggle = 'eraser'"
        :color="toggle === 'eraser' ? 'blue' : ''"
      >
        <v-icon>mdi-eraser</v-icon>
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn icon @click.prevent="clearCanvas">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-toolbar>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["last", "project", "drawing"])
  },

  data: () => ({
    toggle: "pen",
    board_size: "",
    size: 800,
    path: undefined,
    isDraw: false
  }),

  created() {
    this.checkResize();
  },

  mounted() {
    this.reload();
    paper.setup("canvas");
    const store = this.$store;
    if (this.last) store.commit("updateLast", this.size);

    let tool = new Tool();
  },

  methods: {
    onStart() {
      console.log("start");
      this.path = new Path();
      if (this.toggle === "pen") {
        this.path.strokeColor = "black";
        this.path.strokeWidth = 2;
        this.path.strokeCap = "round";
        this.path.strokeJoin = "round";
      } else {
        this.path.strokeColor = "black";
        this.path.strokeWidth = 2;
        this.path.opacity = 0.2;
      }

      this.isDraw = true;
    },

    onMove(event) {
      if (this.isDraw) {
        const canvas = document.getElementById("canvas");
        const bcr = canvas.getBoundingClientRect();
        console.log(event);
        this.path.add(
          new Point(
            event.clientX - bcr.x || event.touches[0].clientX - bcr.x,
            event.clientY - bcr.y || event.touches[0].clientY - bcr.y
          )
        );
      }
    },

    onEnd() {
      this.isDraw = false;
      console.log("end");
      if (this.toggle === "pen") {
        this.path.smooth();
        this.path.simplify();
      } else {
        const children = project.activeLayer.children;
        for (let i = children.length - 1; i >= 0; i--) {
          if (this.path.getIntersections(children[i]).length) {
            children[i].remove();
          }
        }
        this.path.remove();
      }
      this.$store.commit("newProject", project.exportJSON());
      this.$store.commit("updateLast", view.size.width);
    },

    reload() {
      if (this.project) {
        project.clear();
        project.importJSON(this.project);

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
      this.$store.commit(
        "newProject",
        JSON.stringify([["Layer", { applyMatrix: true }]])
      );
    }
  },

  watch: {
    project(value) {
      this.reload();
    },
    drawing(value) {
      if (value) {
        this.reload();
        this.$store.commit("drawing", false);
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
