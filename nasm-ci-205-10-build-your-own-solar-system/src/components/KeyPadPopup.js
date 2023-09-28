import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { vw } from '../styles/utils';
import contentMatrix from '../data/contentMatrix';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/Button';
import { wasKeypadUsed as wasKeypadUsedSelector } from '../redux/app';
import { KEYPAD } from '../config/config';
import { loader } from '../plugins/components/Preloader';
import { isTimeoutPopupActiveSelector } from '../redux/app';

import { resetAction } from '../redux/reducers';

export default function KeyPadPopup({
  handleClickContinue,
  tabIndex,
  activeCredit,
}) {
  const wasKeypadUsed = useSelector(wasKeypadUsedSelector);
  const keypadButtonRef = useRef();
  const inputElement = useRef(null);
  const isTimeoutPopupActive = useSelector(isTimeoutPopupActiveSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    if (wasKeypadUsed && tabIndex !== -1 && !isTimeoutPopupActive) {
      inputElement.current.focus();
    }
  }, [wasKeypadUsed, tabIndex, isTimeoutPopupActive]);

  useEffect(() => {
    if (!activeCredit) keypadButtonRef.current.focus();
  }, [activeCredit]);

  const handleClick = () => {
    handleClickContinue();
  };

  return (
    <Outer
      active={wasKeypadUsed}
      onClick={() => {
        dispatch(resetAction());
      }}
    >
      <Root
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Wrapper
          tabIndex={tabIndex}
          aria-label={contentMatrix.keypadInfo.adaOverallHeadphoneText}
          aria-roledescription={' '}
          ref={inputElement}
        >
          <Text top={7} left={12}>
            <b>{contentMatrix.keypadInfo.keypadDescriptionText}</b>
          </Text>
          <Text top={15} left={12}>
            <b> {contentMatrix.keypadInfo.headphonesInstructionText}</b>
          </Text>

          <Text top={90} left={12}>
            {contentMatrix.keypadInfo.useKeypadInstructionText}
          </Text>

          <KeypadImage
            alt="Alt description for the image"
            src={loader.get(KEYPAD).src}
          />
          <Text top={28} left={68}>
            {contentMatrix.keypadInfo.volumeInstructionText}
          </Text>

          <Text top={38.5} left={68}>
            {contentMatrix.keypadInfo.readerSpeedInstructionText}
          </Text>

          <Text top={61.5} left={8}>
            {contentMatrix.keypadInfo.leftButtonInstructionText}
          </Text>
          <Text top={67} left={73}>
            {contentMatrix.keypadInfo.rightButtonInstructionText}
          </Text>
          <Text top={61.5} left={71}>
            {contentMatrix.keypadInfo.centerButtonInstructionText}
          </Text>
          <Text top={40} left={19.5}>
            {contentMatrix.keypadInfo.headphoneJackInstructionText}
          </Text>
        </Wrapper>
        <ContinueButton
          tabIndex={tabIndex !== -1 ? tabIndex + 2 : tabIndex}
          onClick={handleClick}
          aria-roledescription={'button, Press the center key to select'}
          ref={keypadButtonRef}
        >
          Continue
        </ContinueButton>
      </Root>
    </Outer>
  );
}

const Outer = styled.div`
  display: ${(props) => (props.active ? 'block' : 'none')};
  left: 0;
  right: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 999;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${vw(1466)};
  height: 98%;
  border: solid white 2px;
  background: #464646;
  color: white;
`;

const Text = styled.p`
  position: absolute;
  left: ${(props) => props.left}%;
  top: ${(props) => props.top}%;
  font-size: ${vw(26)};
  width: ${vw(1000)};
`;

const ContinueButton = styled(Button)`
  position: absolute;
  left: 50%;
  bottom: 5%;
  transform: translateX(-50%);
  width: ${vw(350)};
  height: ${vw(50)};
  font-size: ${vw(20)};
`;

const Wrapper = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 2%;
  width: 89%;
  height: 85%;
`;

const KeypadImage = styled.img`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 20%;
  width: ${vw(706)};
  height: ${vw(548)};
`;
