<template>
  <v-container>
    <v-lazy transition="scroll-y-transition">
      <v-card flat color="transparent" class="mx-auto" style="margin-top: .4%">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="headline">Создание заявки</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-form v-model="form.valid" ref="form">
          <v-container>
            <v-row>
              <v-col cols="6" md="4">
                <v-text-field
                  v-model="form.nickname"
                  clearable
                  :rules="nickRules"
                  autofocus
                  label="Игровой ник"
                  autocomplete="formlogin-username"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="6" md="4">
                <v-select
                  :items="servers"
                  v-model="form.server"
                  :rules="serverRules"
                  required
                  label="Игровой сервер"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  label="Описание пробелмы"
                  :counter="2000"
                  :rules="descRules"
                  auto-grow
                  row-height="35px"
                  v-model="form.description"
                  rows="2"
                ></v-textarea>
              </v-col>

              <v-col cols="6" md="4">
                <v-text-field
                  v-model="form.location.country"
                  clearable
                  :rules="locationRules"
                  label="Страна регистрации"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="6" md="4">
                <v-text-field
                  v-model="form.location.city"
                  clearable
                  :rules="locationRules"
                  label="Город регистрации"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.appealLink"
                  clearable
                  :rules="linkRules"
                  label="Ссылка на жалобу"
                  required
                ></v-text-field>
              </v-col>
              <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 4">
                <v-checkbox
                  v-model="form.notifications.vk"
                  label="Получать уведомления о статусе заявки"
                ></v-checkbox>
              </v-col>
              <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 4">
                <v-checkbox
                  v-model="form.notifications.messages"
                  label="Получать уведомления о статусе заявки в личные сообщения"
                ></v-checkbox>
              </v-col>

              <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 4" align-self="center">
                <v-btn @click="validate()" :loading="btnLoading" color="#75d072">Отправить</v-btn>
                <v-btn @click="copyText()" :loading="btnLoading">f</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card>
    </v-lazy>
  </v-container>
</template>

<script>
export default {
  data: function() {
    return {
      state: this.$api.state,
      form: {
        valid: false,
        nickname: this.$route.query.nickname || "",
        server: "",
        description: "",
        location: {
          country: "",
          city: "",
        },
        appealLink: this.$route.query.appeal || "",
        notifications: {
          vk: this.$api.state.notifEnabled,
          messages: this.$api.state.messagesEnabled,
        },
      },

      copyLink: "проблема",
      btnLoading: false,

      servers: [
        "Phoenix",
        "Tucson",
        "Scottdale",
        "Chandler",
        "Brainburg",
        "SaintRose",
        "Mesa",
        "Red-Rock",
        "Yuma",
        "Surprise",
        "Prescott",
        "Glendale",
        "Kingman",
      ],

      nickRules: [
        (v) => !!v || "Необходимо указать никнейм",
        (v) => v.length <= 24 || "Ник должен быть меньше, чем 24 символа",
        (v) => /([a-zA-Z]+[ |_][a-zA-Z]+)/.test(v) || "Невалидный никнейм",
      ],
      descRules: [
        (v) => !!v || "Необходимо указать описание проблемы",
        (v) => v.length > 45 || "Описание должно быть не менее 45 символов",
        (v) => v.length < 2000 || "Описание должно быть меньше 2000 символов",
      ],
      serverRules: [(v) => !!v || "Необходимо указать сервер"],
      locationRules: [(v) => !!v || "Поле должно быть заполнено"],
      linkRules: [
        (v) => !!v || "Необходимо указать ссылку на жалобу",
        (v) => v.length <= 2000 || "Описание должно быть меньше 2000 символов",
        (v) =>
          /^http:\/\/forum\.arizona-rp\.com\/index\.php\?threads\/(?:.*\.)?\d+\/?(?:#?post-\d+)?$/g.test(
            v
          ) || "Невалидная ссылка",
      ],
    };
  },

  created() {
    this.form.server = this.servers[this.$route.query.server - 1];
  },

  watch: {
    "state.notifEnabled": function(val) {
      this.form.notifications.vk = val;
    },
    "state.messagesEnabled": function(val) {
      this.form.notifications.messages = val;
    },
  },
  methods: {
    createCopyLink() {
      let query = { to: "/create-request" };
      if (this.form.nickname) query.nickname = this.form.nickname;
      if (this.form.server) query.server = this.servers.indexOf(form.server) + 1;
      if (this.form.appealLink) query.appeal = this.form.appealLink;
      query = btoa(JSON.stringify(query));
      return "https://vk.com/app7574191_515866549#" + query;
    },
    copyText() {
      const link = this.createCopyLink();
      this.copyLink = link;
      if (["ios", "android"].includes(this.state.platform)) {
        bridge
          .send("VKWebAppCopyText", { text: link })
          .then(() => console.log("copied"))
          .catch(console.error);
      } else {
        const textToCopy = this.$refs.textToCopy.$el.querySelector("input");
        textToCopy.select();
        document.execCommand("copy");
      }
    },
    validate() {
      this.$refs.form.validate();
      if (this.form.valid) {
        this.btnLoading = true;
        setTimeout(() => (this.btnLoading = false), 1000);
      }
    },
  },
};
</script>
