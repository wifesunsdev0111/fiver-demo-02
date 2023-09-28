import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import store from '../../redux/store';
import reducers from '../../redux/reducers';

const initialState = reducers();

/**
 * Detects headphone from EZ keypad.
 * Resets the app and sets accessibility mode.
 */
export default function AccessibilityDetect() {
  const history = useHistory();

  useEffect(() => {
    const reset = (isAccessibilityMode) => {
      store.dispatch({
        type: 'RESET',
        state: {
          ...initialState,
          app: { isAccessibilityMode },
        },
      });
      history.push('/');
    };

    const handleKeyUp = ({ which }) => {
      switch (which) {
        case 45:
          reset(true);
          break;
        case 46:
          reset(false);
          break;
        default:
          return;
      }
    };

    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [history]);

  return <></>;
}
