import React from 'react';

import styled from 'styled-components';
import Page from '../../components/Page';
import { vw } from '../../styles/utils';
import StartOverButton from '../../components/StartOverButton';
import AudioDescription from '../../components/AudioDescription';
import Button from '../../components/Button';
import { Stagger } from '../../components/Animation';
import contentMatrix from '../../data/contentMatrix';
import { useSelector } from 'react-redux';
import useResetHook from '../../plugins/hooks/useResetHook';
import { tabable } from '../../utils/screenreader';
import { loader } from '../../plugins/components/Preloader';
import { OUTRO_BG } from '../../config/config';
import { isTimeoutPopupActiveSelector } from '../../redux/app';

export default function Outro() {
  const reset = useResetHook();
  const isTimeoutPopupActive = useSelector(isTimeoutPopupActiveSelector);

  return (
    <Root>
      <AudioDescription
        description={`${contentMatrix.outro.title} ${contentMatrix.outro.audioDescription} ${contentMatrix.outro.description}`}
        autoFocus={true}
        active={true}
      />
      <Stagger
        content={[
          <h1>{contentMatrix.outro.title}</h1>,
          <p>{contentMatrix.outro.description}</p>,
          <ButtonWrapper>
            <BackButton
              tabIndex={tabable(2, !isTimeoutPopupActive)}
              onClick={reset}
              aria-roledescription={
                contentMatrix.outro.backToStartButtonAriaRoledescription
              }
            >
              {contentMatrix.outro.backToStartButtonLabel}
            </BackButton>
          </ButtonWrapper>,
        ]}
      />
      <StartOverButton tabIndex={tabable(-1, !isTimeoutPopupActive)} />
    </Root>
  );
}

const Root = styled(Page)`
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(${loader.get(OUTRO_BG).src});
  background-size: cover;
  background-position: center;
  color: white;

  h1 {
    position: absolute;
    top: ${vw(137)};
    left: ${vw(116)};
    width: ${vw(850)};
    height: ${vw(69)};
    font-size: ${vw(58)};

    line-height: ${vw(75)};
    font-family: ${({ theme }) => theme.font.industry};
    font-weight: normal;
    font-style: normal;
  }

  p {
    position: absolute;
    top: ${vw(230)};
    left: ${vw(116)};
    width: ${vw(824)};
    height: ${vw(207)};
    font-size: ${vw(28)};
    line-height: ${vw(38)};
    font-family: ${({ theme }) => theme.font.nunito};
    font-weight: normal;
    font-style: normal;
  }
`;

const ButtonWrapper = styled.div`
  position: absolute;
  top: ${vw(486)};
  left: ${vw(121)};
`;

const BackButton = styled(Button)`
  width: ${vw(329)};
`;
