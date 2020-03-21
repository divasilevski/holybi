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

    <v-toolbar height="36px" dense flat class="pa-0">
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

      <v-divider vertical></v-divider>

      <chrome-picker
        v-show="is_color_picker"
        v-model="main_color"
        disableAlpha
        disableFields
        class="picker"
      />

      <v-btn icon @click.prevent="setStroke">
        <v-slider
          v-show="is_stroke"
          v-model="stroke_width"
          @end="is_color_picker = false"
          class="slider"
          vertical
          height="100px"
          thumb-label
          max="10"
          min="1"
        ></v-slider>
        <v-icon small>mdi-checkbox-blank-circle-outline</v-icon>
      </v-btn>
      <v-btn icon @click.prevent="setColor">
        <v-icon small :style="'color: ' + main_color.hex"
          >mdi-checkbox-blank</v-icon
        >
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
import { Chrome } from "vue-color";

export default {
  computed: {
    ...mapState(["last", "project", "drawing"])
  },

  data: () => ({
    toggle: "pen",
    board_size: "",
    size: 800,
    path: undefined,
    isDraw: false,
    main_color: { hex: "#000000" },
    is_color_picker: false,
    stroke_width: 1,
    is_stroke: false
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
      this.is_stroke = false;
      this.is_color_picker = false;
      this.path = new Path();
      if (this.toggle === "pen") {
        this.path.strokeColor = this.main_color.hex;
        this.path.strokeWidth = 2 * this.stroke_width;
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

    setColor() {
      this.is_stroke = false;
      this.is_color_picker = !this.is_color_picker;
    },

    setStroke() {
      this.is_color_picker = false;
      this.is_stroke = !this.is_stroke;
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
  },
  components: {
    "chrome-picker": Chrome
  }
};
</script>
<style lang="sass">
canvas[resize]
    width: 100%
    height: 100%
    background: #EFFFFD

.picker
  position: fixed
  bottom: 45px
.slider
  position: fixed
  bottom: 67px
</style>
