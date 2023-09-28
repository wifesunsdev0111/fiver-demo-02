import {
  LOCALHOST,
  TRACKING_ID,
  SYSTEM_EVENTS,
  TUTORIAL_EVENTS,
  KEYPAD_EVENTS,
  BUTTON_EVENTS,
  SESSION_DURATION_EVENTS,
} from '../enums/Events';

// Constants
export const GA_ACTION_SAVE = 'GA_ACTION::SAVE';
export const GA_BUTTON_TYPE_SET = 'GA_BUTTON_TYPE::SET';

// Actions

//dispatched in Attract.js when handleClick triggered
export const sendKeypadToGA = () => (dispatch, getState) => {
  const state = getState();
  const wasKeyPadUsedStatus = getWasKeypadUsed(state);

  dispatch(
    writeToJson(
      TRACKING_ID,
      KEYPAD_EVENTS.CATEGORY,
      KEYPAD_EVENTS.ACTION,
      `${wasKeyPadUsedStatus ? KEYPAD_EVENTS.LABEL2 : KEYPAD_EVENTS.LABEL1}`,
      KEYPAD_EVENTS.VALUE
    )
  );
};

//dispatch buttons : startover, back, playagain
export const sendButtonInfoToGA = () => (dispatch, getState) => {
  const state = getState();
  const buttonClicked = getButtonType(state);
  const didTimeOut = getDidTimeout(state);

  switch (buttonClicked) {
    //dispatched in useResetHook
    case 'startover':
      //action
      console.log(buttonClicked);
      dispatch(sendSessionDurationToGA());
      dispatch(
        writeToJson(
          TRACKING_ID,
          BUTTON_EVENTS.CATEGORY,
          BUTTON_EVENTS.ACTION,
          `${
            didTimeOut
              ? BUTTON_EVENTS.LABEL_TIMESOUT
              : BUTTON_EVENTS.LABEL_START_OVER
          }`,
          BUTTON_EVENTS.VALUE
        )
      );
      break;
    case 'back':
      //dispatched in btn callback fn
      dispatch(
        writeToJson(
          TRACKING_ID,
          BUTTON_EVENTS.CATEGORY,
          BUTTON_EVENTS.ACTION,
          BUTTON_EVENTS.LABEL_BACK,
          BUTTON_EVENTS.VALUE
        )
      );
      break;
    case 'clearall':
      //dispatched in btn callback fn
      dispatch(
        writeToJson(
          TRACKING_ID,
          BUTTON_EVENTS.CATEGORY,
          BUTTON_EVENTS.ACTION,
          BUTTON_EVENTS.LABEL_CLEAR_ALL,
          BUTTON_EVENTS.VALUE
        )
      );
      break;
    case 'instructions':
      //dispatched in btn callback fn
      dispatch(
        writeToJson(
          TRACKING_ID,
          BUTTON_EVENTS.CATEGORY,
          BUTTON_EVENTS.ACTION,
          BUTTON_EVENTS.LABEL_INSTRUCTIONS,
          BUTTON_EVENTS.VALUE
        )
      );
      break;
    case 'whatabout':
      //dispatched in btn callback fn
      dispatch(
        writeToJson(
          TRACKING_ID,
          BUTTON_EVENTS.CATEGORY,
          BUTTON_EVENTS.ACTION,
          BUTTON_EVENTS.LABEL_WHAT_ABOUT,
          BUTTON_EVENTS.VALUE
        )
      );
      break;

    default:
      break;
  }
};

//dispatched in Main
export const sendSystemEventsToGA = () => (dispatch, getState) => {
  const state = getState();
  const currentViewIndex = getCurrentViewIndex(state);

  dispatch(
    writeToJson(
      TRACKING_ID,
      SYSTEM_EVENTS.CATEGORY,
      SYSTEM_EVENTS.ACTION,
      SYSTEM_EVENTS.LABEL[currentViewIndex],
      SYSTEM_EVENTS.VALUE
    )
  );
};
//dispatched in Tutorial Modal
export const sendTutorialEventsToGA = () => (dispatch, getState) => {
  const state = getState();
  const currentHotspotIndex = getCurrentHotspotIndex(state);

  dispatch(
    writeToJson(
      TRACKING_ID,
      TUTORIAL_EVENTS.CATEGORY,
      TUTORIAL_EVENTS.ACTION,
      `${TUTORIAL_EVENTS.LABEL[currentHotspotIndex]}`,
      TUTORIAL_EVENTS.VALUE
    )
  );
};

//start time triggered in Attract, duration called and calculated in useResetHook
export const sendSessionDurationToGA = () => (dispatch, getState) => {
  const state = getState();
  const sessionDuration = getSessionDuration(state);

  const filteredSessionDuration =
    sessionDuration && Number.isInteger(sessionDuration) ? sessionDuration : 0;

  dispatch(
    writeToJson(
      TRACKING_ID,
      SESSION_DURATION_EVENTS.CATEGORY,
      SESSION_DURATION_EVENTS.ACTION,
      `${SESSION_DURATION_EVENTS.LABEL} ${filteredSessionDuration} seconds`,
      filteredSessionDuration
    )
  );
};

export const setButtonType = (buttonType) => {
  return {
    type: GA_BUTTON_TYPE_SET,
    payload: buttonType,
  };
};

export const writeToJson =
  (gaTrackingId, gaCategory, gaAction, gaLabel, gaValue) =>
  async (dispatch, getState) => {
    const filteredGaValue = gaValue && Number.isInteger(gaValue) ? gaValue : 0;

    await fetch(LOCALHOST, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        TrackingId: gaTrackingId,
        Category: gaCategory,
        Action: gaAction,
        Label: gaLabel,
        Value: filteredGaValue,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // for debugging...
        // console.log(data)
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      })
      .finally(() => {
        // Clean up any resources that need to be released,
        // even if the fetch operation was successful or failed.
      });
  };

// Initial State
const initialState = {
  actionInfo: {
    TrackingId: TRACKING_ID,
    Category: 'null',
    Action: 'null',
    Label: 'null',
    Value: 0,
  },
  buttonType: 'none',
};

// Reducer
const reducer = (state = initialState, action = {}) => {
  const { payload } = action;
  switch (action.type) {
    case GA_ACTION_SAVE:
      return {
        ...state,
        actionInfo: payload,
      };
    case GA_BUTTON_TYPE_SET:
      return {
        ...state,
        buttonType: payload,
      };

    default:
      return state;
  }
};

export default reducer;
//Selectors
export const getCurrentViewIndex = (state) => state.views.activeViewIndex;
export const getCurrentHotspotIndex = (state) =>
  state.hotspots.activeHotspotIndex;
export const getWasKeypadUsed = (state) => state.app.wasKeypadUsed;
export const getisInitialSelect = (state) => state.views.isInitialSelect;
export const getActivityIndex = (state) => state.views.activityIndex;
export const getDidTimeout = (state) => state.app.didTimeout;
export const getSessionDuration = (state) => state.app.sessionDuration;
export const getButtonType = (state) => state.gaEvents.buttonType;
