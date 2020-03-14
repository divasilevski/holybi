import Vue from "vue";
import App from "./App.vue";
import Clipboard from "v-clipboard";
import VScrollLock from "v-scroll-lock";

import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

import "./registerServiceWorker";

Vue.use(Clipboard);
Vue.use(VScrollLock);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
