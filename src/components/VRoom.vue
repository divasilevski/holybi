<template>
  <v-app>
    <!-- APP BAR -->
    <v-app-bar color="white" clipped-right flat app height="56px">
      <!-- toStart -->
      <v-btn
        v-show="!is_chat || !is_nav"
        @click.prevent="clickToStart"
        icon
        style="margin-left: -12"
      >
        <v-icon>mdi-chevron-double-left</v-icon>
      </v-btn>

      <!-- toBoard -->
      <v-btn
        v-show="!is_board"
        @click.prevent="clickToBoard"
        icon
        style="margin-left: -12px"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <!-- title -->
      <v-toolbar-title class="pa-0 align-center">
        <span v-if="is_board || !is_nav" class="title">HOLYBI ROOM</span>
        <span v-if="!is_nav" class="title"> | </span>
        <span v-if="!is_nav || is_chat" class="title">{{
          user ? user.name.toUpperCase() : ""
        }}</span>
      </v-toolbar-title>

      <!-- clickboard -->
      <v-btn icon v-show="is_board || !is_nav" v-clipboard="clickClipboard">
        <v-icon small>mdi-content-copy</v-icon>
      </v-btn>

      <v-spacer />

      <!-- toChat -->
      <v-btn icon v-show="is_nav && is_board" @click.prevent="clickToChat">
        <v-badge v-if="is_new_messages" dot overlap offset-x="-20px" offset-y="-9px"></v-badge>
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
            v-if="is_chat"
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

const CHANGE_STATE_WIDTH = 980;

export default {
  computed: {
    ...mapState(["user", "users", "mobile_back", "messages"]),
  },

  data: () => ({
    drawer: false,
    is_nav: false,
    is_board: true,
    is_chat: false,
    is_new_messages: false
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
      this.$store.commit("drawing", true);
      this.is_board = true;
      this.is_chat = false;
      const link = window.document.location.search.split("&chat=true").join("");
      this.$router.go(-1);
      this.onResize();
    },

    clickToChat() {
      this.is_board = false;
      this.is_chat = true;

      this.is_new_messages = false;

      const link = window.document.location.search;
      this.$router.push(link + "&chat=true").catch(() => {});
    },

    clickToDrawer() {
      this.drawer = !this.drawer;
    },

    onResize() {
      if (window.innerWidth > CHANGE_STATE_WIDTH) {
        this.is_nav = false;
        this.is_board = true;
        this.is_chat = true;
        const link = window.document.location.search
          .split("&chat=true")
          .join("");
        this.$router.replace(link).catch(() => {});
        this.is_new_messages = false;
      } else {
        this.is_nav = true;
        if (this.is_board && this.is_chat) {
          this.is_board = true;
          this.is_chat = false;
        }
      }
    }
  },

  watch: {
    messages(){
      if (this.is_nav && this.is_board) this.is_new_messages = true;
    },

    mobile_back(value) {
      if (value) {
        this.is_nav = true;
        this.is_board = true;
        this.is_chat = false;
        this.onResize();
        this.$store.commit("mobile_back", false);
      }
    }
  },
  components: {
    VBoard,
    VChat
  }
};
</script>
