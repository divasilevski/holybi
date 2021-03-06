<template>
  <div class="main-div" v-resize="onResize">
    <!-- MESSAGE BLOCK -->
    <div
      class="overflow-y-auto elevation-0"
      ref="message_block"
      v-on:scroll="onScroll"
      :style="message_block_height"
    >
      <!-- SCROLL BUTTON -->
      <v-fab-transition>
        <v-btn
          v-if="btn_scroll"
          @click.prevent="scrollTop"
          absolute
          small
          fab
          style="bottom: 90px;"
          class="elevation-2"
          color="light-blue lighten-1"
        >
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </v-fab-transition>

      <v-img src="../assets/logo.png" contain height="152px" class="pa-10"></v-img>

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
                class="font-weight-black caption"
              >
                <strong>{{ m.author }}</strong>
              </div>

              <!-- Message -->
              <div v-html="upgradeMessage(m.message)"></div>
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
        autofocus
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
        :append-icon="message.trim() ? 'mdi-send' : undefined"
        @click:append="sendMessage"
      ></v-textarea>
    </v-form>
  </div>
</template>

<script>
import { mapState } from "vuex";

const SCROLL_FPS = 30;
const SCROLL_HEIGHT = 700;
const SCROLL_TIME = 800;

export default {
  computed: {
    ...mapState(["user", "messages", "typing"])
  },

  data: () => ({
    message: "",
    btn_scroll: false,
    message_block_height: "",
    typing_user: false,
    typing_user_end: false,
    typing_timer: undefined
  }),

  mounted() {
    this.onResize();
    const msgb = this.$refs.message_block;
    if (msgb) {
      setTimeout(() => {
        msgb.scrollTop = msgb.scrollHeight;
      });
    }
  },

  watch: {
    message(message) {
      if (message.trim()) {
        this.typing_user = true;
        clearTimeout(this.typing_timer);
        this.typing_timer = setTimeout(() => {
          this.typing_user = false;
          this.typing_user_end = true;
        }, 1800);
      } else {
        this.typing_user = false;
        this.typing_user_end = true;
        clearTimeout(this.typing_timer);
      }
    },

    typing_user(bool) {
      if (bool)
        this.$store.commit("addTyping", {
          author: this.user.name,
          id: this.user.id
        });
      else this.$store.commit("delTyping", this.user.id);
    },

    typing(value) {
      if (!value.filter(obj => obj.id === this.user.id).length) {
        if (!this.typing_user_end) {
          const msgb = this.$refs.message_block;
          if (msgb.scrollHeight - msgb.scrollTop < SCROLL_HEIGHT)
            this.scrollTop();
        }
      }

      this.typing_user_end = false;
    },

    messages() {
      const msgb = this.$refs.message_block;

      if (
        msgb.scrollHeight - msgb.scrollTop < SCROLL_HEIGHT ||
        this.messages[this.messages.length - 1].id === this.user.id
      )
        this.scrollTop();
    }
  },

  methods: {
    onScroll() {
      const msgb = this.$refs.message_block;

      this.btn_scroll =
        msgb.scrollHeight - msgb.scrollTop < SCROLL_HEIGHT ? false : true;
    },

    onResize() {
      this.message_block_height = `height: ${window.innerHeight - 140}px;`;
      const msgb = this.$refs.message_block;
      if (msgb) {
        setTimeout(() => {
          msgb.scrollTop = msgb.scrollHeight;
        });
      }
    },

    handleKeypress(event) {
      if (!event.shiftKey && event.keyCode === 13) {
        if (!this.$device.mobile) {
          event.preventDefault();
          this.sendMessage();
        }
      }
    },

    scrollTop() {
      setTimeout(() => {
        const msgb = this.$refs.message_block;

        const distance = msgb.scrollHeight - msgb.scrollTop;
        const interval = distance / SCROLL_FPS;

        const process = setInterval(() => {
          msgb.scrollTop += interval;
        }, SCROLL_TIME / SCROLL_FPS);

        setTimeout(() => {
          clearInterval(process);
        }, SCROLL_TIME);
      }, 0);
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
    },

    upgradeMessage(message) {
      const re = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

      let subst = (match, p) =>
        `<a href="${p}" target="_blank">${p.slice(0, 30)}...</a>`;

      return message
        .split("\n")
        .join("<br/>")
        .replace(re, subst);
    }
  }
};
</script>

<style>
.main-div {
  width: 100%;
  max-width: 380px;
}
.message-card {
  max-width: 85%;
  min-width: 60%;
}
.message-time {
  color: #4e79d4;
  font-size: 8pt;
  position: absolute;
  right: 0;
  bottom: 0;
}
/* Delete scrolls */
::-webkit-scrollbar {
  width: 0px;
}
html {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
