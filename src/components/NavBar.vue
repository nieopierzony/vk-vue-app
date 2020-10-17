<template>
  <div>
    <v-system-bar v-if="state.platform == 'ios'" fixed color="secondary" />

    <v-app-bar
      elevation="0"
      :style="state.platform == 'ios' ? `margin-top: 24px` : ''"
      app
      color="#1e1e1e"
      dark
    >
      <!-- 
        Если придумаю, что вставить в меню
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> 
      -->

      <v-img
        :src="require('../assets/logo.png')"
        alt="Logo"
        class="hamster-logo center"
        max-width="60px"
        @click="$router.push('/').catch(() => {})"
        style="cursor:pointer;"
      />
    </v-app-bar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      state: this.$api.state,
    };
  },
};
</script>

<style scoped>
.hamster-logo {
  border-radius: 50%;
  position: relative;
  top: 6px;
}
</style>
