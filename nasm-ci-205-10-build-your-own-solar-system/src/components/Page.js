import React from 'react';
import styled from 'styled-components';

export default function Page(props) {
  return <Root {...props} aria-roledescription=" "></Root>;
}

const Root = styled.main`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;
