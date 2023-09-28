import React from 'react';
import styled, { keyframes } from 'styled-components';
import { vw } from '../styles/utils';
import { loader } from '../plugins/components/Preloader';
import {
  ATTRACT_DECO_RING_1,
  ATTRACT_DECO_RING_2,
  ATTRACT_DECO_RING_3,
} from '../config/config';

export default function RingsDeco({ className }) {
  return (
    <Root className={className}>
      <Ring src={loader.get(ATTRACT_DECO_RING_1).src} />
      <Ring src={loader.get(ATTRACT_DECO_RING_2).src} />
      <Ring src={loader.get(ATTRACT_DECO_RING_3).src} />
    </Root>
  );
}

const Root = styled.div`
  width: ${vw(106)};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const animateRing = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const Ring = styled.img`
  animation: ${animateRing} 5s linear infinite;
  width: ${vw(32)};
  height: ${vw(32)};
  &:nth-child(2) {
    animation-direction: reverse;
  }
`;
