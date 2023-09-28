import emitter from '../emitter';
import {
  resetAllCollisionCounts,
  getPlanetToPlanetCollisionCount,
} from '../redux/collision';
import {
  planet_increment,
  planet_decrement,
  planet_reset,
} from '../redux/planetCount';

import { comet_increment, comet_reset } from '../redux/cometCount';
import {
  wasKeypadUsed as wasKeypadUsedSelector,
  setWasKeypadUsed,
} from '../redux/app';
import { resetAction } from '../redux/reducers';
import { SHOW_MODAL_ANIMATION_DURATION } from '../components/modalHOC';

export const LOW_VOLUME = 0.1;
export const HIGH_VOLUME = 1;

export const END_EVENT_TYPES = {
  STABLE: 0,
  SEMI_STABLE: 1,
  A_LOT_OF_CRASHES: 2,
};

let pauseTimeout = null;

// Constants
export const GAME__SET_IS_GAME_RUNNING = 'GAME::SET_IS_GAME_RUNNING';
export const GAME__GAME_VOLUME = 'GAME::SET_GAME_VOLUME';
export const GAME__SET_END_EVENT_TYPE = 'GAME::SET_END_EVENT_TYPE';
export const GAME__INCREMENT_BROKEN_ASTEROID_BELT_COUNT =
  'GAME::INCREMENT_BROKEN_ASTEROID_BELT_COUNT';
export const GAME__RESET_BROKEN_ASTEROID_BELT_COUNT =
  'GAME::RESET_BROKEN_ASTEROID_BELT_COUNT';
export const GAME__INCREMENT_ASTEROID_BELT_COUNT =
  'GAME::INCREMENT_ASTEROID_BELT_COUNT';
export const GAME__RESET_ASTEROID_BELT_COUNT =
  'GAME::RESET_ASTEROID_BELT_COUNT';
export const GAME__RESET_END_EVENT_TYPE = 'GAME::RESET_END_EVENT_TYPE';
export const GAME__SET_IS_MODAL_OPENED = 'GAME::SET_IS_MODAL_OPENED';
export const GAME__INCREMENT_PLANET_COUNT = 'GAME::INCREMENT_PLANET_COUNT';
export const GAME__DECREMENT_PLANET_COUNT = 'GAME::DECREMENT_PLANET_COUNT';
export const GAME__SET_IS_FIRST_PLANET_PLACED =
  'GAME::SET_IS_FIRST_PLANET_PLACED';
// Actions
export const setIsGameRunning = (isGameRunning) => ({
  type: GAME__SET_IS_GAME_RUNNING,
  payload: isGameRunning,
});

export const incrementPlanetCount = (incrementBy = 1) => ({
  type: GAME__INCREMENT_PLANET_COUNT,
  payload: incrementBy,
});

export const decrementPlanetCount = (incrementBy = 1) => ({
  type: GAME__DECREMENT_PLANET_COUNT,
  payload: incrementBy,
});

export const setGameVolume = (volume) => ({
  type: GAME__GAME_VOLUME,
  payload: volume,
});
export const incrementAsteroidBeltCount = () => ({
  type: GAME__INCREMENT_ASTEROID_BELT_COUNT,
});
export const resetAsteroidBeltCount = () => ({
  type: GAME__RESET_ASTEROID_BELT_COUNT,
});

export const incrementBrokenAsteroidBeltCount = () => ({
  type: GAME__INCREMENT_BROKEN_ASTEROID_BELT_COUNT,
});

export const resetBrokenAsteroidBeltCount = () => ({
  type: GAME__RESET_BROKEN_ASTEROID_BELT_COUNT,
});

export const setIsModalOpened = (isOpened) => ({
  type: GAME__SET_IS_MODAL_OPENED,
  payload: isOpened,
});
export const setIsFirstPlanetPlaced = (isFirstPlanetPlaced) => ({
  type: GAME__SET_IS_FIRST_PLANET_PLACED,
  payload: isFirstPlanetPlaced,
});

//redux to game connections
export const clearAllObjects = () => (dispatch) => {
  emitter.emit('clearAllObjects');
  dispatch(planet_reset());
  dispatch(comet_reset());
  dispatch(resetAsteroidBeltCount());
  dispatch(resetBrokenAsteroidBeltCount());
  dispatch(resetAllCollisionCounts());
};

export const reset = () => (dispatch) => {
  dispatch(resetAction());
  emitter.emit('reset');
};

export const pauseGame = () => (dispatch) => {
  clearTimeout(pauseTimeout);
  pauseTimeout = setTimeout(() => {
    dispatch(setIsGameRunning(false));
    emitter.emit('pauseGame');
  }, SHOW_MODAL_ANIMATION_DURATION);
};

export const resumeGame = () => (dispatch) => {
  dispatch(setIsGameRunning(true));
  emitter.emit('resumeGame');
};

export const turnDownSound = () => (dispatch) => {
  dispatch(setGameVolume(LOW_VOLUME));
  emitter.emit('turnDownVolume');
};

export const turnUpSound = () => (dispatch) => {
  dispatch(setGameVolume(HIGH_VOLUME));
  emitter.emit('turnUpVolume');
};

export const setSoundVolume = (volume) => (dispatch) => {
  dispatch(setGameVolume(volume));
  emitter.emit('setVolume', { volume });
};

export const createObject =
  ({ x, y, obj }) =>
  (dispatch, getState) => {
    const state = getState();
    const asteroidCount = getAsteroidBeltCount(state);
    if (obj.type === 'planet') {
      dispatch(planet_increment());
    }
    if (obj.type === 'asteroid' && asteroidCount < 6) {
      dispatch(incrementAsteroidBeltCount());
    }
    if (obj.type === 'comet') {
      dispatch(comet_increment());
    }

    emitter.emit('objectDragEnd', { x, y, obj });
  };

//game to redux connections
export const destroyPlanet = () => (dispatch) => {
  dispatch(planet_decrement());
};

export const setEndEventType = () => (dispatch, getState) => {
  const state = getState();
  const planetToPlanetCollisionCount = getPlanetToPlanetCollisionCount(state);
  let collisionType = null;
  if (planetToPlanetCollisionCount === 0) {
    collisionType = END_EVENT_TYPES.STABLE;
  }
  if (planetToPlanetCollisionCount > 0 && planetToPlanetCollisionCount <= 5) {
    collisionType = END_EVENT_TYPES.SEMI_STABLE;
  }
  if (planetToPlanetCollisionCount > 5) {
    collisionType = END_EVENT_TYPES.A_LOT_OF_CRASHES;
  }
  dispatch({
    type: GAME__SET_END_EVENT_TYPE,
    payload: collisionType,
  });
  dispatch(pauseGame());
};

export const resetEndEventType = () => (dispatch, getState) => {
  const state = getState();
  const wasKeypadUsed = wasKeypadUsedSelector(state);
  const planetCount = planetCountSelector(state);
  const isFirstPlanetPlaced = firstPlanetPlacedSelector(state);
  dispatch(resumeGame());
  dispatch({
    type: GAME__RESET_END_EVENT_TYPE,
    payload: { wasKeypadUsed },
  });
  if (planetCount === 0 && isFirstPlanetPlaced) {
    emitter.emit('initZeroPlanetEndEventTimeout');
  }

  //0 planets && !firstplanetPlaced   nothing
  //0 planets && firstPlanetPlaced  zeroPlanetEnd
  // > 0 planets
  else {
    emitter.emit('initEndEventTimeout');
  }
  // console.log('number of state planets', planetCount);
};

export const turnAccessibilityModeOn = () => (dispatch) => {
  dispatch(turnUpSound());
  dispatch(setWasKeypadUsed(true));
  emitter.emit('accessibilityModeOn');
};

// Initial State
const initialState = {
  isGameRunning: false,
  planetCount: 0,
  asteroidsCount: 0,
  asteroidBeltCount: 0,
  gameVolume: 0,
  endEventType: null,
  brokenAsteroidBeltCount: 0,
  isFirstPlanetPlaced: false,
  isModalOpened: false, //used for asteroid belt, but could be used for all modals if they are rebuild to containers
};

// Reducer
const finalFoo = (state = initialState, action = {}) => {
  switch (action.type) {
    case GAME__SET_IS_GAME_RUNNING:
      return {
        ...state,
        isGameRunning: action.payload,
      };
    case GAME__GAME_VOLUME:
      return {
        ...state,
        gameVolume: action.payload,
      };
    case GAME__SET_END_EVENT_TYPE:
      return {
        ...state,
        endEventType: action.payload,
      };
    case GAME__RESET_END_EVENT_TYPE:
      return {
        ...state,
        endEventType: null,
      };
    case GAME__INCREMENT_PLANET_COUNT:
      return {
        ...state,
        isGameRunning: action.payload,
      };
    case GAME__DECREMENT_PLANET_COUNT:
      return {
        ...state,
        isGameRunning: action.payload,
      };
    case GAME__INCREMENT_ASTEROID_BELT_COUNT:
      return {
        ...state,
        asteroidBeltCount: state.asteroidBeltCount + 1,
      };
    case GAME__RESET_ASTEROID_BELT_COUNT:
      return {
        ...state,
        asteroidBeltCount: 0,
      };
    case GAME__SET_IS_MODAL_OPENED:
      return {
        ...state,
        isModalOpened: action.payload,
      };
    case GAME__INCREMENT_BROKEN_ASTEROID_BELT_COUNT:
      return {
        ...state,
        brokenAsteroidBeltCount: state.brokenAsteroidBeltCount + 1,
      };
    case GAME__RESET_BROKEN_ASTEROID_BELT_COUNT:
      return {
        ...state,
        brokenAsteroidBeltCount: 0,
      };
    case GAME__SET_IS_FIRST_PLANET_PLACED:
      return {
        ...state,
        isFirstPlanetPlaced: action.payload,
      };

    default:
      return state;
  }
};

export default finalFoo;

//Selectors
export const isGameRunning = (state) => state.game.isGameRunning;

export const getEndEventType = (state) => state.game.endEventType;

export const getGameVolume = (state) => state.game.gameVolume;

export const isModalOpened = (state) => state.game.isModalOpened;

export const getBrokenAsteroidBeltCount = (state) =>
  state.game.brokenAsteroidBeltCount;

export const getAsteroidBeltCount = (state) => state.game.asteroidBeltCount;

export const planetCountSelector = (state) => state.planetCount.count;

export const firstPlanetPlacedSelector = (state) =>
  state.game.isFirstPlanetPlaced;
