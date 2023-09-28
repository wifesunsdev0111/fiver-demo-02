import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import RegularEventModal from '../components/RegularEventModal';
import contentMatrix from '../data/contentMatrix';
import { getGameVolume } from '../redux/game';
import { sendSystemEventsToGA } from '../redux/gaEvents';
import { setActiveViewIndex } from '../redux/views';
import { loader } from '../plugins/components/Preloader';
import { STABILITY } from '../config/config';

export default function EventsBox({ active, clickExit, isExitActive }) {
  const handleClickExit = () => {
    clickExit();
  };

  const gameVolume = useSelector(getGameVolume);
  const dispatch = useDispatch();
  const playSound = useCallback(() => {
    const audio = new Audio(loader.get(STABILITY).src);
    audio.volume = gameVolume;
    audio.play();
  }, [gameVolume]);

  useEffect(() => {
    if (active) {
      playSound();
      dispatch(setActiveViewIndex(1));
      dispatch(sendSystemEventsToGA());
    }
  }, [active, playSound, dispatch]);

  return (
    <RegularEventModal
      textMarginTop={160}
      open={active}
      onClose={handleClickExit}
      title={contentMatrix.main.stabilityEvent.title}
      description={contentMatrix.main.stabilityEvent.description}
      imgSrc={loader.get(contentMatrix.main.stabilityEvent.imgUrl).src}
      imgAlt={contentMatrix.main.stabilityEvent.imgAlt}
      audioDescription={contentMatrix.main.stabilityEvent.audioDescription}
      gotItButtonAriaRoleDescription={
        contentMatrix.main.stabilityEvent.gotItButtonAriaRoleDescription
      }
      xButtonAriaLabel={contentMatrix.main.stabilityEvent.closeButtonAriaLabel}
      xButtonAriaRoleDescription={
        contentMatrix.main.stabilityEvent.closeButtonAriaRoleDescription
      }
      isExitActive={isExitActive}
    />
  );
}
