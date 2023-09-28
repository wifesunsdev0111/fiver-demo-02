import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import store from '../../redux/store';
import reducers from '../../redux/reducers';
import { setIsKeypadAudio } from '../../redux/app';
const initialState = reducers();
const defaultConfig = {
  keycode: {
    inserted: 126,
    removed: 127,
  },
};

/**
 * Detects whether headphone is plugged in the EZ keypad.
 */
export default function useKeypadAudioDetect(config) {
  const { keycode } = { ...defaultConfig, config };
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    const reset = (isKeypadAudio) => {
      store.dispatch({
        type: 'RESET',
        state: {
          ...initialState,
          app: { ...initialState.app, isKeypadAudio },
        },
      });
      history.push('/');
    };

    const handleKeyUp = ({ which }) => {
      window.keypad = true; // This is my dumb way disable the delay on preload, but it works - PG

      const { inserted, removed } = keycode;
      switch (which) {
        case inserted:
          reset();
          dispatch(setIsKeypadAudio(true));
          break;
        case removed:
          reset();
          dispatch(setIsKeypadAudio(false));
          break;

        default:
          return;
      }
    };

    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [history, dispatch, keycode]);
}
