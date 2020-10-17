<template>
  <v-container>
    <div>
      <v-lazy transition="scroll-y-transition">
        <v-list color="transparent" flat>
          <v-list-item link @click="openUserPage()">
            <v-list-item-avatar>
              <v-img :src="state.user.photo_max_orig"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="title"
                >{{ state.user.first_name }} {{ state.user.last_name }}</v-list-item-title
              >
              <v-list-item-subtitle
                >{{ state.user.country.title }}, {{ state.user.city.title }}</v-list-item-subtitle
              >
            </v-list-item-content>

            <v-list-item-action v-if="state.platform !== 'ios'">
              <v-icon>open_in_new</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-lazy>

      <v-lazy transition="scroll-y-transition">
        <v-list dense color="transparent" flat>
          <v-list-item-group color="primary">
            <v-list-item v-for="(item, i) in items" :key="i" @click="openThing(item)">
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-lazy>
    </div>

    <v-snackbar v-model="showSnackbar" :color="snackbarColor || 'info'">
      {{ snackbarText || "Произошла неизвестная ошибка" }}
      <template v-slot:action="{ attrs }">
        <v-btn rounded color="white" text v-bind="attrs" @click="showSnackbar = false">
          <v-icon>close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import bridge from "@vkontakte/vk-bridge";

export default {
  name: "WelcomePanel",
  data() {
    return {
      loading: false,

      showSnackbar: false,
      snackbarText: null,
      snackbarColor: null,

      notifCaption: "Тут баг",
      msgCaption: "Тут баг",

      state: this.$api.state,
    };
  },

  computed: {
    items() {
      return [
        { text: "Создать заявку", icon: "assignment", to: "/create-request" },
        {
          text: this.notifCaption,
          icon: "rss_feed",
          onClick: "changeNotif",
        },
        { text: "Включить сообщения сообщества", icon: "forum" },
      ];
    },
  },

  watch: {
    "state.notifEnabled": function(val) {
      this.notifCaption = val ? "Отказаться от уведомлений" : "Подписаться на уведомления";
    },
  },

  mounted() {
    this.notifCaption = this.state.notifEnabled
      ? "Отказаться от уведомлений"
      : "Подписаться на уведомления";

    this.notifCaption = this.state.messag
      ? "Отказаться от уведомлений"
      : "Подписаться на уведомления";
  },

  methods: {
    onBridgeError(err) {
      this.snackbarText = "Произошла ошибка при изменении значения";
      this.snackbarColor = "error";
      this.showSnackbar = true;
      console.error(err);
    },
    changeNotif() {
      const action = this.state.notifEnabled
        ? "VKWebAppDenyNotifications"
        : "VKWebAppAllowNotifications";

      bridge
        .send(action)
        .then(() => {
          const successMsg = this.state.notifEnabled
            ? "Спасибо за подписку на уведомления"
            : "Вы успешно отказались от уведомлений";
          this.snackbarText = successMsg;
          this.snackbarColor = "success";
          this.showSnackbar = true;
        })
        .catch(this.onBridgeError);
    },

    openUserPage() {
      window.open("https://vk.com/id" + this.state.user.id);
    },

    openThing(item) {
      if (item.to) return this.$router.push(item.to);
      if (item.onClick) return this[item.onClick]();
    },
  },
};
</script>
