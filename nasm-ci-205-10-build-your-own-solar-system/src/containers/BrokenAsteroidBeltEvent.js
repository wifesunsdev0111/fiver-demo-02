import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getBrokenAsteroidBeltCount,
  pauseGame,
  resumeGame,
  setIsModalOpened,
  getGameVolume,
} from '../redux/game';
import { sendSystemEventsToGA } from '../redux/gaEvents';
import { setActiveViewIndex } from '../redux/views';
import RegularEventModal from '../components/RegularEventModal';
import contentMatrix from '../data/contentMatrix';
import { loader } from '../plugins/components/Preloader';
import { ASTEROIDS_BREAKING_UP } from '../config/config';

const BrokenAsteroidBeltEvent = ({ closeFocusRef }) => {
  const dispatch = useDispatch();
  const brokenAsteroidBeltCount = useSelector(getBrokenAsteroidBeltCount);
  const [open, setOpen] = useState(false);
  const [isFirstTimeOpen, setIsFirstTimeOpen] = useState(true);
  const gameVolume = useSelector(getGameVolume);

  const playSound = useCallback(() => {
    const audio = new Audio(loader.get(ASTEROIDS_BREAKING_UP).get);
    audio.volume = gameVolume;
    audio.play();
  }, [gameVolume]);

  const onClose = useCallback(() => {
    dispatch(resumeGame());
    dispatch(setIsModalOpened(false));
    setOpen(false);
    setIsFirstTimeOpen(false);
    if (closeFocusRef && closeFocusRef.current) closeFocusRef.current.focus();
  }, [dispatch, closeFocusRef]);

  useEffect(() => {
    if (brokenAsteroidBeltCount === 1 && isFirstTimeOpen) {
      playSound();
      setOpen(true);
      dispatch(setIsModalOpened(true));
      dispatch(pauseGame());
      dispatch(setActiveViewIndex(6));
      dispatch(sendSystemEventsToGA());
    }
  }, [brokenAsteroidBeltCount, dispatch, isFirstTimeOpen, playSound]);

  return (
    <RegularEventModal
      open={open}
      onClose={onClose}
      title={contentMatrix.main.asteroidBreakupEvent.title}
      description={contentMatrix.main.asteroidBreakupEvent.description}
      imgSrc={loader.get(contentMatrix.main.asteroidBreakupEvent.imgUrl).src}
      imgAlt={contentMatrix.main.asteroidBreakupEvent.imgAlt}
      audioDescription={
        contentMatrix.main.asteroidBreakupEvent.audioDescription
      }
      gotItButtonAriaRoleDescription={
        contentMatrix.main.asteroidBreakupEvent.gotItButtonAriaRoleDescription
      }
      xButtonAriaLabel={
        contentMatrix.main.asteroidBreakupEvent.closeButtonAriaLabel
      }
      xButtonAriaRoleDescription={
        contentMatrix.main.asteroidBreakupEvent.closeButtonAriaRoleDescription
      }
    />
  );
};

export default BrokenAsteroidBeltEvent;
