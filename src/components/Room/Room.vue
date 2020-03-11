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

    <v-content>
      <v-container>
        <v-row>
          <v-col cols="12" md="6" sm="6" class="pt-0">
            <RoomBoard />
          </v-col>
          <v-col cols="12" md="6" sm="6" class="pt-0">
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
    users: []
  }),
  components: {
    RoomBoard,
    RoomChat
  }
};
</script>
