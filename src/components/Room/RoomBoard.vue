<template>
  <div v-resize="checkResize">
    <canvas class="whiteboard" :style="board_size"></canvas>

    <v-toolbar dense flat class="pa-0">
      <v-btn-toggle class="pa-0" color="primary" dense group multiple>
        <!-- <v-btn :value="1" text>
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
        </v-btn> -->
      </v-btn-toggle>

      <div class="mx-4"></div>
    </v-toolbar>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    canvas: undefined,
    context: undefined,
    current: {
      color: "black"
    },
    drawing: false,
    message: "",
    board_size: "height: 0px",
    save_func: undefined
  }),
  created() {},
  mounted() {
    this.canvas = document.getElementsByClassName("whiteboard")[0];
    this.context = document
      .getElementsByClassName("whiteboard")[0]
      .getContext("2d");

    if (this.canvas) {
      this.checkResize();
    }

    this.canvas.addEventListener("mousedown", this.onMouseDown, false);
    this.canvas.addEventListener("mouseup", this.onMouseUp, false);
    this.canvas.addEventListener("mouseout", this.onMouseUp, false);
    this.canvas.addEventListener(
      "mousemove",
      this.throttle(this.onMouseMove, 10),
      false
    );

    //Touch support for mobile devices
    this.canvas.addEventListener("touchstart", this.onMouseDown, false);
    this.canvas.addEventListener("touchend", this.onMouseUp, false);
    this.canvas.addEventListener("touchcancel", this.onMouseUp, false);
    this.canvas.addEventListener(
      "touchmove",
      this.throttle(this.onMouseMove, 10),
      false
    );
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
    },
    onMouseDown(e) {
      e.preventDefault();
      this.drawing = true;
      const bcr = this.canvas.getBoundingClientRect();
      this.current.x = e.clientX - bcr.x || e.touches[0].clientX - bcr.x;
      this.current.y = e.clientY - bcr.y || e.touches[0].clientY - bcr.y;
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
        e.clientX - bcr.x || e.touches[0].clientX - bcr.x,
        e.clientY - bcr.y || e.touches[0].clientY - bcr.y,
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
        e.clientX - bcr.x || e.touches[0].clientX - bcr.x,
        e.clientY - bcr.y || e.touches[0].clientY - bcr.y,
        this.current.color,
        true
      );
      this.current.x = e.clientX - bcr.x || e.touches[0].clientX - bcr.x;
      this.current.y = e.clientY - bcr.y || e.touches[0].clientY - bcr.y;
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

        if (this.canvas) {
          this.canvas.width = window.innerHeight - 140;
          this.canvas.height = window.innerHeight - 140;
        }
      } else {
        this.board_size = `height: ${window.innerWidth}px; width: ${window.innerWidth}px`;

        if (this.canvas) {
          this.canvas.width = window.innerWidth;
          this.canvas.height = window.innerWidth;
        }
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
  }
};
</script>
<style lang="sass">
.whiteboard
    background: #E9FFFD
</style>
