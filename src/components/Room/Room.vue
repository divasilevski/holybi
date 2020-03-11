<template>
  <v-app>
    <v-app-bar app clipped-right color="white" flat>
      <v-btn icon>
        <v-icon>
          mdi-chevron-left
        </v-icon>
      </v-btn>

      <v-toolbar-title class="mr-12 align-center">
        <span class="title">
          HOLYBI ROOM
        </span>
      </v-toolbar-title>

      <v-btn
        v-if="this.bot_nav"
        @click="
          bot_nav_board = true;
          bot_nav_chat = false;
        "
      >
        <span>B</span>
      </v-btn>
      <v-btn
        v-if="this.bot_nav"
        @click="
          bot_nav_board = false;
          bot_nav_chat = true;
        "
      >
        <span>C</span>
      </v-btn>

      <v-spacer />

      <v-app-bar-nav-icon @click.prevent="drawer = !drawer" />
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app clipped right>
      <v-list dense nav>
        <v-list-item v-for="user in users" :key="user.id" link>
          <v-list-item-content>
            <v-list-item-title>{{ user.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-content v-resize="checkResize">
      <v-container class="pb-0 pt-0">
        <v-row class="d-flex justify-center">
          <v-col v-if="bot_nav_board" cols="12" md="7" sm="7" class="pb-0 pt-0">
            <div class="d-flex justify-center">
              <RoomBoard />
            </div>
          </v-col>
          <v-col v-if="bot_nav_chat" cols="12" md="5" sm="5" class="pb-0 pt-0">
            <div class="d-flex justify-center">
              <RoomChat />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import RoomBoard from "./RoomBoard";
import RoomChat from "./RoomChat";
export default {
  data: () => ({
    name: "Room",
    drawer: false,
    user: { name: "Dima" },
    users: [],
    bot_nav: true,
    bot_nav_board: true,
    bot_nav_chat: false
  }),
  mounted() {
    this.checkResize();
  },
  methods: {
    checkResize() {
      if (window.innerWidth > 650) {
        this.bot_nav = false;
        this.bot_nav_board = true;
        this.bot_nav_chat = true;
      } else {
        this.bot_nav = true;
        this.bot_nav_board = true;
        this.bot_nav_chat = false;
      }
    }
  },
  components: {
    RoomBoard,
    RoomChat
  }
};
</script>
