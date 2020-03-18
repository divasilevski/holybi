<template>
  <div v-resize="checkResize">
    <canvas id="canvas" :style="board_size" resize="true"></canvas>

    <v-toolbar dense flat class="pa-0">
      <v-btn-toggle
        v-model="toggle"
        class="pa-0"
        color="primary"
        dense
        group
        mandatory
      >
        <v-btn :value="'pen'">
          <v-icon>mdi-pen</v-icon>
        </v-btn>
        <v-btn :value="'erase'">
          <v-icon>mdi-eraser</v-icon>
        </v-btn>
      </v-btn-toggle>

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
    ...mapState(["last", "project"])
  },

  data: () => ({
    toggle: undefined,
    board_size: "",
    size: 800
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
    let path;

    tool.onMouseDown = event => {
      event.preventDefault();

      path = new Path();

      if (this.toggle === "pen") {
        path.strokeColor = "black";
        path.strokeWidth = 2;
        path.strokeCap = "round";
        path.strokeJoin = "round";
      } else {
        path.strokeColor = "black";
        path.strokeWidth = 2;
        path.opacity = 0.2;
      }
    };

    tool.onMouseDrag = event => {
      event.preventDefault();
      path.add(event.point);
    };

    tool.onMouseUp = event => {
      event.preventDefault();

      if (this.toggle === "pen") {
        path.smooth();
        path.simplify();
      } else {
        const children = project.activeLayer.children;
        for (let i = children.length - 1; i >= 0; i--) {
          if (path.getIntersections(children[i]).length) {
            children[i].remove();
          }
        }
        path.remove();
      }

      store.commit("newProject", project.exportJSON());
      store.commit("updateLast", view.size.width);
    };
  },

  methods: {
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
