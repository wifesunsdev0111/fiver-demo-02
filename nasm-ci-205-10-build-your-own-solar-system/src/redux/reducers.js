import { combineReducers } from 'redux';
import app from './app';
import config from './config';
import counter from './counter';
import collision from './collision';
import planetCount from './planetCount';
import cometCount from './cometCount';
import liveMessages from './liveMessages';
import views from './views';
import hotspots from './hotspots';
import gaEvents from './gaEvents';
import game from './game';

const RESET = 'RESET';

export const resetAction = () => ({
  type: RESET,
});

const appReducer = combineReducers({
  app,
  views,
  hotspots,
  gaEvents,
  config,
  counter,
  collision,
  planetCount,
  cometCount,
  liveMessages,
  game,
});

const rootReducer = (state, action) => {
  if (action && action.type === RESET) {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
