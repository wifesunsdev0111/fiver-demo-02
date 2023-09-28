import React from 'react';
import styled from 'styled-components';
import { vw } from '../styles/utils';
import useResetHook from '../plugins/hooks/useResetHook';
import contentMatrix from '../data/contentMatrix';

export default function StartOverButton({ tabIndex, onClick }) {
  const reset = useResetHook();

  return (
    <Root
      aria-roledescription={
        contentMatrix.general.startOverButtonAriaRoleDescription
      }
      tabIndex={tabIndex}
      onClick={onClick ? onClick : reset}
    >
      <span>{contentMatrix.general.startOverButtonLabel}</span>
    </Root>
  );
}

const Root = styled.button`
  z-index: 1000;
  position: absolute;
  width: ${vw(180)};
  height: ${vw(50)};
  left: ${vw(36)};
  bottom: ${vw(35)};
  font-size: ${vw(22)};
  font-family: ${({ theme }) => theme.font.industry};
  font-weight: 300;
  font-style: normal;
  color: ${({ theme }) => theme.color.primaryText};
  background-image: url(${require('../assets/images/icons/startover.svg')});
  background-repeat: no-repeat;
  span {
    margin-left: ${vw(67)};
  }
`;
