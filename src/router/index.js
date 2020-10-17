import Vue from "vue";
import VueRouter from "vue-router";
import Store from "../store/index";

import WelcomePanel from "../views/Welcome";

Vue.use(VueRouter);
Vue.use(Store);

const routes = [
  {
    path: "/",
    name: "Home",
    component: WelcomePanel,
  },
  {
    path: "/create-request",
    component: () => import("../views/CreateRequest"),
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;
