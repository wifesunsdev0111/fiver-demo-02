// Constants
export const LIVE_MESSAGES__SET_BY_KEY = 'LIVE_MESSAGES::SET_BY_KEY';

// Message keys
export const DISTANCE_MESSAGE_KEY = 'distance';
export const MENU_MESSAGE_KEY = 'menu';

// Actions
export const setMessageByKey = (key, message) => ({
  type: LIVE_MESSAGES__SET_BY_KEY,
  payload: {
    key,
    message,
  },
});

// Initial State
const initialState = {
  messages: {
    [DISTANCE_MESSAGE_KEY]: '',
    [MENU_MESSAGE_KEY]: '',
  },
};

// Reducer
const finalFoo = (state = initialState, action = {}) => {
  switch (action.type) {
    case LIVE_MESSAGES__SET_BY_KEY:
      const { payload } = action;
      return {
        ...state,
        messages: {
          ...state.messages,
          [payload.key]: payload.message,
        },
      };
    default:
      return state;
  }
};

// Selectors
export const getMessages = (state) => {
  return Object.values(state.liveMessages);
};

export const getMessagesObject = (state) => state.liveMessages.messages;

// Helpers
export const createDistanceMessage = (position, max, min, step) => {
  const relativeStep = (max - min) / step + 1;
  const relativeDistance =
    ((max - position) / step) * relativeStep + relativeStep;
  return `Distance to the sun ${relativeDistance}.`;
};

export const createFirstDistanceMessage = (position, max, min, step, planetName, planetLabel) => {
  return `${planetName} has been placed into the gameplay area. Use the up-arrow key to move it farther away from the sun and the down arrow key to move it closer. The closer you place it to the Sun, the faster the orbit and the faster the sound. 
  Move it in increments of 10, with 100 being the farthest possible placement away from the sun, and 10 being the closest. Press the center key to confirm the position. Tab once with the right arrow key to select another planet or body.
    ${createDistanceMessage(position, max, min, step)}`;
}

export default finalFoo;
