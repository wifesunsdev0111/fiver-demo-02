import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import { vw } from '../styles/utils';
import { useSelector, useDispatch } from 'react-redux';
import StartOverButton from '../components/StartOverButton';
import {
  wasKeypadUsed as wasKeypadUsedSelector,
  setPopUpActive,
} from '../redux/app';
import Button from '../components/Button';
import KeypadVerticalNavList from '../plugins/components/KeypadVerticalNavList';
import {
  clearAllObjects as clearAllObjectsActionCreator,
  resetEndEventType,
} from '../redux/game';

export default function TimeOutPopup({ tabIndex, reset }) {
  const wasKeypadUsed = useSelector(wasKeypadUsedSelector);
  const active = useSelector((state) => state.app.isPopupActive);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef();
  const yesRef = useRef();
  const dispatch = useDispatch();
  const startOverRef = useRef();

  const handleClickYes = () => {
    dispatch(setPopUpActive(false));
  };
  const handleClickNo = useCallback(() => {
    dispatch(clearAllObjectsActionCreator());
    dispatch(resetEndEventType());
    reset();
    dispatch(setPopUpActive(false));
  }, [reset, dispatch]);

  useEffect(() => {
    if (active && wasKeypadUsed) {
      const timer3 = setTimeout(() => {
        containerRef.current.focus();
      }, 500);
      return () => clearTimeout(timer3);
    }
  }, [active, wasKeypadUsed]);

  useEffect(() => {
    if (active === true) {
      const timer = setTimeout(() => {
        if (!isFocused) {
          handleClickNo();
        }
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [active, handleClickNo, wasKeypadUsed, isFocused]);

  useEffect(() => {
    if (active === true) {
      const timer2 = setTimeout(() => {
        setIsFocused(false);
      }, 10000);
      return () => clearTimeout(timer2);
    }
  }, [active, isFocused]);

  return (
    <Root active={active}>
      <Title tabIndex={-1}>
        <span>Do you need more time? </span>
      </Title>

      <ButtonContainer
        tabIndex={active ? tabIndex + 2 : -1}
        onFocus={() => {
          setIsFocused(true);
        }}
        ref={containerRef}
        aria-label={
          'A message is on screen: Do you need more time?  Press the down arrow key once for the Yes button; press it a second time for the No button. Press the right arrow key once for the start over button. If no key is pressed in 30 seconds, the program will return to the home screen'
        }
        aria-roledescription=" "
      >
        <ButtonStyled
          key="yesbutton"
          ref={yesRef}
          onClick={handleClickYes}
          onFocus={() => {
            setIsFocused(true);
          }}
          index={1}
          aria-roledescription="Button. Press the center key to keep exploring"
        >
          <span>Yes</span>
        </ButtonStyled>
        <ButtonStyled
          key="nobutton"
          onClick={handleClickNo}
          onFocus={() => {
            setIsFocused(true);
          }}
          aria-roledescription="Button. Press the center key to end the program"
        >
          <span>No, I'm Done</span>
        </ButtonStyled>
      </ButtonContainer>

      <StartOverButton
        tabIndex={active ? tabIndex + 3 : -1}
        startOverRef={startOverRef}
      />
    </Root>
  );
}

const Root = styled.div`
  opacity: ${(props) => (props.active ? '1' : '0')};
  z-index: ${(props) => (props.active ? '1000' : '-1')};
  transition: opacity 1s ease-in-out;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
`;

const Title = styled.div`
  position: absolute;
  left: 50%;
  top: ${vw(440)};
  transform: translate(-50%, 0%);
  font-size: ${vw(49)};
  height: ${vw(84)};
  color: white;
  span {
    font-size: ${vw(61)};
    letter-spacing: ${vw(1.4)};
    line-height: ${vw(84)};
    font-family: ${({ theme }) => theme.font.nunito};
    font-weight: 500;
  }
`;

const ButtonContainer = styled(KeypadVerticalNavList)`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  top: ${vw(440)};
  left: ${vw(608)};
  /* left: 50%; */
  /* transform: translate(-50%, 0%); */
  width: ${vw(701)};
  height: ${vw(174)};
`;

const ButtonStyled = styled(Button)`
  margin-top: ${vw(100)};
  margin-left: ${(props) => (props.index !== 1 ? vw(0) : vw(40))};
  margin-right: ${(props) => (props.index !== 1 ? vw(40) : vw(0))};
  width: ${vw(282)};
  font-family: ${({ theme }) => theme.font.nunito};
  font-weight: 500;
`;
