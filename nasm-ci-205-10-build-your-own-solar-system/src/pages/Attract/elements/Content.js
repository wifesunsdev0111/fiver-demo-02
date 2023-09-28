import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { vw } from '../../../styles/utils';
import { Slide, Stagger } from '../../../components/Animation';
import contentMatrix from '../../../data/contentMatrix';
import { loader } from '../../../plugins/components/Preloader';
import { ATTRACT_HAND } from '../../../config/config';

export default function Content({ handleClick }) {
  const [isAnim, setIsAnim] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(
      () => {
        setIsAnim(!isAnim);
      },
      isAnim ? 14000 : 1000
    );
    return () => {
      clearTimeout(timeout);
    };
  }, [isAnim]);

  return (
    <Stagger
      delay={1000}
      animate={isAnim}
      animationComponent={Slide}
      content={[
        <Title>{contentMatrix.attract.title}</Title>,
        <CTA onClick={handleClick} tabIndex={-1}>
          {contentMatrix.attract.buttonLabel}
          <CTAImage alt=" " src={loader.get(ATTRACT_HAND).src} />
        </CTA>,
      ]}
    />
  );
}

const CTA = styled.button`
  position: absolute;
  top: ${vw(842)};
  left: ${vw(839)};
  padding-top: ${vw(20)};
  padding-bottom: ${vw(20)};
  padding-left: ${vw(60)};
  font-family: ${({ theme }) => theme.font.industry};
  font-weight: 500;
  font-style: normal;
  font-size: ${vw(22)};
  line-height: ${vw(32)};
  letter-spacing: ${vw(1.37)};
  color: ${({ theme }) => theme.color.primaryText};
`;

const CTAImage = styled.img`
  position: absolute;
  top: 0%;
  left: 0%;
  width: ${vw(45)};
  height: ${vw(64)};
  animation: pulse 4s infinite;
  @keyframes pulse {
    0% {
      transform: scale(0.8);
    }
    70% {
      transform: scale(1);
    }
    100% {
      transform: scale(0.8);
    }
  }
`;

const Title = styled.h1`
  position: absolute;
  top: ${vw(410)};
  left: ${vw(470)};
  width: ${vw(1200)};
  font-weight: 200;
  color: ${({ theme }) => theme.color.primaryText};
  font-size: ${vw(50)};
  & > span:nth-child(1) {
    font-size: ${vw(106)};
    line-height: ${vw(130)};
    letter-spacing: ${vw(8)};
  }
  & > span:nth-child(2) {
    font-size: ${vw(120)};
    line-height: ${vw(130)};
    letter-spacing: ${vw(9)};
  }
`;
