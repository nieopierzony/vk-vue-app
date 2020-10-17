import "core-js/es/map";
import "core-js/es/set";

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import bridge from "@vkontakte/vk-bridge";

bridge.send("VKWebAppInit");

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
