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
import paper from "paper"; //
import { mapState } from "vuex";

const DRAW_DELAY = 10;

export default {
  data: () => ({
    canvas: undefined,
    img_data: undefined,
    context: undefined,
    current: {
      color: "black"
    },
    drawing: false,
    message: "",
    board_size: "",
    save_func: undefined,
    path: undefined,
    size: {
      width: 800,
      height: 800
    }
  }),
  created() {
    paper.install(window); //
    this.checkResize();
  },
  mounted() {
    //let actual_ratio = $("#canvas").innerWidth() / original_size.width;
    //let last_width = $("#canvas").innerWidth();

    paper.setup("canvas");
    let last_w = this.size.width;

    window.onload = function() {
      // Create a simple drawing tool:

      let tool = new Tool();
      let path;

      view.onResize = function(event) {
        paper.view.setViewSize(
          new paper.Size(this.size.width, this.size.height)
        );

        let scale = this.size.width / last_w;
        last_w = this.size.width;

        path.position = paper.view.center;
        path.scale(scale);
      };

      tool.onMouseDown = function(event) {
        event.preventDefault();

        //
        path = new Path();
        path.strokeColor = "black";
      };

      tool.onMouseDrag = function(event) {
        event.preventDefault();
        path.add(event.point);
      };

      tool.onMouseUp = function(event) {
        event.preventDefault();

        //
        path.smooth();
        path.simplify();
      };
    };
  },
  methods: {
    drawLine(x0, y0, x1, y1, color, emit) {
      this.context.beginPath();
      this.context.moveTo(x0, y0);
      this.context.lineTo(x1, y1);
      this.context.strokeStyle = color;
      this.context.lineWidth = 2;
      this.context.stroke();
      this.context.closePath();

      if (!emit) {
        return;
      }

      let w = this.canvas.width;
      let h = this.canvas.height;

      this.$store.commit("setDraw", {
        x0: x0 / w,
        y0: y0 / h,
        x1: x1 / w,
        y1: y1 / h,
        color: color
      });

      this.img_data = this.canvas.canvas;
    },
    onMouseDown(e) {
      e.preventDefault();
      this.drawing = true;
      const bcr = this.canvas.getBoundingClientRect();
      this.current.x = e.clientX - bcr.x || e.changedTouches[0].clientX - bcr.x;
      this.current.y = e.clientY - bcr.y || e.changedTouches[0].clientY - bcr.y;
    },
    onMouseUp(e) {
      e.preventDefault();

      if (!this.drawing) {
        return;
      }
      this.drawing = false;

      const bcr = this.canvas.getBoundingClientRect();

      this.drawLine(
        this.current.x,
        this.current.y,
        e.clientX - bcr.x || e.changedTouches[0].clientX - bcr.x,
        e.clientY - bcr.y || e.changedTouches[0].clientY - bcr.y,
        this.current.color,
        true
      );
    },

    onMouseMove(e) {
      e.preventDefault();
      if (!this.drawing) {
        return;
      }

      const bcr = this.canvas.getBoundingClientRect();

      this.drawLine(
        this.current.x,
        this.current.y,
        e.clientX - bcr.x || e.changedTouches[0].clientX - bcr.x,
        e.clientY - bcr.y || e.changedTouches[0].clientY - bcr.y,
        this.current.color,
        true
      );
      this.current.x = e.clientX - bcr.x || e.changedTouches[0].clientX - bcr.x;
      this.current.y = e.clientY - bcr.y || e.changedTouches[0].clientY - bcr.y;
    },

    // limit the number of events per second
    throttle(callback, delay) {
      let previousCall = new Date().getTime();
      return function() {
        let time = new Date().getTime();

        if (time - previousCall >= delay) {
          previousCall = time;
          callback.apply(null, arguments);
        }
      };
    },

    onDrawingEvent({ x0, y0, x1, y1, color }) {
      let w = this.canvas.width;
      let h = this.canvas.height;

      this.drawLine(x0 * w, y0 * h, x1 * w, y1 * h, color);
    },
    checkResize() {
      if (window.innerHeight - 140 < window.innerWidth) {
        this.board_size = `height: ${window.innerHeight -
          140}px; width: ${window.innerHeight - 140}px`;
        this.size.width = window.innerHeight - 140;
        this.size.height = window.innerHeight - 140;
      } else {
        this.board_size = `height: ${window.innerWidth}px; width: ${window.innerWidth}px`;
        this.size.width = window.innerHeight - 140;
        this.size.height = window.innerHeight - 140;
      }
    }
  },
  computed: {
    ...mapState(["drawIt"])
  },
  watch: {
    drawIt() {
      this.onDrawingEvent(this.drawIt);
    }
  },

  destroyed() {
    // LIST
  }
};
</script>
<style lang="sass">
canvas[resize]
    width: 100%
    height: 100%
    background: #E9FFFD
</style>
