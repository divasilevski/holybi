<template>
  <div class="fill-height justify-center">
    <p
      class="text-center mt-7 display-4 font-weight-medium"
      style="text-shadow: 1px 1px 2px black"
    >
      <v-img
        src="../assets/logo.png"
        contain
        height="192px"
        class="pa-7 pb-12"
      ></v-img>
      HOLYBI
    </p>

    <div class="d-flex justify-center mt-7">
      <v-hover>
        <template v-slot="{ hover }">
          <v-btn tile color="blue" width="300px" :elevation="hover ? 10 : 2" @click="generate"
            >Начать</v-btn
          >
        </template>
      </v-hover>
    </div>
  </div>
</template>

<script>
export default {
  name: "Start",
  data: () => ({
    valid: true,
    room_id: ""
  }),
  methods: {
    generate() {
      var password = "";
      var symbols =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345678-+_*^$#№";
      for (var i = 0; i < 10; i++) {
        password += symbols.charAt(Math.floor(Math.random() * symbols.length));
      }

      this.$router.replace(`/?id=${password}`);
      this.$store.commit("setMode", "Room");
    }
  }
};
</script>
