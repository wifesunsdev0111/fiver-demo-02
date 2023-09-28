
// Constants
export const HOTSPOTS__SET = 'HOTSPOTS__SET';
// Actions
export const setActiveHotspotIndex = activeHotspotIndex => {
  return {
    type: HOTSPOTS__SET,
    payload: {activeHotspotIndex}, 
  };
};


// Initial State
const initialState = {
  activeHotspotIndex: null,
};

// Reducer
const finalFoo = (state = initialState, action = {}) => {
  const { payload } = action;
  switch (action.type) {
    case HOTSPOTS__SET:
      return {
        ...state,
        activeHotspotIndex: payload.activeHotspotIndex,       
      };

    default:
      return state;
  }
}

export default finalFoo;
