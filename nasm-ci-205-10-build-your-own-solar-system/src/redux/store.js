import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reduxReset from 'redux-reset';

import reducer from './reducers';

if (typeof window === 'undefined') {
  global.window = {};
}

const enhancer = compose(
  applyMiddleware(thunk),
  reduxReset(),
  window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : (f) => f
);

const store = createStore(
  reducer,
  {}, // initial state
  enhancer
);

export default store;
