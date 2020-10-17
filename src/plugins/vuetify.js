import Vue from "vue";
import Vuetify from "vuetify/lib";
import ru from "vuetify/es5/locale/ru";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    options: {
      customProperties: true,
    },
    themes: {
      dark: {
        primary: "#c4e9a0",
        secondary: "#424242",
        accent: "#82B1FF",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107",
        background: "#292929",
      },
    },
  },
  lang: {
    locales: { ru },
    current: "ru",
  },
  icons: {
    iconfont: "md",
  },
});
