import React, { useState, useEffect, useCallback } from 'react';
import { SHOW_MODAL_ANIMATION_DURATION } from '../components/modalHOC';
import RegularEventModal from '../components/RegularEventModal';
import contentMatrix from '../data/contentMatrix';
import { loader } from '../plugins/components/Preloader';

export const PLANET_TO_PLANET_CRASH_TYPE_KEY = 0;
export const PLANET_TO_SUN_CRASH_TYPE_KEY = 1;
export const ASTEROID_CRASH_TYPE_KEY = 8;
export const COMET_CRASH_TYPE_KEY = 9;

export default function CrashBox({ active, clickExit, type, isExitActive }) {
  const [innerType, setInnerType] = useState(type);

  const handleClickExit = useCallback(() => {
    clickExit();
  }, [clickExit]);

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        setInnerType(type);
      },
      type ? 0 : SHOW_MODAL_ANIMATION_DURATION
    );
    return () => {
      clearTimeout(timeout);
    };
  }, [type]);

  const content =
    innerType === PLANET_TO_SUN_CRASH_TYPE_KEY
      ? contentMatrix.main.events.starCrash
      : innerType === PLANET_TO_PLANET_CRASH_TYPE_KEY
      ? contentMatrix.main.events.planetCol
      : innerType === ASTEROID_CRASH_TYPE_KEY
      ? contentMatrix.main.events.asteroidCol
      : innerType === COMET_CRASH_TYPE_KEY
      ? contentMatrix.main.events.cometCol
      : null;

  const textMarginTop =
    innerType === PLANET_TO_SUN_CRASH_TYPE_KEY
      ? 140
      : innerType === PLANET_TO_PLANET_CRASH_TYPE_KEY
      ? 130
      : innerType === ASTEROID_CRASH_TYPE_KEY
      ? 120
      : 120;

  if (content == null) return null;

  return (
    <RegularEventModal
      textMarginTop={textMarginTop}
      open={active}
      onClose={handleClickExit}
      title={content.title}
      description={content.description}
      imgSrc={loader.get(content.imgUrl).src}
      imgAlt={content.imgAlt}
      audioDescription={content.audioDescription}
      gotItButtonAriaRoleDescription={content.gotItButtonAriaRoleDescription}
      xButtonAriaLabel={content.closeButtonAriaLabel}
      xButtonAriaRoleDescription={content.closeButtonAriaRoleDescription}
      isExitActive={isExitActive}
    />
  );
}
