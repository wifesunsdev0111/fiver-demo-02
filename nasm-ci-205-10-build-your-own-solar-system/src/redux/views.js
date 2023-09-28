
// Constants
export const VIEWS__SET = 'VIEWS::SET';
export const ACTIVITY_TYPE__SET = 'ACTIVITY_TYPE::SET';
// Actions
export const setActiveViewIndex = activeViewIndex => {
  return {
    type: VIEWS__SET,
    payload: { 
      activeViewIndex, 
    } 
  };
};
export const setActivityType = (isInitialSelect, activityIndex) => {
  return {
    type: ACTIVITY_TYPE__SET,
    payload: { 
      isInitialSelect,
      activityIndex, 
    } 
  };
};

// Initial State
const initialState = {
  activeViewIndex: 0,
  isInitialSelect: false,
  activityIndex: 0,

};

// Reducer
const finalFoo = (state = initialState, action = {}) => {
  const { payload } = action;
  switch (action.type) {
    case VIEWS__SET:
      return {
        ...state,
        activeViewIndex: payload.activeViewIndex,
        activeView: payload.activeView,
      
      };
      case ACTIVITY_TYPE__SET:
      return {
        ...state,
        isInitialSelect: payload.isInitialSelect,
        activityIndex: payload.activityIndex,  
      };

    default:
      return state;
  }
}

export default finalFoo;


