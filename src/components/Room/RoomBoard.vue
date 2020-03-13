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
    message: "",
    board_size: "height: 0px",
    save_func: undefined
  }),
  created() {},
  mounted() {
    this.checkResize();

    //
    //var canvas = document.getElementsByClassName('whiteboard')[0];
    const store = this.$store;
    let canvas = document.getElementsByClassName("whiteboard")[0];

    const context = canvas.getContext("2d");
    const current = {
      color: "black"
    };
    let drawing = false;

    canvas.addEventListener("mousedown", onMouseDown, false);
    canvas.addEventListener("mouseup", onMouseUp, false);
    canvas.addEventListener("mouseout", onMouseUp, false);
    canvas.addEventListener("mousemove", throttle(onMouseMove, 10), false);

    //Touch support for mobile devices
    canvas.addEventListener("touchstart", onMouseDown, false);
    canvas.addEventListener("touchend", this.onMouseUp, false);
    canvas.addEventListener("touchcancel", this.onMouseUp, false);
    canvas.addEventListener("touchmove", throttle(onMouseMove, 10), false);

    window.addEventListener("resize", onResize, false);

    // make the canvas fill its parent
    let onResize = () => {
      canvas = document.getElementsByClassName("whiteboard")[0];

      if (window.innerHeight - 140 < window.innerWidth) {
        canvas.width = window.innerHeight - 140;
        canvas.height = window.innerHeight - 140;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerWidth;
      }
    };

    onResize();

    function drawLine(x0, y0, x1, y1, color, emit) {
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = color;
      context.lineWidth = 2;
      context.stroke();
      context.closePath();

      if (!emit) {
        return;
      }

      let w = canvas.width;
      let h = canvas.height;

      store.commit("setDraw", {
        x0,
        y0,
        x1,
        y1,
        x0: x0 / w,
        y0: y0 / h,
        x1: x1 / w,
        y1: y1 / h,
        color: color
      });
    }

    function onMouseDown(e) {
      drawing = true;
      const bcr = canvas.getBoundingClientRect();
      current.x = e.clientX - bcr.x || e.touches[0].clientX - bcr.x;
      current.y = e.clientY - bcr.y || e.touches[0].clientY - bcr.y;
    }

    function onMouseUp(e) {
      if (!drawing) {
        return;
      }
      drawing = false;

      const bcr = canvas.getBoundingClientRect();

      drawLine(
        current.x,
        current.y,
        e.clientX - bcr.x || e.touches[0].clientX - bcr.x,
        e.clientY - bcr.y || e.touches[0].clientY - bcr.y,
        current.color,
        true
      );
    }

    function onMouseMove(e) {
      if (!drawing) {
        return;
      }

      const bcr = canvas.getBoundingClientRect();

      drawLine(
        current.x,
        current.y,
        e.clientX - bcr.x || e.touches[0].clientX - bcr.x,
        e.clientY - bcr.y || e.touches[0].clientY - bcr.y,
        current.color,
        true
      );
      current.x = e.clientX - bcr.x || e.touches[0].clientX - bcr.x;
      current.y = e.clientY - bcr.y || e.touches[0].clientY - bcr.y;
    }

    function onColorUpdate(e) {
      current.color = e.target.className.split(" ")[1];
    }

    // limit the number of events per second
    function throttle(callback, delay) {
      let previousCall = new Date().getTime();
      return function() {
        let time = new Date().getTime();

        if (time - previousCall >= delay) {
          previousCall = time;
          callback.apply(null, arguments);
        }
      };
    }

    function onDrawingEvent({ x0, y0, x1, y1, color }) {
      let w = canvas.width;
      let h = canvas.height;

      drawLine(x0 * w, y0 * h, x1 * w, y1 * h, color);
    }

    this.save_func = onDrawingEvent;
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
  computed: {
    ...mapState(["drawing"])
  },
  watch: {
    drawing() {
     this.save_func(this.drawing);
    }
  }
};
</script>
<style lang="sass">
.whiteboard
    background-color: rgb(240,240,255)
</style>
