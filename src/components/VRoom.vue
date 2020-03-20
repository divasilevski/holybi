<template>
  <v-app>
    <!-- APP BAR -->
    <v-app-bar color="white" clipped-right flat app>
      <!-- toStart -->
      <v-btn v-if="!is_chat || !is_nav" @click.prevent="clickToStart" icon>
        <v-icon>mdi-chevron-double-left</v-icon>
      </v-btn>

      <!-- toBoard -->
      <v-btn v-if="!is_board" @click.prevent="clickToBoard" icon retain-focus-on-click>
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <!-- title -->
      <v-toolbar-title class="pl-0 align-center">
        <span v-if="is_board || !is_nav" class="title">HOLYBI ROOM</span>
        <span v-if="!is_nav" class="title"> | </span>
        <span v-if="!is_nav || is_chat" class="title">{{
          user ? user.name.toUpperCase() : ""
        }}</span>
      </v-toolbar-title>

      <!-- clickboard -->
      <v-btn icon v-if="is_board || !is_nav" v-clipboard="clickClipboard">
        <v-icon small>mdi-content-copy</v-icon>
      </v-btn>

      <v-spacer />

      <!-- toChat -->
      <v-btn v-if="is_nav && is_board" icon @click.prevent="clickToChat">
        <v-icon>mdi-forum</v-icon>
      </v-btn>

      <!-- toDrawer -->
      <v-app-bar-nav-icon
        v-if="!is_board || !is_nav"
        @click.prevent="clickToDrawer"
      />
    </v-app-bar>

    <!-- DRAWER -->
    <v-navigation-drawer
      v-if="is_nav || is_chat"
      v-model="drawer"
      disable-onResize-watcher
      disable-route-watcher
      touchless
      clipped
      right
      app
    >
      <v-list dense nav>
        <v-list-item v-for="u in users" :key="u.id" link>
          <v-list-item-content>
            <v-list-item-title>
              <!-- user names  -->
              {{ u.name }}
              <!-- user icons -->
              <span v-for="(i, index) in u.icons" :key="index + 'icons'">
                <v-icon small>{{ i.icon }}</v-icon>
              </span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- VIEW CONTENT -->
    <v-content v-resize="onResize">
      <v-container class="pb-0 pt-0">
        <v-row class="d-flex justify-center">
          <!-- Board -->
          <v-col
            v-show="is_board"
            class="pb-0 pt-0"
            md="6"
            :sm="is_nav ? '12' : '6'"
          >
            <div class="d-flex justify-center" style="height: 100%; width:100%">
              <VBoard />
            </div>
          </v-col>

          <!-- Spacer -->
          <v-col v-if="!is_nav" md="1"></v-col>

          <!-- Chat -->
          <v-col
            v-show="is_chat"
            class="pb-0 pt-0"
            md="5"
            :sm="is_nav ? '12' : '5'"
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

const CHANGE_STATE_WIDTH = 820;

export default {
  computed: {
    ...mapState(["user", "users"])
  },

  data: () => ({
    drawer: false,
    is_nav: false,
    is_board: true,
    is_chat: false
  }),

  mounted() {
    this.onResize();
  },

  methods: {
    clickClipboard() {
      return window.location.href;
    },

    clickToStart() {
      this.$store.commit("setMode", "Start");
      this.$router.replace("/");
    },

    clickToBoard() {
      this.$store.commit("drawing", true)
      this.is_board = true;
      this.is_chat = false;
    },

    clickToChat() {
      this.is_board = false;
      this.is_chat = true;
    },

    clickToDrawer() {
      this.drawer = !this.drawer;
    },

    onResize() {
      if (window.innerWidth > CHANGE_STATE_WIDTH) {
        this.is_nav = false;
        this.is_board = true;
        this.is_chat = true;
      } else {
        this.is_nav = true;
        if (this.is_board && this.is_chat) {
          this.is_board = true;
          this.is_chat = false;
        }
      }
    }
  },

  components: {
    VBoard,
    VChat
  }
};
</script>
