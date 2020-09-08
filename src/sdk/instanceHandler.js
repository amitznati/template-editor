import { createStore, combineReducers } from 'redux';

import { composeWithDevTools } from 'redux-devtools-extension';

/* Widgets */
import widgets from './widgetsList';

const _createStoreInstance = () => {
  const reducerMap = {};
  widgets.forEach((widget) => {
    reducerMap[widget.config.sliceName] = widget.reducer;
  });
  return createStore(combineReducers(reducerMap), composeWithDevTools());
};
const storeInstance = _createStoreInstance();

const _createInstance = () => {
  const apis = {};
  widgets.forEach((widget) => {
    const Api = widget.api;
    apis[widget.config.apiName] = new Api(storeInstance, apis);
  });
  return apis;
};
const apisInstance = _createInstance();

export const getInstance = () => {
  return apisInstance;
};
export const getStoreInstance = () => {
  return storeInstance;
};

export default {
  getStoreInstance,
  getInstance
};
