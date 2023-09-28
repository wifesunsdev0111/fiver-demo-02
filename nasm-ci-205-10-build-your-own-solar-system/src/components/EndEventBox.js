import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { vw } from '../styles/utils';
import AudioDescription from '../components/AudioDescription';
import Button from '../components/Button';
import Modal from '../components/Modal';
import contentMatrix from '../data/contentMatrix';
import { tabable } from '../utils/screenreader';
import { END_EVENT_TYPES, getGameVolume } from '../redux/game';
import { loader } from '../plugins/components/Preloader';
import { MAIN_CONGRATS } from '../config/config';
import { isTimeoutPopupActiveSelector } from '../redux/app';
import { sendSystemEventsToGA } from '../redux/gaEvents';
import { setActiveViewIndex } from '../redux/views';
import { END_STABLE, END_SEMI_STABLE, END_CRASHES } from '../config/config';

export default function EndEventBox({
  active,
  clickExit,
  clickEndGame,
  type,
  crashCount,
  planetCount,
}) {
  const gameVolume = useSelector(getGameVolume);
  const isTimeoutPopupActive = useSelector(isTimeoutPopupActiveSelector);
  const dispatch = useDispatch();
  const playSound = useCallback(
    (url) => {
      const audio = new Audio(url);
      audio.volume = gameVolume;
      audio.play();
    },
    [gameVolume]
  );

  useEffect(() => {
    switch (type) {
      case END_EVENT_TYPES.STABLE:
        playSound(loader.get(END_STABLE).src);
        break;
      case END_EVENT_TYPES.SEMI_STABLE:
        playSound(loader.get(END_SEMI_STABLE).src);
        break;
      case END_EVENT_TYPES.A_LOT_OF_CRASHES:
        playSound(loader.get(END_CRASHES).src);
        break;
      default:
      //do  nothing
    }
    dispatch(setActiveViewIndex(7));
    dispatch(sendSystemEventsToGA());
  }, [type, playSound, dispatch]);

  useEffect(() => {
    if (active && planetCount === 0) {
      dispatch(setActiveViewIndex(0));
      dispatch(sendSystemEventsToGA());
    }
  }, [planetCount, active, dispatch]);
  return (
    <Modal
      xButtonAriaLabel={contentMatrix.main.endEvents.closeButtonAriaLabel}
      xButtonAriaRoleDescription={
        contentMatrix.main.endEvents.closeButtonAriaRoleDescription
      }
      open={active}
      onClose={clickExit}
      xButtonTabIndex={
        planetCount === 0 ? -1 : tabable(2, !isTimeoutPopupActive)
      }
      bgUrl={loader.get(MAIN_CONGRATS).src}
    >
      {type === END_EVENT_TYPES.STABLE ? (
        <>
          <AudioDescription
            description={`${
              planetCount === 0
                ? contentMatrix.main.exitEvent.audioDescription
                : contentMatrix.main.endEvents.audioDescription
            } ${
              planetCount === 0 ? '' : contentMatrix.main.endEvents.stable.title
            } ${stableDescription(planetCount)} ${
              contentMatrix.main.exitEvent.adTabAriaInstructionEndEvent
            }`}
            autoFocus={true}
          />
          <Title>
            {planetCount === 0 ? '' : contentMatrix.main.endEvents.stable.title}
          </Title>
          <Description>{stableDescription(planetCount)}</Description>
        </>
      ) : type === END_EVENT_TYPES.SEMI_STABLE ? (
        <>
          <AudioDescription
            description={`${
              planetCount === 0
                ? contentMatrix.main.exitEvent.audioDescription
                : contentMatrix.main.endEvents.audioDescription
            } ${
              planetCount === 0
                ? ''
                : contentMatrix.main.endEvents.relativelyStable.title
            } ${semiStableDescription(planetCount)} ${
              contentMatrix.main.exitEvent.adTabAriaInstructionEndEvent
            }`}
            autoFocus={true}
          />
          <Title>
            {planetCount === 0
              ? ''
              : contentMatrix.main.endEvents.relativelyStable.title}
          </Title>
          <Description>{semiStableDescription(planetCount)}</Description>
        </>
      ) : type === END_EVENT_TYPES.A_LOT_OF_CRASHES ? (
        <>
          <AudioDescription
            description={`${
              planetCount === 0
                ? contentMatrix.main.exitEvent.audioDescription
                : contentMatrix.main.endEvents.audioDescription
            } ${
              contentMatrix.main.endEvents.crashes.title
            } ${crashesDescription(crashCount)} ${
              contentMatrix.main.exitEvent.adTabAriaInstructionEndEvent
            }`}
            autoFocus={true}
          />
          <Title>{contentMatrix.main.endEvents.crashes.title}</Title>
          <Description>{crashesDescription(crashCount)}</Description>
        </>
      ) : (
        <></>
      )}
      <GotItButton
        aria-roledescription={
          planetCount === 0
            ? 'Press, the center key to return to the game'
            : contentMatrix.main.endEvents.endButtonAriaRoledescription
        }
        tabIndex={tabable(2, !isTimeoutPopupActive)}
        onClick={planetCount === 0 ? clickExit : clickEndGame}
        shorter={planetCount === 0}
      >
        {planetCount === 0
          ? 'Got it'
          : contentMatrix.main.endEvents.endButtonLabel}
      </GotItButton>
    </Modal>
  );
}

const stableDescription = (planetCount) => {
  return planetCount === 0
    ? 'You have no planets in orbit! Place planets around the star and see what happens!'
    : ` Your solar system is perfectly stable with ${planetCount} planet${
        planetCount === 1 ? '' : 's'
      } in orbit. You are a master of gravitational stability.`;
};

const semiStableDescription = (planetCount) => {
  return planetCount === 0
    ? 'You have no planets in orbit! Place planets around the star and see what happens!'
    : `You have ${planetCount} planet${planetCount === 1 ? '' : 's'} in 
    relatively stable ${
      planetCount === 1 ? 'orbit' : 'orbits'
    }! That is not an easy feat.`;
};

const crashesDescription = (crashCount) => {
  return `You had ${crashCount} planetary crashes. Spectacular work. Ever 
    wonder why our own planet doesn't crash into others here in our Solar System?`;
};

const Title = styled.h1`
  position: absolute;
  width: ${vw(760)};
  height: ${vw(50)};
  color: white;
  top: ${vw(138)};
  left: ${vw(104)};
  font-size: ${vw(38)};
  line-height: ${vw(50)};
  font-family: ${({ theme }) => theme.font.industry};
  font-weight: normal;
  font-style: normal;
`;

const Description = styled.div`
  position: absolute;
  width: ${vw(616)};
  min-height: ${vw(144)};
  color: white;
  top: ${vw(213)};
  left: ${vw(104)};
  font-size: ${vw(22)};
  line-height: ${vw(27)};
  font-family: ${({ theme }) => theme.font.nunito};
  font-weight: normal;
  font-style: normal;
`;

const GotItButton = styled(Button)`
  position: absolute;
  width: ${(props) => (props.shorter ? vw(200) : vw(360))};
  /* height: ${vw(56)}; */
  top: ${vw(338)};
  left: ${vw(104)};
  /* border: 2px white solid; */
  /* background: #944997; */
  /* border: solid 3px #ce62d3; */
  /* border-radius: ${vw(8)}; */
  /* color: #fff; */
  /* font-size: ${vw(22)}; */
  /* line-height: ${vw(29)}; */
  /* font-family: ${({ theme }) => theme.font.nunito}; */
  /* font-weight: normal; */
  /* font-style: normal; */
  /* transition: background 0.25s;
  :active {
    background: ${({ theme }) => theme.color.buttonPressedBackground};
  } */
`;
