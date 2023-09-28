import config from '../config/config';
import { fetchJson } from '../utils/fetch';

// Types
export const CONFIG__SET_APP_CONFIG_LOADED = 'CONFIG::SET_APP_CONFIG_LOADED';
export const CONFIG__SET_APP_CONFIG = 'CONFIG::SET_APP_CONFIG';

// Actions
export const setAppConfigLoaded = (isLoaded) => ({
  type: CONFIG__SET_APP_CONFIG_LOADED,
  paylaod: { isLoaded },
});

export const getAppConfig = () => (dispatch) => {
  const configURL = `${window.location.origin}${process.env.PUBLIC_URL}/config.json?`;
  fetchJson(
    configURL +
      new URLSearchParams({
        time: Date.now(),
      })
  ).then((data) => {
    dispatch(setAppConfig(data));
  });
};

export const setAppConfig = (data) => ({
  type: CONFIG__SET_APP_CONFIG,
  payload: { data },
});

// Initial State
const initialState = {
  isAppConfigLoaded: !config.hasPublicConfigFile,
  urls: {},
};

// Reducer
const finalFoo = (state = initialState, action = {}) => {
  switch (action.type) {
    case CONFIG__SET_APP_CONFIG_LOADED:
      return {
        ...state,
        isAppConfigLoaded: action.paylaod.isLoaded,
      };
    case CONFIG__SET_APP_CONFIG:
      const { payload } = action;
      const urls = payload.data.urls;
      return {
        ...state,
        urls: urls ? urls : [],
        isAppConfigLoaded: true,
      };
    default:
      return state;
  }
};

export default finalFoo;

export const isAppConfigLoaded = (state) => state.config.isAppConfigLoaded;

export const getUrls = (state) => state.config.urls;
