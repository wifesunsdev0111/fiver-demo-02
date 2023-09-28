// Constants
export const COLLISION_COUNT = 'COLLISION::COUNT';
export const COLLISION_RESET_COLLISION_COUNT = 'COLLISION::RESET_COLLISION_COUNT';
export const COLLISION__INCREMENT_PLANET_TO_PLANET_COLLISION_COUNT = 'COLLISION::INCREMENT_PLANET_TO_PLANET_COLLISION_COUNT';
export const COLLISION__DECREMENT_PLANET_TO_PLANET_COLLISION_COUNT = 'COLLISION::DECREMENT_PLANET_TO_PLANET_COLLISION_COUNT';
export const COLLISION__RESET_PLANET_TO_PLANET_COLLISION_COUNT = 'COLLISION::RESET_PLANET_TO_PLANET_COLLISION_COUNT';
export const COLLISION__INCREMENT_PLANET_TO_SUN_COLLISION_COUNT = 'COLLISION::INCREMENT_PLANET_TO_SUN_COLLISION_COUNT';
export const COLLISION__DECREMENT_PLANET_TO_SUN_COLLISION_COUNT = 'COLLISION::DECREMENT_PLANET_TO_SUN_COLLISION_COUNT';
export const COLLISION__RESET_PLANET_TO_SUN_COLLISION_COUNT = 'COLLISION::RESET_PLANET_TO_SUN_COLLISION_COUNT';
export const COLLISION__INCREMENT_ASTEROID_TO_PLANET_COLLISION_COUNT = 'COLLISION::INCREMENT_ASTEROID_TO_PLANET_COLLISION_COUNT';
export const COLLISION__DECREMENT_ASTEROID_TO_PLANET_COLLISION_COUNT = 'COLLISION::DECREMENT_ASTEROID_TO_PLANET_COLLISION_COUNT';
export const COLLISION__RESET_ASTEROID_TO_PLANET_COLLISION_COUNT = 'COLLISION::RESET_ASTEROID_TO_PLANET_COLLISION_COUNT';
export const COLLISION__INCREMENT_COMET_TO_PLANET_COLLISION_COUNT = 'COLLISION::INCREMENT_COMET_TO_PLANET_COLLISION_COUNT';
export const COLLISION__DECREMENT_COMET_TO_PLANET_COLLISION_COUNT = 'COLLISION::DECREMENT_COMET_TO_PLANET_COLLISION_COUNT';
export const COLLISION__RESET_COMET_TO_PLANET_COLLISION_COUNT = 'COLLISION::RESET_COMET_TO_PLANET_COLLISION_COUNT';
export const COLLISION__RESET_ALL_COLLISION_COUNTS = 'COLLISION::RESET_ALL_COLLISION_COUNTS';
export const COLLISION__INCREMENT_ASTEROID_TO_COMET_COLLISION_COUNT = 'COLLISION::INCREMENT_ASTEROID_TO_COMET_COLLISION_COUNT';
export const COLLISION__INCREMENT_ASTEROID_TO_SUN_COLLISION_COUNT = 'COLLISION::INCREMENT_ASTEROID_TO_COMET_COLLISION_COUNT';

// Actions
export const incrementPlanetToPlanetCollisionCount = (by = 1) => {
  return {
    type: COLLISION__INCREMENT_PLANET_TO_PLANET_COLLISION_COUNT,
    payload: by
  }
};

export const decrementPlanetToPlanetCollisionCount = (by = 1) => {
  return {
    type: COLLISION__DECREMENT_PLANET_TO_PLANET_COLLISION_COUNT,
    payload: by
  }
}

export const resetPlanetToPlanetCollisionCount = () => {
  return {
    type: COLLISION__RESET_PLANET_TO_PLANET_COLLISION_COUNT
  }
}

export const incrementPlanetToSunCollisionCount = (by = 1) => {
  return {
    type: COLLISION__INCREMENT_PLANET_TO_SUN_COLLISION_COUNT,
    payload: by
  }
};

export const decrementPlanetToSunCollisionCount = (by = 1) => {
  return {
    type: COLLISION__DECREMENT_PLANET_TO_SUN_COLLISION_COUNT,
    payload: by
  }
}

export const resetPlanetToSunCollisionCount = () => {
  return {
    type: COLLISION__RESET_PLANET_TO_SUN_COLLISION_COUNT
  }
}

export const incrementAsteroidToPlanetCollisionCount = (by = 1) => {
  return {
    type: COLLISION__INCREMENT_ASTEROID_TO_PLANET_COLLISION_COUNT,
    payload: by
  }
};

export const decrementAsteroidToPlanetCollisionCount = (by = 1) => {
  return {
    type: COLLISION__DECREMENT_ASTEROID_TO_PLANET_COLLISION_COUNT,
    payload: by
  }
}

export const resetAsteroidToPlanetCollisionCount = () => {
  return {
    type: COLLISION__RESET_ASTEROID_TO_PLANET_COLLISION_COUNT
  }
}

export const incrementCometToPlanetCollisionCount = (by = 1) => {
  return {
    type: COLLISION__INCREMENT_COMET_TO_PLANET_COLLISION_COUNT,
    payload: by
  }
};

export const decrementCometToPlanetCollisionCount = (by = 1) => {
  return {
    type: COLLISION__DECREMENT_COMET_TO_PLANET_COLLISION_COUNT,
    payload: by
  }
}

export const resetCometToPlanetCollisionCount = () => {
  return {
    type: COLLISION__RESET_COMET_TO_PLANET_COLLISION_COUNT
  }
}

export const resetAllCollisionCounts = () => {
  return {
    type: COLLISION__RESET_ALL_COLLISION_COUNTS
  }
}

// Initial State
const initialState = {
  planetToPlanetCollisionCount: 0,
  planetToSunCollisionCount: 0,
  asteroidToPlanetCollisionCount: 0,
  cometToPlanetCollisionCount: 0,
};

// Reducer
const finalFoo = (state = initialState, action = {}) => {
  switch (action.type) {
    case COLLISION_COUNT:
      return {
        ...state,
        count: state.count + 1,
      };
    case COLLISION_RESET_COLLISION_COUNT:
      return {
        ...state,
        count: 0,
      };
    case COLLISION__INCREMENT_PLANET_TO_PLANET_COLLISION_COUNT:
      return {
        ...state,
        planetToPlanetCollisionCount: state.planetToPlanetCollisionCount + action.payload,
      };
    case COLLISION__DECREMENT_PLANET_TO_PLANET_COLLISION_COUNT:
      return {
        ...state,
        planetToPlanetCollisionCount: state.planetToPlanetCollisionCount - action.payload,
      };
    case COLLISION__RESET_PLANET_TO_PLANET_COLLISION_COUNT:
      return {
        ...state,
        planetToPlanetCollisionCount: 0,
      };
    case COLLISION__INCREMENT_PLANET_TO_SUN_COLLISION_COUNT:
      return {
        ...state,
        planetToSunCollisionCount: state.planetToSunCollisionCount + action.payload,
      };
    case COLLISION__DECREMENT_PLANET_TO_SUN_COLLISION_COUNT:
      return {
        ...state,
        planetToSunCollisionCount: state.planetToSunCollisionCount - action.payload,
      };
    case COLLISION__RESET_PLANET_TO_SUN_COLLISION_COUNT:
      return {
        ...state,
        planetToSunCollisionCount: 0,
      };
    case COLLISION__INCREMENT_ASTEROID_TO_PLANET_COLLISION_COUNT:
      return {
        ...state,
        asteroidToPlanetCollisionCount: state.asteroidToPlanetCollisionCount + action.payload,
      };
    case COLLISION__DECREMENT_ASTEROID_TO_PLANET_COLLISION_COUNT:
      return {
        ...state,
        asteroidToPlanetCollisionCount: state.asteroidToPlanetCollisionCount - action.payload,
      };
    case COLLISION__RESET_ASTEROID_TO_PLANET_COLLISION_COUNT:
      return {
        ...state,
        asteroidToPlanetCollisionCount: 0,
      };

    case COLLISION__INCREMENT_COMET_TO_PLANET_COLLISION_COUNT:
      return {
        ...state,
        cometToPlanetCollisionCount: state.cometToPlanetCollisionCount + action.payload,
      };
    case COLLISION__DECREMENT_COMET_TO_PLANET_COLLISION_COUNT:
      return {
        ...state,
        cometToPlanetCollisionCount: state.cometToPlanetCollisionCount - action.payload,
      };
    case COLLISION__RESET_COMET_TO_PLANET_COLLISION_COUNT:
      return {
        ...state,
        cometToPlanetCollisionCount: 0,
      };
    case COLLISION__RESET_ALL_COLLISION_COUNTS:
      return {
        ...initialState
      }
    default:
      return state;
  }
}

export default finalFoo;

// Selectors
export const getCollisionCount = (state) => (
  state.collision.planetToPlanetCollisionCount 
    + state.collision.planetToSunCollisionCount 
    + state.collision.asteroidToPlanetCollisionCount
    + state.collision.cometToPlanetCollisionCount
);

export const getPlanetCollisionCount = (state) => (
  state.collision.planetToPlanetCollisionCount 
    + state.collision.planetToSunCollisionCount 
);

export const getPlanetToPlanetCollisionCount = (state) => state.collision.planetToPlanetCollisionCount;

export const getPlanetToSunCollisionCount = (state) => state.collision.planetToSunCollisionCount;

export const getAsteroidToPlanetCollisionCount = (state) => state.collision.asteroidToPlanetCollisionCount;

export const getCometToPlanetCollisionCount = (state) => state.collision.cometToPlanetCollisionCount;

// export const getAsteroidAndCometToPlanetCollisionCount = (state) => (
//   state.collision.asteroidToPlanetCollisionCount
//     + state.collision.cometToPlanetCollisionCount
// );

