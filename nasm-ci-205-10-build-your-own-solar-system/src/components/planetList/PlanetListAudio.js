import { useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  isGameRunning as isGameRunningSelector,
  turnDownSound,
  turnUpSound,
} from '../../redux/game';
import { setMessageByKey, MENU_MESSAGE_KEY } from '../../redux/liveMessages';
import contentMatrix from '../../data/contentMatrix';

import {
  PLANET_1,
  PLANET_2,
  PLANET_3,
  ASTEROID_SOUND,
  COMET_SOUND,
} from '../../config/config';
import { loader } from '../../plugins/components/Preloader';

export default function PlanetsList({
  selectedObjectIndex,
  isKeyboardDragging,
  isGrayed,
}) {
  const dispatch = useDispatch();
  const audioRef = useRef();
  const outerTimeoutRef = useRef();
  const innerTimeoutRef = useRef();
  const endMessageTimeoutRef = useRef();
  const isGameRunning = useSelector(isGameRunningSelector);

  const playMessage = useCallback(
    async (audioUrl, message) => {
      dispatch(turnDownSound());

      let audio = new Audio(audioUrl);
      let playCount = selectedObjectIndex === 3 ? 1 : 3;

      const playInner = () => {
        if (audio) {
          audio.play().catch((error) => {
            console.error('Error playing audio:', error);
          });
        }
      };

      const endInner = () => {
        playCount--;
        if (playCount > 0) {
          playInner();
        } else {
          dispatch(setMessageByKey(MENU_MESSAGE_KEY, message));
          setTimeout(() => {
            dispatch(turnUpSound());
          }, 8000); //duration of text that is read
        }
      };

      audio.addEventListener('ended', endInner);
      playInner();

      return () => {
        audio.removeEventListener('ended', endInner);
        audio.pause();
        audio = null;
      };
    },
    [dispatch, selectedObjectIndex]
  );

  const playAsteroidsMessage = useCallback(
    (audioUrl, message) => {
      dispatch(turnDownSound());

      const audio = new Audio(audioUrl);
      audio.volume = 1;

      const playAudio = () => {
        audio.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
      };

      const handleEndMessage = () => {
        dispatch(setMessageByKey(MENU_MESSAGE_KEY, message));
        setTimeout(() => {
          dispatch(turnUpSound());
        }, 8000); // duration of text that is read
      };

      outerTimeoutRef.current = setTimeout(() => {
        playAudio();
        innerTimeoutRef.current = setTimeout(() => {
          audio.pause();
          handleEndMessage();
        }, 4000); // duration of asteroid sound
      }, 100);

      return () => {
        clearTimeout(outerTimeoutRef.current);
        clearTimeout(innerTimeoutRef.current);
        audio.pause();
      };
    },
    [dispatch]
  );

  //useEffect that handles sounds for a keyboard user
  useEffect(() => {
    // Clear all timeouts and audio references
    const clearAllTimeoutsAndAudio = () => {
      clearTimeout(outerTimeoutRef.current);
      clearTimeout(innerTimeoutRef.current);
      clearTimeout(endMessageTimeoutRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };

    dispatch(setMessageByKey(MENU_MESSAGE_KEY, ''));

    if (isKeyboardDragging || !isGameRunning) {
      clearAllTimeoutsAndAudio();
    } else {
      switch (selectedObjectIndex) {
        case 0:
          playMessage(
            loader.get(PLANET_1).src,
            contentMatrix.main.selectMenuItem1AriaLabel
          );
          break;
        case 1:
          playMessage(
            loader.get(PLANET_2).src,
            contentMatrix.main.selectMenuItem2AriaLabel
          );
          break;
        case 2:
          playMessage(
            loader.get(PLANET_3).src,
            contentMatrix.main.selectMenuItem3AriaLabel
          );
          break;
        case 3:
          playMessage(
            loader.get(COMET_SOUND).src,
            contentMatrix.main.selectMenuItem4AriaLabel
          );
          break;
        case 4:
          isGrayed
            ? playAsteroidsMessage(
                loader.get(ASTEROID_SOUND).src,
                contentMatrix.main.selectMenuItem5ArialLabel_grayed
              )
            : playAsteroidsMessage(
                loader.get(ASTEROID_SOUND).src,
                contentMatrix.main.selectMenuItem5AriaLabel
              );
          break;
        default:
        // do nothing
      }
    }

    return clearAllTimeoutsAndAudio;
  }, [
    dispatch,
    selectedObjectIndex,
    isKeyboardDragging,
    isGameRunning,
    isGrayed,
    playMessage,
    playAsteroidsMessage,
  ]);

  return null;
}
