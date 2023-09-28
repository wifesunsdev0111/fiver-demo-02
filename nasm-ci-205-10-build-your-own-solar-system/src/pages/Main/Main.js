import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { isTimeoutPopupActiveSelector } from '../../redux/app';

import {
  clearAllObjects as clearAllObjectsActionCreator,
  pauseGame,
  resumeGame,
  resetEndEventType,
  isGameRunning as isGameRunningSelector,
  getEndEventType,
  isModalOpened as isModalOpenedSelector,
  setIsFirstPlanetPlaced,
  firstPlanetPlacedSelector,
} from '../../redux/game';
import {
  sendSystemEventsToGA,
  sendButtonInfoToGA,
  setButtonType,
} from '../../redux/gaEvents';
import { setActiveViewIndex } from '../../redux/views';
import {
  getPlanetToPlanetCollisionCount,
  getPlanetToSunCollisionCount,
  getAsteroidToPlanetCollisionCount,
  getCometToPlanetCollisionCount,
} from '../../redux/collision';
import styled from 'styled-components';
import { vw } from '../../styles/utils';
import Page from '../../components/Page';
import { Slide } from '../../components/Animation';
import PlanetsList from '../../components/PlanetsList';
import StartOverButton from '../../components/StartOverButton';
import config from '../../config/config';
import InstructionPanel from '../../components/InstructionPanel';
import ExitBox from '../../components/ExitBox';
import CrashBox, {
  PLANET_TO_PLANET_CRASH_TYPE_KEY,
  PLANET_TO_SUN_CRASH_TYPE_KEY,
  ASTEROID_CRASH_TYPE_KEY,
  COMET_CRASH_TYPE_KEY,
} from '../../components/CrashBox';
import StableBox from '../../components/StableBox';
import EndEventBox from '../../components/EndEventBox';
import BrokenAsteroidBeltEvent from '../../containers/BrokenAsteroidBeltEvent';
import AudioDescription from '../../components/AudioDescription';
import contentMatrix from '../../data/contentMatrix';
import { tabable } from '../../utils/screenreader';
import useResetHook from '../../plugins/hooks/useResetHook';

import { loader } from '../../plugins/components/Preloader';

import {
  DRAG_AND_DROP_GIF,
  QUESTION_ICON,
  RESET_ICON,
  CLEAR_ALL_SOUND,
} from '../../config/config';

const CONTROLS_DISPLAY_DELAY = 200;

const { objects } = config;

export default function Main(props) {
  const reset = useResetHook();
  const dispatch = useDispatch();
  const history = useHistory();
  const planetListRef = useRef(null);
  const [isExitActive, setIsExitActive] = useState(false);
  const [activeCrashType, setActiveCrashType] = useState(null);
  const [ariaCrashType, setAriaCrashType] = useState(null);
  const [isHelpActive, setIsHelpActive] = useState(false);
  const [isStableActive, setIsStableActive] = useState(false);
  const [wasStabilityAchieved, setWasStabilityAchieved] = useState(false);
  const isTimeoutPopupActive = useSelector(isTimeoutPopupActiveSelector);
  const planetToPlanetCollisionCount = useSelector(
    getPlanetToPlanetCollisionCount
  );
  const planetToSunCollisionCount = useSelector(getPlanetToSunCollisionCount);
  const asteroidToPlanetCollisionCount = useSelector(
    getAsteroidToPlanetCollisionCount
  );
  const cometToPlanetCollisionCount = useSelector(
    getCometToPlanetCollisionCount
  );

  const isFirstPlanetPlaced = useSelector(firstPlanetPlacedSelector);
  const cometCount = useSelector((state) => state.cometCount.count);
  const planetCount = useSelector((state) => state.planetCount.count);

  const endEventType = useSelector(getEndEventType);
  const isGameRunning = useSelector(isGameRunningSelector);
  const isModalOpened = useSelector(isModalOpenedSelector);

  useEffect(() => {
    if (!isGameRunning) {
      const timer = setTimeout(() => {
        reset();
      }, 180000);
      return () => clearTimeout(timer);
    }
  }, [isGameRunning, reset]);

  const isModalOpenedCallback = useCallback(() => {
    return (
      isExitActive ||
      activeCrashType != null ||
      isHelpActive ||
      isStableActive ||
      endEventType !== null ||
      isModalOpened
    );
  }, [
    isExitActive,
    activeCrashType,
    isHelpActive,
    isStableActive,
    endEventType,
    isModalOpened,
  ]);

  useEffect(() => {
    if (activeCrashType === COMET_CRASH_TYPE_KEY) {
      dispatch(setActiveViewIndex(2));
      dispatch(sendSystemEventsToGA());
    }
    if (activeCrashType === PLANET_TO_PLANET_CRASH_TYPE_KEY) {
      dispatch(setActiveViewIndex(3));
      dispatch(sendSystemEventsToGA());
    }
    if (activeCrashType === PLANET_TO_SUN_CRASH_TYPE_KEY) {
      dispatch(setActiveViewIndex(4));
      dispatch(sendSystemEventsToGA());
    }

    if (activeCrashType === ASTEROID_CRASH_TYPE_KEY) {
      dispatch(setActiveViewIndex(5));
      dispatch(sendSystemEventsToGA());
    }
  }, [activeCrashType, dispatch]);

  const isNonExitModalOpenedCallback = useCallback(() => {
    return (
      activeCrashType != null ||
      isHelpActive ||
      isStableActive ||
      endEventType !== null ||
      isModalOpened
    );
  }, [
    activeCrashType,
    isHelpActive,
    isStableActive,
    endEventType,
    isModalOpened,
  ]);

  const setActiveCrash = useCallback(
    (type) => {
      dispatch(pauseGame());
      setActiveCrashType(type);
      setAriaCrashType(type);
    },
    [dispatch]
  );

  const setStableActive = useCallback(() => {
    dispatch(pauseGame());
    setIsStableActive(true);
  }, [dispatch]);

  useEffect(() => {
    if (planetToPlanetCollisionCount > 0) {
      if (planetToPlanetCollisionCount === 1) {
        setActiveCrash(PLANET_TO_PLANET_CRASH_TYPE_KEY);
      }
      setAriaCrashType(PLANET_TO_PLANET_CRASH_TYPE_KEY);
    }
  }, [planetToPlanetCollisionCount, setActiveCrash]);

  useEffect(() => {
    if (planetToSunCollisionCount > 0) {
      if (planetToSunCollisionCount === 1) {
        setActiveCrash(PLANET_TO_SUN_CRASH_TYPE_KEY);
      }
      setAriaCrashType(PLANET_TO_SUN_CRASH_TYPE_KEY);
    }
  }, [planetToSunCollisionCount, setActiveCrash]);

  useEffect(() => {
    if (asteroidToPlanetCollisionCount === 1) {
      setActiveCrash(ASTEROID_CRASH_TYPE_KEY);
    }
  }, [asteroidToPlanetCollisionCount, setActiveCrash]);

  useEffect(() => {
    if (cometToPlanetCollisionCount > 0) {
      if (cometToPlanetCollisionCount === 1) {
        setActiveCrash(COMET_CRASH_TYPE_KEY);
      }
      setAriaCrashType(COMET_CRASH_TYPE_KEY);
    }
  }, [cometToPlanetCollisionCount, setActiveCrash]);

  //pause game when time out
  useEffect(() => {
    isTimeoutPopupActive ? dispatch(pauseGame()) : dispatch(resumeGame());
  }, [isTimeoutPopupActive, dispatch]);

  useEffect(() => {
    if (planetCount > 0 && isGameRunning && !wasStabilityAchieved) {
      const interval = setTimeout(() => {
        if (planetCount >= 4) {
          setWasStabilityAchieved(true);
          setStableActive();
        }
      }, 15000);
      return () => clearTimeout(interval);
    }
  }, [
    setStableActive,
    planetCount,
    isGameRunning,
    wasStabilityAchieved,
    setWasStabilityAchieved,
  ]);

  //90/180 sec timeout starts when first planet is placed, 10 sec if 0 planets left
  useEffect(() => {
    if (planetCount > 0 && isFirstPlanetPlaced === false) {
      dispatch(setIsFirstPlanetPlaced(true));
      dispatch(resetEndEventType());
    }
    if (planetCount === 0) {
      dispatch(resetEndEventType());
    }
  }, [planetCount, isFirstPlanetPlaced, dispatch]);

  //updates currentNumPlanets when collision happened for aria-live
  useEffect(() => {
    const interval = setTimeout(() => {
      setAriaCrashType(null);
    }, 500);

    return () => clearTimeout(interval);
  }, [
    planetToPlanetCollisionCount,
    cometToPlanetCollisionCount,
    planetToSunCollisionCount,
  ]);

  //  resets "No planets placed!" popup timer when user is in AT mode and no planents have been placed
  // useEffect(() => {
  //   if (isGameRunning) {
  //     const interval = setInterval(() => {
  //       if(planetCount===0 && !isFirstPlanetPlaced){
  //         dispatch(resetEndEventType());
  //       //  console.log("resetting a time");
  //       }
  //     }, 9000);
  //     return () => clearInterval(interval);
  //   }
  // }, [dispatch, isGameRunning, planetCount, isFirstPlanetPlaced ]);

  const focusPlanetsList = useCallback(() => {
    if (planetListRef && planetListRef.current) planetListRef.current.focus();
  }, []);

  const clearAllObjects = useCallback(() => {
    dispatch(clearAllObjectsActionCreator());
    dispatch(resetEndEventType());
  }, [dispatch]);

  const playSound = useCallback((url) => {
    const audio = new Audio(url);
    audio.volume = 1;
    audio.play();
  }, []);

  const handleClearAll = useCallback(() => {
    clearAllObjects();
    dispatch(setButtonType('clearall'));
    dispatch(sendButtonInfoToGA());
    playSound(loader.get(CLEAR_ALL_SOUND).src);
  }, [clearAllObjects, playSound, dispatch]);

  const handlClickStartOver = () => {
    dispatch(pauseGame());
    setIsExitActive(true);
  };
  const handleCloseEndEvents = () => {
    dispatch(resumeGame());
    dispatch(resetEndEventType());
    dispatch(setActiveViewIndex(null));
  };

  const handleClickCloseCrash = () => {
    dispatch(resumeGame());
    setActiveCrashType(null);
    dispatch(setActiveViewIndex(null));
    setTimeout(() => {
      focusPlanetsList();
    }, 200);
  };
  const handleCloseStable = () => {
    dispatch(resumeGame());
    setIsStableActive(false);
    setTimeout(() => {
      focusPlanetsList();
    }, 200);
  };

  // throw new Error('testing error logging');

  const hanleExitToAttract = () => {
    clearAllObjects();
    reset();
  };

  const hanleExitToOutro = () => {
    clearAllObjects();
    dispatch(setButtonType('whatabout'));
    dispatch(sendButtonInfoToGA());
    history.push('/outro');
  };

  const handleClickCancelExit = () => {
    if (!isNonExitModalOpenedCallback()) dispatch(resumeGame());
    setIsExitActive(false);
    if (!isHelpActive) {
      setTimeout(() => {
        focusPlanetsList();
      }, 200);
    }
  };

  const handleClickNeedHelp = () => {
    setIsHelpActive(true);
    dispatch(pauseGame());
    dispatch(setButtonType('instructions'));
    dispatch(sendButtonInfoToGA());
  };
  const handleClickCloseHelp = () => {
    dispatch(resumeGame());
    dispatch(resetEndEventType());
    setIsHelpActive(false);
    setTimeout(() => {
      focusPlanetsList();
    }, 200);
    dispatch(setActiveViewIndex(null));
  };

  return (
    <Root data-testid="main" className="destination">
      <AudioDescription
        description={contentMatrix.main.audioDescription}
        autoFocus={true}
      />
      <Slide direction="right" value={400} delay={CONTROLS_DISPLAY_DELAY}>
        <LeftPanel>
          <PlanetsList
            ref={planetListRef}
            ariaLabel={contentMatrix.main.leftBarInstructions}
            addingPlanetTextTabIndex={tabable(
              2,
              !isModalOpenedCallback() && !isTimeoutPopupActive
            )}
            panelTabIndex={tabable(
              3,
              !isModalOpenedCallback() && !isTimeoutPopupActive
            )}
            isModalOpen={isModalOpenedCallback()}
            objects={objects}
          />
          <HandIcon alt=" " src={loader.get(DRAG_AND_DROP_GIF).src} />
        </LeftPanel>
      </Slide>
      <CrashBox
        active={activeCrashType != null}
        clickExit={handleClickCloseCrash}
        type={activeCrashType}
        isExitActive={isExitActive}
      />
      <EndEventBox
        active={endEventType !== null}
        type={endEventType}
        crashCount={planetToPlanetCollisionCount + planetToSunCollisionCount}
        planetCount={planetCount}
        clickExit={handleCloseEndEvents}
        clickEndGame={hanleExitToOutro}
        isExitActive={isExitActive}
      />
      <StableBox
        active={isStableActive}
        clickExit={handleCloseStable}
        isExitActive={isExitActive}
      />
      <InstructionPanel
        open={isHelpActive}
        onClose={handleClickCloseHelp}
        handleClickGo={handleClickCloseHelp}
        isStartOverPopupActive={isExitActive}
      />
      <Slide value={200} delay={CONTROLS_DISPLAY_DELAY}>
        <HelpButton
          data-testid={'help-button'}
          aria-roledescription={
            contentMatrix.main.instructionsButtonAriaRoledescription
          }
          onClick={handleClickNeedHelp}
          tabIndex={tabable(
            6,
            !isModalOpenedCallback() && !isTimeoutPopupActive
          )}
        >
          <span>Instructions</span>{' '}
        </HelpButton>
      </Slide>
      <Slide value={200} delay={CONTROLS_DISPLAY_DELAY}>
        <ResetButton
          aria-roledescription={
            contentMatrix.main.clearAllButtonAriaRoledescription
          }
          onClick={handleClearAll}
          tabIndex={tabable(
            5,
            !isModalOpenedCallback() && !isTimeoutPopupActive
          )}
        >
          <span>{contentMatrix.main.clearAllButtonLabel}</span>
        </ResetButton>
      </Slide>
      <BrokenAsteroidBeltEvent closeFocusRef={planetListRef} />
      <ExitBox
        active={isExitActive}
        clickCancelExit={handleClickCancelExit}
        clickYesExit={hanleExitToAttract}
      />
      <CollisionAlert aria-live="assertive" role="alert">
        {planetToPlanetCollisionCount === 0 &&
        planetCount === 0 &&
        cometCount === 0
          ? ' '
          : (planetToPlanetCollisionCount > 0 ||
              cometToPlanetCollisionCount > 0) &&
            ariaCrashType !== null &&
            (ariaCrashType === PLANET_TO_PLANET_CRASH_TYPE_KEY ||
              ariaCrashType === PLANET_TO_SUN_CRASH_TYPE_KEY ||
              ariaCrashType === COMET_CRASH_TYPE_KEY)
          ? `${
              ariaCrashType === PLANET_TO_PLANET_CRASH_TYPE_KEY ||
              ariaCrashType === PLANET_TO_SUN_CRASH_TYPE_KEY
                ? 'Planetary'
                : ariaCrashType === COMET_CRASH_TYPE_KEY
                ? 'Comet'
                : ' '
            } crash, ${planetCount + cometCount} objects remaining`
          : ''}
      </CollisionAlert>

      <StartOverButton
        onClick={handlClickStartOver}
        tabIndex={tabable(
          20,
          (!isModalOpenedCallback() && !isTimeoutPopupActive) ||
            (isHelpActive && !isTimeoutPopupActive && !isExitActive)
        )}
      />
    </Root>
  );
}

const Root = styled(Page)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-family: ${({ theme }) => theme.font.industry};
  font-weight: 300;
  font-style: normal;
`;

const CollisionAlert = styled.div``;
const HelpButton = styled.button`
  z-index: 997;
  position: absolute;
  width: ${vw(260)};
  height: ${vw(75)};
  bottom: ${vw(30)};
  right: ${vw(57)};
  border: 1px white solid;
  border-radius: 3px;
  color: #fff;
  font-size: ${vw(25)};
  background-image: url(${loader.get(QUESTION_ICON).src});
  background-repeat: no-repeat;
  background-position: 88% 50%;
  span {
    font-family: ${({ theme }) => theme.font.industry};
    font-weight: 300;
    font-style: normal;
    margin-left: ${vw(-35)};
  }
`;

const ResetButton = styled.button`
  z-index: 997;
  position: absolute;
  width: ${vw(260)};
  height: ${vw(75)};
  bottom: ${vw(30)};
  left: ${vw(400)};
  background-image: url(${loader.get(RESET_ICON).src});
  background-repeat: no-repeat;
  background-position: 5% 50%;
  span {
    color: #fff;
    font-size: ${vw(25)};
    line-height: ${vw(38)};
    font-family: ${({ theme }) => theme.font.industry};
    font-weight: 300;
    font-style: normal;
  }
`;

const LeftPanel = styled.div`
  z-index: 10;
  position: absolute;
  height: 100%;
  width: ${vw(329)};
  left: 0%;
  background: #252840;
  overflow: visible;
`;

const HandIcon = styled.img`
  position: absolute;
  z-index: 998;
  top: 23%;
  left: 80%;
  width: ${vw(91)};
  height: ${vw(97)};
  transform: translate(-90%, -10%);
  font-size: ${vw(18)};
`;
