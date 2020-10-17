class Store {
  constructor() {
    this.state = {
      user: null,
      platform: null,
      notifEnabled: false,
      messagesEnabled: false,
      loading: false,
    };
  }
}

export default Store;
