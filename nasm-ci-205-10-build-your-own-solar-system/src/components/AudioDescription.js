import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { wasKeypadUsed as wasKeypadUsedselector } from '../redux/app';
import { isTimeoutPopupActiveSelector } from '../redux/app';
import styled from 'styled-components';
import { vw } from '../styles/utils';

export default function AudioDescription({
  description,
  active = true,
  tabIndex = 1,
  onBlur,
  autoFocus = false,
  autoFocusInNonAD = false,
  autoFocusTimeout = 0,
  zIndex,
  position = {},
  delay = 0,
  additionalHeight = 0,
  additionalWidth = 0,
  handleKeyDown = () => {},
  forwardedRef,
}) {
  const newRef = useRef();
  const rootRef = forwardedRef || newRef;
  const wasKeypadUsed = useSelector(wasKeypadUsedselector);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const activeInner = !audioPlayed && active;
  const isTimeoutPopupActive = useSelector(isTimeoutPopupActiveSelector);

  const handleAudioDescriptionBlur = useCallback(() => {
    setAudioPlayed(true);
  }, [setAudioPlayed]);

  useEffect(() => {
    if (!active) {
      setAudioPlayed(false);
    }
  }, [active]);

  useEffect(() => {
    if (!isTimeoutPopupActive) {
      setAudioPlayed(false);
    }
  }, [isTimeoutPopupActive]);

  useEffect(() => {
    const timeoutKey = setTimeout(() => {
      if (
        activeInner &&
        autoFocus &&
        rootRef &&
        rootRef.current &&
        (wasKeypadUsed || autoFocusInNonAD)
      ) {
        setFocused(true);
        setTimeout(() => {
          if (rootRef && rootRef.current) rootRef.current.focus();
        }, delay);
      }
    }, autoFocusTimeout);
    return () => {
      clearTimeout(timeoutKey);
    };
  }, [
    autoFocus,
    wasKeypadUsed,
    activeInner,
    autoFocusTimeout,
    autoFocusInNonAD,
    delay,
    rootRef,
  ]);

  const [focused, setFocused] = useState(autoFocus && wasKeypadUsed);

  const onFocusCallback = useCallback(() => {
    setFocused(true);
  }, []);

  const onBlurCallback = useCallback(() => {
    setFocused(false);
    handleAudioDescriptionBlur();
    if (onBlur) onBlur();
  }, [onBlur, handleAudioDescriptionBlur]);

  return (
    <Root
      focused={focused}
      ref={rootRef}
      tabIndex={activeInner && !isTimeoutPopupActive ? tabIndex : -1}
      active={activeInner}
      zIndex={zIndex}
      onFocus={onFocusCallback}
      onBlur={onBlurCallback}
      aria-roledescription=" "
      position={position}
      additionalHeight={additionalHeight}
      additionalWidth={additionalWidth}
      onKeyDown={handleKeyDown}
    >
      <span>{description}</span>
    </Root>
  );
}

const Root = styled.div`
  position: absolute;
  top: ${({ position }) => (position.top ? position.top : '5%')};
  left: ${({ position }) => (position.left ? position.left : '5%')};
  height: ${({ active, focused, additionalHeight }) =>
    active && focused ? vw(400 + additionalHeight) : 0};
  width: ${({ active, focused, additionalWidth }) =>
    active && focused ? vw(200 + additionalWidth) : 0};
  z-index: ${({ zIndex }) => (zIndex != null ? zIndex : 1000)};
  overflow: hidden;
  span {
    opacity: 0;
  }
`;
