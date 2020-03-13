<template>
  <div v-resize="checkResize">
    <div
       ref="block"
      style="max-width: 370px;"
      :style="chat_height"
      class="overflow-y-auto"
      elevation="0"
    >
      <div v-for="(m, index) in messages" :key="index">
        <v-container
          v-if="m.type === 'user' && m.id !== user.id"
          class="d-flex justify-start pa-2"
        >
          <v-card color="cyan lighten-5" max-width="85%" class="d-inline-flex">
            <v-card-text class="pa-2">
              <div class="overline">
                <strong>{{ m.author }}</strong>
              </div>
              {{ m.message }}
            </v-card-text>
          </v-card>
        </v-container>

        <v-container
          v-else-if="m.type === 'user' && m.id === user.id"
          class="d-flex justify-end pa-2"
        >
          <v-card
            color="light-blue lighten-3"
            max-width="85%"
            class="d-inline-flex"
          >
            <v-card-text class="pa-2">
              <div class="overline">
                <strong>{{ m.author }}</strong>
              </div>
              {{ m.message }}
            </v-card-text>
          </v-card>
        </v-container>

        <v-container v-else class="d-flex justify-center pa-0">
          <v-chip small color="blue-grey lighten-5">{{ m.message }}</v-chip>
        </v-container>
      </div>

      <!-- TYPING -->
      <!-- <div v-for="(t, index) in typing" :key="index-1000">
        <v-container v-if="t.id !== user.id" class="d-flex justify-left pa-0">
          <v-chip x-small color="white">{{ t.author }} печатает...</v-chip>
        </v-container>
      </div> -->
    </div>
    <v-form class="pt-2" style="max-width: 350px;" @submit.prevent>
      <v-text-field
        v-on:keyup.enter="sendMessage"
        @click="sendMessage"
        dense
        rounded
        hide-details
        v-model="message"
        solo
        label="Message"
        type="text"
      ><btn icon><v-icon>mdi-send</v-icon></btn></v-text-field>
    </v-form>
  </div>
</template>

<script>
export default {
  name: "Chat",
  data: () => ({
    message: "",
    chat_height: "height: 0px",
    user: {
      name: "Песик",
      id: "12345"
    },
    typing: [
      { author: "Голубь Инокентий", id: "" },
      { author: "Енот", id: "" },
      { author: "Пёсик", id: "12345" }
    ],
    messages: [
      {
        type: "user",
        author: "Голубь Инокентий",
        id: "",
        message: "Я голубь, а ты никто"
      },
      {
        type: "user",
        author: "Пёсик",
        id: "12345",
        message: "Я вообще то безумец, каких ещё поискать. Наглец ты эдакий."
      },
      {
        type: "user",
        author: "Енот",
        id: "",
        message: "Вот же вы дурачки"
      },
      {
        type: "admin",
        author: "",
        id: "",
        message: "Картофель Иван подключился"
      },
      {
        type: "user",
        author: "Пёсик",
        id: "12345",
        message: "Тоже мне аналитики нашлись. Привет!"
      },
      {
        type: "user",
        author: "Голубь Инокентий",
        id: "",
        message: "Я голубь, а ты никто"
      }
    ]
  }),
  mounted() {
    this.checkResize();
  },
  watch: {
    messages() {
      console.log(this.$refs)
      setTimeout(() => {
        this.$refs.block.scrollTop = this.$refs.block.scrollHeight;
      }, 0);
    }
  },

  methods: {
    checkResize() {
      this.chat_height = `height: ${window.innerHeight - 150}px;`;
    },
    sendMessage() {
      if (this.message)
        this.messages.push({
          type: "user",
          author: this.user.name,
          id: this.user.id,
          message: this.message
        });
    }
  },
  computed: {}
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
</style>
