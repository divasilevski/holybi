<template>
  <v-container class="pa-0">
    <v-card
      style="max-height: 430px; max-width: 350px;"
      class="overflow-y-auto"
      elevation="0"
    >
      <v-container class="d-flex justify-start pa-2">
        <v-card color="cyan lighten-5" max-width="85%" class="d-inline-flex">
          <v-card-text class="pa-2">
            <div class="overline"><strong>Голубь Инокентий</strong></div>
            Я голубь, а ты никто
          </v-card-text>
        </v-card>
      </v-container>

      <v-container class="d-flex justify-end pa-2">
        <v-card
          color="light-blue lighten-3"
          max-width="85%"
          class="d-inline-flex"
        >
          <v-card-text class="pa-2">
            <div class="overline"><strong>Пёсик</strong></div>
            Я вообще то безумец, каких ещё поискать. Наглец ты эдакий.
          </v-card-text>
        </v-card>
      </v-container>

      <v-container class="d-flex justify-start pa-2">
        <v-card color="cyan lighten-5" max-width="85%" class="d-inline-flex">
          <v-card-text class="pa-2">
            <div class="overline"><strong>Енот</strong></div>
            Вот же вы дурачки
          </v-card-text>
        </v-card>
      </v-container>

      <v-container class="d-flex justify-center pa-0">
        <v-chip small color="blue-grey lighten-5"
          >Картофель Иван подключился</v-chip
        >
      </v-container>

      <v-container class="d-flex justify-start pa-2">
        <v-card color="cyan lighten-5" max-width="85%" class="d-inline-flex">
          <v-card-text class="pa-2">
            <div class="overline"><strong>Картофель Иван</strong></div>
            Всем привет!
          </v-card-text>
        </v-card>
      </v-container>

      <v-container class="d-flex justify-end pa-2">
        <v-card
          color="light-blue lighten-3"
          max-width="85%"
          class="d-inline-flex"
        >
          <v-card-text class="pa-2">
            <div class="overline"><strong>Пёсик</strong></div>
            Пфф.. Тоже мне аналитики нашлись! Привет!!!
          </v-card-text>
        </v-card>
      </v-container>

      <v-container class="d-flex justify-start pa-2">
        <v-card color="cyan lighten-5" max-width="85%" class="d-inline-flex">
          <v-card-text class="pa-2">
            <div class="overline"><strong>Енот</strong></div>
            Дарова, ёпт
          </v-card-text>
        </v-card>
      </v-container>

      <v-container class="d-flex justify-left pa-0">
        <v-chip x-small color="white"
          >Голубь Инокентий печатает...</v-chip
        >
      </v-container>
      <v-container class="d-flex justify-left pa-0">
        <v-chip x-small color="white"
          >Картофель Иван печатает...</v-chip
        >
      </v-container>
      
    </v-card>
    <v-form class="pt-2">
      <v-container>
        <v-text-field
          dense
          rounded
          hide-details
          append-outer-icon="mdi-send"
          v-model="message"
          solo
          label="Message"
          type="text"
        ></v-text-field>
      </v-container>
    </v-form>
  </v-container>
</template>

<script>
export default {
  name: "Chat",
  data: () => ({
    message: ""
  }),

  computed: {},

  methods: {}
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
