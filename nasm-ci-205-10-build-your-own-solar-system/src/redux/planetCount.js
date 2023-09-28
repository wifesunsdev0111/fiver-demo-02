// Constants
export const PLANET_COUNTER__INCREMENT = 'PLANET_COUNTER::INCREMENT';
export const PLANET_COUNTER__DECREMENT = 'PLANET_COUNTER::DECREMENT';
export const PLANET_COUNTER__RESET = 'PLANET_COUNTER::RESET';

// Actions
export const planet_increment = (count = 1) => ({
  type: PLANET_COUNTER__INCREMENT,
  payload: count
});

export const planet_decrement = (count = 1) => ({
  type: PLANET_COUNTER__DECREMENT,
  payload: count
});

export const planet_reset = () => ({
  type: PLANET_COUNTER__RESET,
});

// Initial State
const initialState = {
  count: 0,
};

// Reducer
const finalFoo = (state = initialState, action = {}) => {
  switch (action.type) {
    case PLANET_COUNTER__INCREMENT:
      return {
        ...state,
        count: state.count + action.payload,
      };
    case PLANET_COUNTER__DECREMENT:
      return {
        ...state,
        count: state.count - action.payload,
      };
    case PLANET_COUNTER__RESET:
      return {
        ...state,
        count: 0,
      };
    default:
      return state;
  }
}

export default finalFoo;
