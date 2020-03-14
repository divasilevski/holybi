<template>
  <div class="main-div" v-resize="onResize">
    <!-- MESSAGE BLOCK -->
    <div
      class="overflow-y-auto elevation-0"
      ref="message_block"
      :style="message_block_height"
    >
      <!-- ITERATIONS -->
      <div v-for="(m, index) in messages" :key="index + 'message_iterations'">
        <!-- NORMAL MESSAGE -->
        <v-container
          v-if="m.type === 'user' && m.id !== user.id"
          class="d-flex justify-start pr-pl-4 pb-0 pt-1"
        >
          <v-card
            color="light-blue lighten-5"
            max-width="85%"
            class="d-inline-flex"
            style="min-width: 60%; border-radius: 0px 15px 15px 15px"
          >
            <div class="diviant pr-3">
              {{ m.time }}
            </div>
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
              <div v-html="m.message.split('\n').join('<br/>')"></div>
            </v-card-text>
          </v-card>
        </v-container>

        <v-container
          v-else-if="m.type === 'user' && m.id === user.id"
          class="d-flex justify-end pr-pl-4 pb-0 pt-1"
        >
          <v-card
            color="light-blue lighten-3"
            max-width="85%"
            class="d-inline-flex"
            style="min-width: 60%; border-radius: 15px 0px 15px 15px"
          >
            <div class="diviant pr-3">
              {{ m.time }}
            </div>
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
              <div v-html="m.message.split('\n').join('<br/>')"></div>
            </v-card-text>
          </v-card>
        </v-container>

        <!-- ADMIN MESSAGE -->
        <v-container v-else class="d-flex justify-center pa-0 pt-2 pb-1">
          <v-chip small color="pink lighten-5">{{ m.message }}</v-chip>
        </v-container>
      </div>

      <!-- TYPING -->
      <!-- <div v-for="(t, index) in typing" :key="index-1000">
        <v-container v-if="t.id !== user.id" class="d-flex justify-left pa-0">
          <v-chip x-small color="white">{{ t.author }} печатает...</v-chip>
        </v-container>
      </div> -->

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
    ...mapState(["user", "messages"])
  },

  data: () => ({
    message: "",
    message_block_height: "",
    typing: [
      { author: "Голубь Инокентий", id: "" },
      { author: "Енот", id: "" },
      { author: "Пёсик", id: "12345" }
    ]
  }),

  mounted() {
    this.onResize();
    this.scrollTop();
  },

  watch: {
    messages() {
      this.scrollTop();
    }
  },

  methods: {
    onResize() {
      this.message_block_height = `height: ${window.innerHeight - 140}px;`;
    },
    handleKeypress(event) {
      if (!event.shiftKey && event.which === 13) {
        event.preventDefault();
        this.sendMessage();
      }
    },
    scrollTop() {
      setTimeout(() => {
        this.$refs.message_block.scrollTop = this.$refs.message_block.scrollHeight;
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
    }
  }
};
</script>

<style>
::-webkit-scrollbar {
  width: 10px;
}
html {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.main-div {
  width: 100%;
  max-width: 380px;
}
.diviant {
  font-size: 8pt;
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>
