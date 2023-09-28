import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import Page from '../../components/Page';
import StartOverButton from '../../components/StartOverButton';
import InstructionPanel from '../../components/InstructionPanel';

import { resumeGame } from '../../redux/game';

import { tabable } from '../../utils/screenreader';
import { loader } from '../../plugins/components/Preloader';
import { INTRO_BG } from '../../config/config';
import { isTimeoutPopupActiveSelector } from '../../redux/app';

export default function Intro() {
  const history = useHistory();
  const dispatch = useDispatch();
  const isTimeoutPopupActive = useSelector(isTimeoutPopupActiveSelector);

  const handleClick = useCallback(() => {
    dispatch(resumeGame());
    history.push('/main');
  }, [history, dispatch]);

  return (
    <>
      <Root>
        <InstructionPanel
          open={true}
          onClose={handleClick}
          handleClickGo={handleClick}
          isStartOverPopupActive={false}
        />
      </Root>
      <StartOverButton tabIndex={tabable(20, !isTimeoutPopupActive)} />
    </>
  );
}

const Root = styled(Page)`
  z-index: 998;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(${loader.get(INTRO_BG).src});
  background-size: cover;
  background-position: 50% 50%;
`;
