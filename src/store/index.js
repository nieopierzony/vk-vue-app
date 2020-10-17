import Store from "./Store";

export default {
  install: (Vue, options = {}) => {
    if (
      typeof process !== "undefined" &&
      (process.server || process.SERVER_BUILD || (process.env && process.env.VUE_ENV === "server"))
    )
      return;

    const name = options.name || "api";
    const vueApi = new Store(options);

    Vue[name] = vueApi;
    Vue.prototype[`$${name}`] = vueApi;
  },
};
