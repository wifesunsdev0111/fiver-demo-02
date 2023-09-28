import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { vw } from '../styles/utils';
import AudioDescription from '../components/AudioDescription';
import Modal from '../components/Modal';
import Button from '../components/Button';
import contentMatrix from '../data/contentMatrix';
import { sendButtonInfoToGA, setButtonType } from '../redux/gaEvents';
import { isTimeoutPopupActiveSelector } from '../redux/app';

import { tabable } from '../utils/screenreader';

export default function ExitBox({ active, clickCancelExit, clickYesExit }) {
  const dispatch = useDispatch();
  const exitEventContent = contentMatrix.main.exitEvent;
  const isTimeoutPopupActive = useSelector(isTimeoutPopupActiveSelector);

  const handleClickYesExit = () => {
    dispatch(setButtonType('instructions'));
    dispatch(sendButtonInfoToGA());
    clickYesExit();
  };

  const handleClickCancelExit = () => {
    clickCancelExit();
  };

  return (
    <Modal
      xButtonAriaLabel={exitEventContent.closeButtonAriaLabel}
      xButtonAriaRoleDescription={
        exitEventContent.closeButtonAriaRoleDescription
      }
      open={active}
      onClose={clickCancelExit}
      xButtonTabIndex={-1}
    >
      <AudioDescription
        description={`${exitEventContent.audioDescription} ${exitEventContent.title} ${exitEventContent.description} ${exitEventContent.adTabAriaInstruction}`}
        active={true}
        autoFocus={true}
        additionalHeight={-50}
      />
      <ContentWrapper>
        <Title>{exitEventContent.title}</Title>
        <Description>{exitEventContent.description}</Description>
        <YesExitButton
          aria-roledescription={exitEventContent.yesButtonAriaRoledescription}
          tabIndex={tabable(2, !isTimeoutPopupActive)}
          onClick={handleClickYesExit}
        >
          {exitEventContent.yesButtonLabel}
        </YesExitButton>
        <CancelExitButton
          aria-roledescription={
            exitEventContent.cancelButtonAriaRoleDescription
          }
          tabIndex={tabable(3, !isTimeoutPopupActive)}
          onClick={handleClickCancelExit}
        >
          {exitEventContent.cancelButtonLabel}
        </CancelExitButton>
      </ContentWrapper>
    </Modal>
  );
}

const ContentWrapper = styled.div`
  z-index: 10;
  position: relative;
  margin: ${vw(135)} ${vw(104)} ${vw(80)} ${vw(104)};
  height: calc(100% - ${vw(215)});
`;

const Title = styled.h1`
  position: absolute;
  top: 0;
  left: 0;
  color: ${({ theme }) => theme.color.primaryText};
  font-size: ${vw(38)};
  line-height: ${vw(50)};
`;

const Description = styled.div`
  position: absolute;
  top: ${vw(70)};
  left: 0;
  color: ${({ theme }) => theme.color.primaryText};
  font-size: ${vw(22)};
  line-height: ${vw(27)};
  font-family: ${({ theme }) => theme.font.nunito};
`;

const YesExitButton = styled(Button)`
  position: absolute;
  bottom: 0;
  left: 0;
`;

const CancelExitButton = styled(Button)`
  position: absolute;
  bottom: 0;
  left: ${vw(230)};
`;
