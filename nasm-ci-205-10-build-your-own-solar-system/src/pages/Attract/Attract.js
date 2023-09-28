import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { vw } from '../../styles/utils';
import Content from '../../pages/Attract/elements/Content';
import Page from '../../components/Page';
import AudioDescription from '../../components/AudioDescription';
import RingsDecoration from '../../components/RingsDecoration';
import KeyPadPopup from '../../components/KeyPadPopup';
import Credit from '../../components/Credit';
import contentMatrix from '../../data/contentMatrix';
import { tabable } from '../../utils/screenreader';
import {
  isTimeoutPopupActiveSelector,
  setSessionStartTime,
  isKeypadAudio,
} from '../../redux/app';
import { sendKeypadToGA } from '../../redux/gaEvents';
import { ReactComponent as BigCircle } from '../../assets/images/attract/bigCircle.svg';
import { loader } from '../../plugins/components/Preloader';
import {
  ATTRACT_CREDIT_ICON,
  ATTRACT_PLANET_DECO,
  ATTRACT_BG,
  ATTRACT_NO_SOUND,
} from '../../config/config';

export default function Attract() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [activeCredit, setActiveCredit] = useState(false);
  const isTimeoutPopupActive = useSelector(isTimeoutPopupActiveSelector);
  const [clicked, setClicked] = useState(false);

  const ADRef = useRef();
  const keypadAudioSelector = useSelector(isKeypadAudio);

  useEffect(() => {
    if (keypadAudioSelector) {
      ADRef.current.blur();
      setTimeout(() => {
        ADRef.current.focus();
      }, 0);
    }
  }, [keypadAudioSelector]);

  const handleClick = useCallback(() => {
    if (!clicked) {
      setClicked(true);
      history.push('/intro');
      dispatch(sendKeypadToGA());
      dispatch(setSessionStartTime(new Date()));
    }
  }, [history, dispatch, clicked]);

  const handleCreditToggle = useCallback((isActive) => {
    setActiveCredit(isActive);
  }, []);

  return (
    <Root data-testid="attract" onClick={handleClick}>
      <AudioDescription
        forwardedRef={ADRef}
        description={contentMatrix.attract.audioDescription}
        active={true}
        autoFocus={true}
        autoFocusInNonAD={true}
      />
      <BigCircleStyled />
      <PlanetDeco src={loader.get(ATTRACT_PLANET_DECO).src} alt="decoration" />
      <RingsDecorationStyled />
      <Content handleClick={handleClick} />
      <NoSound src={loader.get(ATTRACT_NO_SOUND).src} />
      <KeyPadPopup
        tabIndex={tabable(2, !activeCredit && !isTimeoutPopupActive)}
        handleClickContinue={handleClick}
        activeCredit={activeCredit}
      />
      <NoSound src={loader.get(ATTRACT_NO_SOUND).src} />

      <Credit
        active={activeCredit}
        handleClick={() => handleCreditToggle(false)}
      />
      <CreditButton
        onClick={(e) => {
          e.stopPropagation();
          handleCreditToggle(true);
        }}
        src={loader.get(ATTRACT_CREDIT_ICON).src}
        tabIndex={tabable(3, !activeCredit && !isTimeoutPopupActive)}
        aria-label={contentMatrix.attract.creditButtonLabel}
        aria-roledescription={' '}
      />
    </Root>
  );
}

const Root = styled(Page)`
  display: flex;
  background-image: url(${loader.get(ATTRACT_BG).src});
  background-repeat: no-repeat;
  background-size: cover;
  justify-content: center;
  z-index: 999;
`;

const BigCircleStyled = styled(BigCircle)`
  position: absolute;
  top: ${vw(-84)};
  left: ${vw(329)};
  width: ${vw(1262)};
  height: ${vw(1262)};
`;

const PlanetDeco = styled.img`
  position: absolute;
  bottom: ${vw(-20)};
  left: ${vw(300)};
  width: ${vw(332)};
  height: ${vw(326)};
  animation: orbit 25s linear infinite;
  @keyframes orbit {
    0% {
      transform: translate(${vw(-50)}, ${vw(-110)});
    }
    50% {
      transform: translate(${vw(0)}, ${vw(0)});
    }
    100% {
      transform: translate(${vw(-50)}, ${vw(-110)});
    }
  }
`;

const RingsDecorationStyled = styled(RingsDecoration)`
  position: absolute;
  top: ${vw(370)};
  left: ${vw(480)};
`;

const NoSound = styled.img`
  position: absolute;
  bottom: ${vw(25)};
  left: ${vw(27)};
  width: ${vw(454)};
  height: ${vw(70)};
`;

const CreditButton = styled.button`
  position: absolute;
  bottom: ${vw(32.5)};
  right: ${vw(32)};
  width: ${vw(140)};
  height: ${vw(55)};
  background-image: url(${(props) => props.src});
  background-position: center;
  background-repeat: no-repeat;
`;
