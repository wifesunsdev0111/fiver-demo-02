import config from '../config/config';

// Constants
export const APP__KEYPAD_AUDIO = 'APP::KEYPAD_AUDIO';
export const APP__PRELOADER_DONE = 'APP::PRELOADER_DONE';
export const APP__RESET_PRELOADER = 'APP::RESET_PRELOADER';
export const APP__SET_IS_PRELOADER_DONE = 'APP::SET_IS_PRELOAD_DONE';
export const APP__SET_IS_DYNAMIC_CONTENT_DOWNLOADED =
  'APP::SET_IS_DYNAMIC_CONTENT_DOWNLOADED';
export const APP__SET_WAS_KEYPAD_USED = 'AP::SET_WAS_KEYPAD_USED';
export const APP__SET_POPUP_ACTIVE = 'APP::SET_POPUP_ACTIVE';
export const APP__DID_TIMEOUT = 'APP::DID_TIMEOUT';
export const APP__SESSION_START_TIME = 'APP::SESSION_START_TIME';
export const APP__SESSION_DURATION = 'APP::SESSION_DURATION';

// Actions
export const getDynamicData = () => async (dispatch) => {
  //this action should contain actions to get dynamic data
  //after all is fetched it marks dynamic content as downloaded
  dispatch(setIsDynamicContentDownloaded(false));
  await Promise.all([
    //all actions containing api calls should go here
  ]);
  dispatch(setIsDynamicContentDownloaded(true));
};

export const preloaderDone = () => ({ type: APP__PRELOADER_DONE });

export const resetPreloader = () => ({ type: APP__RESET_PRELOADER });

export const setIsPreloaderDone = (isDone) => ({
  type: APP__SET_IS_PRELOADER_DONE,
  payload: { isDone },
});

export const setIsDynamicContentDownloaded = (isDone) => ({
  type: APP__SET_IS_DYNAMIC_CONTENT_DOWNLOADED,
  payload: { isDone },
});

export const setIsKeypadAudio = (mode) => ({
  type: APP__KEYPAD_AUDIO,
  payload: { mode },
});

export const setWasKeypadUsed = (wasUsed) => ({
  type: APP__SET_WAS_KEYPAD_USED,
  payload: { wasUsed },
});

export const setPopUpActive = (isActive) => ({
  type: APP__SET_POPUP_ACTIVE,
  payload: { isActive },
});
export const setDidTimeout = (didTimeOut) => ({
  type: APP__DID_TIMEOUT,
  payload: { didTimeOut },
});

export const setSessionStartTime = (sessionStartTime) => ({
  type: APP__SESSION_START_TIME,
  payload: { sessionStartTime },
});

export const setSessionDuration = (sessionDuration) => ({
  type: APP__SESSION_DURATION,
  payload: { sessionDuration },
});

// Initial State
const initialState = {
  isPreloaderDone: false,
  isDynamicContentDownloaded: !config.hasDynamicContent,
  isKeypadAudio: false,
  wasKeypadUsed: false,
  isPopupActive: false,
  didTimeOut: false,
  sessionStartTime: 0,
  sessionDuration: 0,
};
// Reducer
const finalFoo = (state = initialState, action = {}) => {
  const { payload } = action;
  switch (action.type) {
    case APP__PRELOADER_DONE:
      return {
        ...state,
        isPreloaderDone: true,
      };
    case APP__RESET_PRELOADER:
      return {
        ...state,
        isPreloaderDone: false,
      };
    case APP__SET_IS_PRELOADER_DONE:
      return {
        ...state,
        isPreloaderDone: payload.isDone,
      };
    case APP__SET_IS_DYNAMIC_CONTENT_DOWNLOADED:
      return {
        ...state,
        isDynamicContentDownloaded: payload.isDone,
      };
    case APP__KEYPAD_AUDIO:
      return {
        ...state,
        isKeypadAudio: payload.mode,
      };
    case APP__SET_WAS_KEYPAD_USED:
      return {
        ...state,
        wasKeypadUsed: payload.wasUsed,
      };
    case APP__SET_POPUP_ACTIVE:
      return {
        ...state,
        isPopupActive: payload.isActive,
      };
    case APP__DID_TIMEOUT:
      return {
        ...state,
        didTimeOut: payload.didTimeOut,
      };
    case APP__SESSION_START_TIME:
      return {
        ...state,
        sessionStartTime: payload.sessionStartTime,
      };
    case APP__SESSION_DURATION:
      return {
        ...state,
        sessionDuration: payload.sessionDuration,
      };
    default:
      return state;
  }
};

// Selectors
export const wasKeypadUsed = (state) => state.app.wasKeypadUsed;

export const isKeypadAudio = (state) => state.app.isKeypadAudio;

export const isPreloaderDone = (state) => state.app.isPreloaderDone;

export const isDynamicContentDownloaded = (state) =>
  state.app.isDynamicContentDownloaded;

//this is a selector that should return array of url to be preloaded
const emptyDynamicFilesToDownload = [];
export const getDynamicFilesToPreload = () => {
  return emptyDynamicFilesToDownload;
};

export default finalFoo;

export const isTimeoutPopupActiveSelector = (state) => state.app.isPopupActive;
