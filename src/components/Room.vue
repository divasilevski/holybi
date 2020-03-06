<template>
  <v-app>
    <v-app-bar app clipped-right color="white" elevation="0">
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

      <v-spacer />

      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
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

    <Chat />
  </v-app>
</template>

<script>
import Chat from "./Chat";
export default {
  data: () => ({
    name: "Room",
    drawer: false,
    user: { name: "Dima" },
    users: []
  }),
  components: {
    Chat
  }
};
</script>
