import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { vw } from '../styles/utils';
//import { useSelector } from 'react-redux'
import useResetHook from '../plugins/hooks/useResetHook';
//import { wasKeypadUsed as wasKeypadUsedSelector } from '../redux/app'

export default function ErrorScreen({ error, resetErrorBoundary }) {
  const reset = useResetHook();
  const adRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      resetErrorBoundary();
      reset();
    }, 10000);
    return () => clearTimeout(timer);
  }, [reset, resetErrorBoundary]);

  return (
    <Root
      onClick={reset}
      tabIndex={2}
      role="button"
      ref={adRef}
      aria-roledescription={`Sorry, something unexpected happened. The system will resume in a moment, ${error.message}`}
    >
      <Header>
        Sorry, something unexpected happened. The system will resume in a
        moment.
      </Header>
      <ErrorDescription>Error: {error.message}</ErrorDescription>
    </Root>
  );
}
const Root = styled.div`
  z-index: 999;
  position: absolute;
  width: 100%;
  height: 100%;
  left: ${vw(0)};
  bottom: ${vw(0)};
  background: black;
`;

const Header = styled.div`
  position: absolute;
  width: ${vw(899)};
  height: ${vw(32)};
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: ${vw(24)};
  line-height: ${vw(32)};
  letter-spacing: ${vw(0.49)};
  font-family: ${({ theme }) => theme.font.nunito};
  font-weight: bold;
  font-style: normal;
  color: ${({ theme }) => theme.color.secondary};
  text-shadow: 3px 3px 4px 0 rgba(0, 0, 0, 0.5);
`;

const ErrorDescription = styled.div`
  position: absolute;
  width: ${vw(899)};
  height: auto;
  left: 50%;
  top: 55%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: ${vw(18)};
  line-height: ${vw(27)};
  letter-spacing: ${vw(0.49)};
  font-family: ${({ theme }) => theme.font.nunito};
  font-weight: bold;
  font-style: normal;
  color: ${({ theme }) => theme.color.secondary};
  text-shadow: 3px 3px 4px 0 rgba(0, 0, 0, 0.5);
`;
