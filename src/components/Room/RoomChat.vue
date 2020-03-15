<template>
  <div class="main-div" v-resize="onResize">
    <!-- MESSAGE BLOCK -->
    <div
      class="overflow-y-auto elevation-0"
      ref="message_block"
      v-on:scroll="onScroll"
      :style="message_block_height"
    >
      <v-fab-transition>
        <v-btn
          v-if="btn_scroll"
          @click="scrollTop"
          absolute
          small
          fab
          style="bottom: 70px;"
          class="elevation-1 button-outline"
          color="light-blue lighten-1"
        >
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </v-fab-transition>
      <div class="attenuation"></div>

      <div class="indent"></div>

      <!-- ITERATIONS -->
      <div v-for="(m, index) in messages" :key="index + 'message_iterations'">
        <!-- NORMAL MESSAGE -->
        <v-container
          v-if="m.type === 'user'"
          class="d-flex pr-pl-4 pb-0 pt-1"
          :class="m.id === user.id ? 'justify-end' : 'justify-start'"
        >
          <v-card
            class="message-card d-inline-flex"
            :color="
              m.id === user.id ? 'light-blue lighten-2' : 'light-blue lighten-4'
            "
            :style="
              m.id === user.id
                ? 'border-radius: 15px 0px 15px 15px'
                : 'border-radius: 0px 15px 15px 15px'
            "
          >
            <!-- Time -->
            <div class="message-time pr-3">{{ m.time }}</div>

            <!-- Author -->
            <v-card-text class="pt-2 pb-3 pl-3 pr-3">
              <div
                v-if="
                  messages[index - 1]
                    ? messages[index - 1].author !== m.author
                    : true
                "
                class="font-weight-black caption font-italic"
              >
                <strong>{{ m.author }}</strong>
              </div>

              <!-- Message -->
              <div v-html="m.message.split('\n').join('<br/>')"></div>
            </v-card-text>
          </v-card>
        </v-container>

        <!-- ADMIN MESSAGE -->
        <v-container v-else class="d-flex justify-center pa-0 pt-2 pb-1">
          <v-chip small color="pink lighten-5">{{ m.message }}</v-chip>
        </v-container>
      </div>

      <!-- TYPING  -->
      <div v-for="(t, index) in typing" :key="index + 'typing'">
        <v-container
          v-if="t.id !== user.id"
          class="d-flex justify-left pa-0 pt-1"
        >
          <v-chip x-small color="white">{{ t.author }} печатает...</v-chip>
        </v-container>
      </div>

      <!-- SPACE -->
      <div class="pa-1"></div>
    </div>

    <!-- INPUT FORM -->
    <v-form class="pt-4" @submit.prevent fluid>
      <v-textarea
        contenteditable="true"
        autocomplete="off"
        v-on:keypress="handleKeypress($event)"
        v-model="message"
        solo
        hide-details
        no-resize
        rounded
        rows="1"
        label="Написать сообщение..."
        type="text"
        :append-icon="
          message.trim()
            ? message.trim().length > 5
              ? 'mdi-chevron-double-up'
              : 'mdi-chevron-up'
            : undefined
        "
        @click:append="sendMessage"
      ></v-textarea>
    </v-form>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["user", "messages", "typing"])
  },

  data: () => ({
    const_scroll_height: 800,
    message: "",
    btn_scroll: false,
    message_block_height: "",
    user_typing: false,
    user_typing_end: false,
    timer: undefined
  }),

  mounted() {
    this.onResize();
    if (this.$refs.message_block.scrollHeight) this.scrollTop();
  },

  watch: {
    message(message) {
      if (message.trim()) {
        this.user_typing = true;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.user_typing = false;
          this.user_typing_end = true;
        }, 1800);
      } else {
        this.user_typing = false;
        this.user_typing_end = true;
        clearTimeout(this.timer);
      }
    },
    user_typing(bool) {
      if (bool)
        this.$store.commit("addTyping", {
          author: this.user.name,
          id: this.user.id
        });
      else this.$store.commit("delTyping", this.user.id);
    },
    typing(value) {
      // Если данный пользователь начал печатать
      if (value.filter(obj => obj.id === this.user.id).length) return;
      else {
        // Если данный пользователь закончил печатать
        if (this.user_typing_end) return;
        else {
          // Если страница скролла не ушла далеко
          const msgb = this.$refs.message_block;

          if (msgb.scrollHeight - msgb.scrollTop < this.const_scroll_height)
            this.scrollTop();
        }
      }

      this.user_typing_end = false;
    },
    messages() {
      const msgb = this.$refs.message_block;

      if (
        msgb.scrollHeight - msgb.scrollTop < this.const_scroll_height ||
        this.messages[this.messages.length - 1].id === this.user.id
      )
        this.scrollTop();
    }
  },

  methods: {
    onScroll() {
      const msgb = this.$refs.message_block;

      this.btn_scroll =
        msgb.scrollHeight - msgb.scrollTop < this.const_scroll_height
          ? false
          : true;
    },
    onResize() {
      this.message_block_height = `height: ${window.innerHeight - 140}px;`;
    },
    handleKeypress(event) {
      if (!event.shiftKey && event.code === "Enter") {
        event.preventDefault();
        this.sendMessage();
      }
    },
    scrollTop() {
      setTimeout(() => {
        const fps = 50;
        const time = 1000;
        const msgb = this.$refs.message_block;
        const distance = msgb.scrollHeight - msgb.scrollTop;
        const speed = distance / fps;

        const interval = setInterval(() => {
          this.$refs.message_block.scrollTop += speed;
        }, time / fps);

        setTimeout(() => {
          clearInterval(interval);
        }, time);
        
      }, 0);
      this.btn_scroll = false;
    },
    sendMessage() {
      this.message = this.message.trim();
      if (this.message) {
        this.$store.commit("addMessage", {
          type: "user",
          author: this.user.name,
          id: this.user.id,
          message: this.message,
          time: new Date().toLocaleTimeString().slice(0, 5)
        });
        this.message = "";
      }
    }
  }
};
</script>

<style>
.main-div {
  width: 100%;
  max-width: 380px;
}
.attenuation {
  position: absolute;
  height: 5px;
  width: 100%;
  max-width: 380px;
  background: linear-gradient(rgb(255, 255, 255, 0.9), rgba(255, 255, 255, 0));
  z-index: 1;
}
.indent {
  padding-top: 100px;
}
.message-card {
  max-width: 85%;
  min-width: 60%;
}
.message-time {
  color: rgba(34, 87, 201, 0.678);
  font-size: 8pt;
  position: absolute;
  right: 0;
  bottom: 0;
}
/* Delete scrolls */
::-webkit-scrollbar {
  width: 10px;
}
html {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
