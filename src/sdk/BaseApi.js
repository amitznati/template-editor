export default class BaseApi {
  constructor(store, apis) {
    this.store = store;
    this.apis = apis;
  }

  dispatchStoreAction = (action) => {
    this.store.dispatch(action);
  };
}
