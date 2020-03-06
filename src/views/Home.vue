<template>
  <v-container class="fill-height justify-center">
    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent>
      <v-text-field
        v-model="room_id"
        class="ma-5"
        label="Комната"
        :rules="rules"
        hide-details="auto"
        v-on:keyup.enter="clickEnter"
        required
      ></v-text-field>

      <v-btn class="ma-5" @click="clickEnter">Войти в комнату</v-btn>
    </v-form>
  </v-container>
</template>

<script>
export default {
  name: "Home",
  data: () => ({
    valid: true,
    room_id: "",
    rules: [
      v => !!v || "Придумайте id для комнаты",
      v => (v && v.length <= 10) || "id превышет 10 символов"
    ]
  }),
  methods: {
    clickEnter() {
      if (this.$refs.form.validate()) {
        console.log(`Вход в комнату ${this.room_id}`);
      }
    }
  },
  components: {}
};
</script>
