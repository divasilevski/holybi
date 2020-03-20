import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("../views/Home.vue")
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (from.query.chat) {
    store.commit("mobile_back", true);
  }
  next();
});

export default router;
