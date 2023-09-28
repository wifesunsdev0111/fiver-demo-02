import React from 'react';
import styled from 'styled-components';
import { vw } from '../../../styles/utils';
const LOADING_BAR_STARTING_POINT = 0;

export default function ProgressBar({ progress }) {
  return (
    <Root>
      <ProgressBarContainer>
        <Bar
          style={{
            transform: `translateX(${
              -(100 - LOADING_BAR_STARTING_POINT) +
              progress * (100 - LOADING_BAR_STARTING_POINT)
            }%)`,
          }}
        />
      </ProgressBarContainer>
      <h2>Loading...</h2>
      <span>{`${parseInt(progress * 100)}%`}</span>
    </Root>
  );
}

const Root = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${vw(1046)};
  height: ${vw(127)};
  border: 1px solid white;
  font-weight: bold;

  h2 {
    position: absolute;
    top: ${vw(-90)};
    left: ${vw(40)};
    width: ${vw(227)};
    height: ${vw(67)};
    font-size: ${vw(49)};
    line-height: ${vw(67)};
    letter-spacing: ${vw(1)};
    text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.5);
    color: white;
  }
  span {
    position: absolute;
    bottom: ${vw(-70)};
    left: ${vw(40)};
    width: ${vw(67)};
    height: ${vw(41)};
    font-size: ${vw(30)};
    line-height: ${vw(41)};
    letter-spacing: ${vw(0.61)};
    text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.5);
    color: white;
  }
`;
const ProgressBarContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${vw(968)};
  height: ${vw(19)};
  background: rgba(0, 0, 0, 0.25);
  border-radius: ${vw(9)};
  overflow: hidden;
`;

const Bar = styled.div`
  width: 100%;
  height: 100%;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  background: #fff;
  transition: all 0.1s;
  border-radius: 0.5vw;
`;
