// Constants
export const COMET_COUNTER__INCREMENT = 'COMET_COUNTER::INCREMENT';
export const COMET_COUNTER__DECREMENT = 'COMET_COUNTER::DECREMENT';
export const COMET_COUNTER__RESET = 'COMET_COUNTER::RESET';

// Actions
export const comet_increment = (count = 1) => ({
  type: COMET_COUNTER__INCREMENT,
  payload: count
});

export const comet_decrement = (count = 1) => ({
  type: COMET_COUNTER__DECREMENT,
  payload: count
});

export const comet_reset = () => ({
  type: COMET_COUNTER__RESET,
});

// Initial State
const initialState = {
  count: 0,
};

// Reducer
const finalFoo = (state = initialState, action = {}) => {
  switch (action.type) {
    case COMET_COUNTER__INCREMENT:
      return {
        ...state,
        count: state.count + action.payload,
      };
    case COMET_COUNTER__DECREMENT:
      return {
        ...state,
        count: state.count - action.payload,
      };
    case COMET_COUNTER__RESET:
      return {
        ...state,
        count: 0,
      };
    default:
      return state;
  }
}

export default finalFoo;
