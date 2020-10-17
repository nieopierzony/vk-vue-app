<template>
  <v-app :style="{ background: $vuetify.theme.themes.dark.background }">
    <NavBar :platform="state.platform" />
    <v-main style="margin-top: 2%">
      <div v-if="error" class="text-center">
        <v-icon size="5em">error</v-icon>
        <h1 class="display-1">Произошла ошибка</h1>
        <p>Произошла ошибка при загрузке данных о сервере</p>
      </div>
      <div v-else-if="state.user && !state.loading">
        <router-view :key="$route.path"></router-view>
      </div>
      <div class="text-center" v-else style="margin-top: 5%">
        <v-progress-circular
          :size="70"
          :width="7"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import bridge from "@vkontakte/vk-bridge";
import NavBar from "@/components/NavBar";

export default {
  name: "App",

  components: {
    NavBar,
  },

  data() {
    return {
      state: this.$api.state,
      error: null,
      output: null,
      color: "#fff",
    };
  },

  beforeCreate() {
    const hash = this.$route.hash
      ? Buffer.from(this.$route.hash.split("#")[1], "base64").toString()
      : null;
    if (!hash) return;
    const parsedHash = JSON.parse(hash) || null;
    if (!parsedHash) return;
    if (parsedHash.path) {
      let query = "?";
      if (parsedHash.nickname) query += `nickname=${parsedHash.nickname}&`;
      if (parsedHash.server) query += `server=${parsedHash.server}&`;
      if (parsedHash.appeal) query += `nickname=${parsedHash.appeal}&`;
      this.$router.push(parsedHash.path + query);
    }
  },
  mounted() {
    // Слушаем все события
    bridge.subscribe((event) => {
      if (!event.detail) return;

      const { type, data } = event.detail;
      if (!type || !data) return;

      const actions = {
        VKWebAppGetUserInfoResult: (data) => (this.state.user = data),
        VKWebAppGetClientVersionResult: (data) => (this.state.platform = data.platform),

        VKWebAppAllowNotificationsResult: (data) => (this.state.notifEnabled = true),
        VKWebAppDenyNotificationsResult: (data) => (this.state.notifEnabled = false),

        VKWebAppAllowMessagesFromGroupResult: (data) => (this.state.messagesEnabled = true),
        VKWebAppAllowMessagesFromGroupFailed: (data) => (this.state.messagesEnabled = false),
      };

      actions[type] ? actions[type](data) : console.log(event.detail.type);
    });

    // Запрашиваем данные пользователя
    bridge.send("VKWebAppGetUserInfo");
    bridge.send("VKWebAppGetClientVersion");

    // Включены ли уведомления
    this.state.notifEnabled = this.$route.query.vk_are_notifications_enabled == 0 ? false : true;
  },
};
</script>

<style>
.center {
  display: flex;
  margin-left: auto;
  margin-right: auto;
}
</style>
