<template>
  <v-app>
    <v-app-bar app clipped-right color="white" flat>
      <!-- MENU -->
      <v-btn icon v-if="!bot_nav_chat || !bot_nav" @click.prevent="back">
        <v-icon>mdi-chevron-double-left</v-icon>
      </v-btn>

      <!-- BACK -->
      <v-btn
        v-if="!bot_nav_board"
        icon
        @click.prevent="
          bot_nav_board = true;
          bot_nav_chat = false;
        "
      >
        <v-icon>
          mdi-chevron-left
        </v-icon>
      </v-btn>

      <v-toolbar-title class="pl-0 align-center">
        <span v-if="bot_nav_board || !bot_nav" class="title">HOLYBI ROOM</span>
        <span v-if="!bot_nav" class="title"> | </span>
        <span v-if="!bot_nav || bot_nav_chat" class="title">{{
          user ? user.name.toUpperCase() : ""
        }}</span>
      </v-toolbar-title>

      <!-- COPY -->
      <v-btn icon v-if="bot_nav_board || !bot_nav" v-clipboard="hreff">
        <v-icon small>mdi-content-copy</v-icon>
      </v-btn>

      <v-spacer />

      <!-- CHAT -->
      <v-btn
        v-if="bot_nav && bot_nav_board"
        icon
        @click.prevent="
          bot_nav_board = false;
          bot_nav_chat = true;
        "
      >
        <v-icon>
          mdi-forum
        </v-icon>
      </v-btn>

      <!-- DRAWER -->
      <v-app-bar-nav-icon
        v-if="!bot_nav_board || !bot_nav"
        @click.prevent="drawer = !drawer"
      />
    </v-app-bar>

    <v-navigation-drawer
      disable-resize-watcher
      v-model="drawer"
      app
      clipped
      right
    >
      <v-list dense nav>
        <v-list-item v-for="u in users" :key="u.id" link>
          <v-list-item-content>
            <v-list-item-title
              >{{ u.name }}
              <span v-for="(i, index) in u.icons" :key="index + 'icons'">
                <v-icon small>{{ i.icon }}</v-icon>
              </span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-content v-resize="resize">
      <v-container class="pb-0 pt-0">
        <v-row class="d-flex justify-center">
          <v-col
            v-if="bot_nav_board"
            md="6"
            :sm="bot_nav ? '12' : '6'"
            class="pb-0 pt-0"
          >
            <div class="d-flex justify-center">
              <VBoard />
            </div>
          </v-col>
          <v-col v-if="!bot_nav" md="1"></v-col>
          <v-col
            v-if="bot_nav_chat"
            md="5"
            :sm="bot_nav ? '12' : '5'"
            class="pb-0 pt-0"
          >
            <div class="d-flex justify-center">
              <VChat />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import VBoard from "./VBoard";
import VChat from "./VChat";

import { mapState } from "vuex";

export default {
  name: "Room",
  data: () => ({
    hreff: window.location.href,
    drawer: false,
    bot_nav: false,
    bot_nav_board: true,
    bot_nav_chat: false
  }),
  mounted() {
    this.resize();
  },
  methods: {
    back() {
      this.$store.commit("setMode", "Start");
      this.$router.replace("/");
    },
    resize() {
      if (window.innerWidth > 820) {
        this.bot_nav = false;
        this.bot_nav_board = true;
        this.bot_nav_chat = true;
      } else {
        this.bot_nav = true;
        if (this.bot_nav_board && this.bot_nav_chat) {
          this.bot_nav_board = true;
          this.bot_nav_chat = false;
        }
      }
    }
  },

  computed: {
    ...mapState(["user", "users"])
  },
  components: {
    VBoard,
    VChat
  }
};
</script>