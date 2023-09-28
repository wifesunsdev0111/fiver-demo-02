// Constants
export const COUNTER__INCREMENT = 'COUNTER::INCREMENT';
export const COUNTER__DECREMENT = 'COUNTER::DECREMENT';
export const COUNTER__RESET = 'COUNTER::RESET';

// Actions
export const increment = () => ({
  type: COUNTER__INCREMENT,
});

export const decrement = () => ({
  type: COUNTER__DECREMENT,
});

export const reset = () => dispatch => {
  setTimeout(() => {
    dispatch({
      type: COUNTER__RESET,
    });
  }, 1000);
};

// Initial State
const initialState = {
  count: 0,
};

// Reducer
const finalFoo = (state = initialState, action = {}) => {
  switch (action.type) {
    case COUNTER__INCREMENT:
      return {
        ...state,
        count: state.count + 1,
      };
    case COUNTER__DECREMENT:
      return {
        ...state,
        count: state.count - 1,
      };
    case COUNTER__RESET:
      return {
        ...state,
        count: 0,
      };
    default:
      return state;
  }
}

export default finalFoo;
