<template>
  <div v-resize="checkResize" style="width:100%; max-width: 380px;">
    <div
      ref="block"
      style="width:100%;"
      :style="chat_height"
      class="overflow-y-auto"
      elevation="0"
    >
      <div v-for="(m, index) in messages" :key="index">
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
              {{ m.message }}
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
              {{ m.message }}
            </v-card-text>
          </v-card>
        </v-container>

        <v-container v-else class="d-flex justify-center pa-0 pt-2 pb-1">
          <v-chip small color="pink lighten-5">{{ m.message }}</v-chip>
        </v-container>
      </div>
      <div class="pa-1"></div>

      <!-- TYPING -->
      <!-- <div v-for="(t, index) in typing" :key="index-1000">
        <v-container v-if="t.id !== user.id" class="d-flex justify-left pa-0">
          <v-chip x-small color="white">{{ t.author }} печатает...</v-chip>
        </v-container>
      </div> -->
    </div>
    <v-form class="pt-2" @submit.prevent>
      <v-text-field
        v-on:keyup.enter="sendMessage"
        dense
        rounded
        hide-details
        v-model="message"
        solo
        label="Message"
        type="text"
        ><btn @click="sendMessage" icon
          ><v-icon>mdi-send</v-icon></btn
        ></v-text-field
      >
    </v-form>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Chat",
  data: () => ({
    message: "",
    chat_height: "height: 0px",
    typing: [
      { author: "Голубь Инокентий", id: "" },
      { author: "Енот", id: "" },
      { author: "Пёсик", id: "12345" }
    ]
  }),
  mounted() {
    this.checkResize();
  },
  watch: {
    messages() {
      setTimeout(() => {
        this.$refs.block.scrollTop = this.$refs.block.scrollHeight;
      }, 0);
    }
  },

  methods: {
    checkResize() {
      this.chat_height = `height: ${window.innerHeight - 140}px;`;
    },
    sendMessage() {
      this.$store.commit("addMessage", {
        type: "user",
        author: this.user.name,
        id: this.user.id,
        message: this.message,
        time: new Date().toLocaleTimeString().slice(0, 5)
      });
    }
  },
  computed: {
    ...mapState(["user", "messages"])
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
.diviant {
  font-size: 8pt;
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>
