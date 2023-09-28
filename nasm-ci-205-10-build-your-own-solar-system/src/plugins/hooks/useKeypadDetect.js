import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setWasKeypadUsed } from '../../redux/app';
import { useHistory } from 'react-router-dom';
const LEFT = 37;
const RIGHT = 39;
const TAB = 9;
const SHIFT = 16;

/**
 * Detects whether keypad was used.
 */
export default function useKeypadDetect() {
  const dispatch = useDispatch();
  useEffect(() => {
    const handleKeyDown = ({ which }) => {
      if (which !== 126 && which !== 127 && which !== 75) {
        dispatch(setWasKeypadUsed(true));
      }

      switch (which) {
        case TAB:
          if (which == SHIFT) {
            // e.preventDefault();
          } else {
            // e.preventDefault();
          }
          break;
        case LEFT:
          //
          break;
        case RIGHT:
          //
          break;
        default:
          return;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch]);
}
