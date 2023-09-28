import React, { useEffect, useRef, useState } from 'react';

import styled from 'styled-components';
import { vw } from '../styles/utils';
import contentMatrix from '../data/contentMatrix';
import { isTimeoutPopupActiveSelector } from '../redux/app';
import { tabable } from '../utils/screenreader';
import { useSelector } from 'react-redux';
import { Scrollbar } from 'react-scrollbars-custom';
import ReactSlider from 'react-slider';
import { loader } from '../plugins/components/Preloader';
import { TRANSPARENT_CLOSE_ICON } from '../config/config';

const ScrollContentHeight = 558;
export default function Credit({ active, handleClick, tabIndex }) {
  const adRef = useRef();
  const buttonRef = useRef();
  // const wasKeypadUsed = useSelector(wasKeypadUsedSelector);
  const [isThumbActive, setIsThumbActive] = useState(false);
  const [isADActive, setIsADActive] = useState(true);
  const [sliderVal, setSliderVal] = useState(0);
  const [isSliderVisible, setSliderVisible] = useState(false);
  const isTimeoutPopupActive = useSelector(isTimeoutPopupActiveSelector);

  const simpleBarRef = useRef();

  const handleValChange = (val) => {
    setSliderVal(val);
    // console.log(sliderVal);
    simpleBarRef.current.scrollTo(0, (val * ScrollContentHeight) / 100);
  };

  useEffect(() => {
    if (active && !isTimeoutPopupActive) {
      setIsADActive(true);
      setTimeout(() => {
        adRef.current.focus();
      }, 500);
      if (contentMatrix.credits.length > 16) {
        setSliderVisible(true);
      } else {
        setSliderVisible(false);
      }
    }
  }, [active, isTimeoutPopupActive]);

  const handleOnClick = () => {
    handleClick();
  };

  return (
    <Root
      active={active}
      isThumbActive={isThumbActive}
      tabIndex={tabable(1, active && isADActive && !isTimeoutPopupActive)}
      onBlur={() => setIsADActive(false)}
      onClick={(e) => {
        e.stopPropagation();
      }}
      aria-label={
        active
          ? 'A list of credits appears in the center of the screen. Tab once with the right arrow key for the list, or tab twice for the close button to return to the keypad introduction screen'
          : ''
      }
      aria-roledescription={' '}
      ref={adRef}
    >
      <CreditsAD
        tabIndex={tabable(2, active && !isTimeoutPopupActive)}
        aria-label={' '}
        aria-roledescription={`List of Credits, There are ${
          contentMatrix.credits.length
        } entries on the screen. 
      Tab once to the right to skip the credits. Credits.
       ${(contentMatrix.creditsAD
         ? contentMatrix.creditsAD
         : contentMatrix.credits
       ).map((credit, index) => `${credit} , `)}`}
      />
      <Title>
        <b>Credits</b>
      </Title>

      <CreditInfo isThumbActive={isThumbActive}>
        <Slider active={isSliderVisible} tabIndex={-1}>
          <ReactSlider
            min={0}
            max={100}
            defaultValue={100}
            orientation="vertical"
            thumbClassName="example-thumb"
            tabIndex="-1"
            renderThumb={(props, state) => (
              <div {...props} tabIndex="-1">
                {<span tabIndex="-1"></span>}
              </div>
            )}
            onChange={handleValChange}
            onSliderClick={() => setIsThumbActive(false)}
            value={sliderVal}
          ></ReactSlider>
        </Slider>

        <Scrollbar
          style={{
            bottom: 0,
            left: 20,
            width: 640,
            height: ScrollContentHeight,
          }}
          ref={simpleBarRef}
          renderer={(props) => {
            const { elementRef, ...restProps } = props;
            return (
              <span
                {...restProps}
                ref={elementRef}
                className="MyAwesomeScrollbarsHolder"
              />
            );
          }}
          wrapperProps={{
            renderer: (props) => {
              const { elementRef, ...restProps } = props;
              return (
                <span
                  {...restProps}
                  ref={elementRef}
                  className="MyAwesomeScrollbarsWrapper"
                />
              );
            },
          }}
          scrollerProps={{
            renderer: (props) => {
              const { elementRef, ...restProps } = props;
              return (
                <span
                  {...restProps}
                  ref={elementRef}
                  className="MyAwesomeScrollbarsScroller"
                />
              );
            },
          }}
          contentProps={{
            renderer: (props) => {
              const { elementRef, ...restProps } = props;
              return (
                <span {...restProps} ref={elementRef} className="Content" />
              );
            },
          }}
          trackYProps={{
            renderer: (props) => {
              const { elementRef, ...restProps } = props;
              return (
                <span {...restProps} ref={elementRef} className="trackY" />
              );
            },
          }}
        >
          {contentMatrix.credits.map((credit, index) => (
            <p key={index}>{credit}</p>
          ))}
        </Scrollbar>
      </CreditInfo>

      <CloseButton
        onClick={(e) => {
          e.stopPropagation();
          handleOnClick();
        }}
        src={loader.get(TRANSPARENT_CLOSE_ICON).src}
        tabIndex={tabable(6, active && !isTimeoutPopupActive)}
        ref={buttonRef}
        aria-roledescription={
          'Close, button. Press the center key to return to the keypad introduction screen'
        }
      />
    </Root>
  );
}

const Root = styled.div`
  display: ${(props) => (props.active ? 'flex' : 'none')};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  .trackY {
    opacity: 0;
  }

  .example-thumb {
    z-index: 998;
    top: -50%;
    transform: translate(-40%, -0%);
    width: ${vw(14)};
    height: ${vw(14)};
    border-radius: 50%;
    background: white;
    span {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: ${vw(33)};
      height: ${vw(33)};
      background: white;
      border-radius: 50%;
      opacity: 0;
      :active {
        opacity: 0.2;
      }
    }
  }
  .slider {
    height: ${vw(107)};
    width: 100%;
    border-radius: ${vw(10)};
  }
  .track {
    height: 100%;
    border-radius: ${vw(10)};
    &.track-0 {
    }
    &.track-1 {
      background: red;
      border-radius: ${vw(10)};
    }
  }

  .MyAwesomeScrollbarsWrapper {
    /* background: green; */
    height: ${vw(558)};
  }
`;

const Slider = styled.div`
  /* background: ${(props) =>
    props.isFocused ? ({ theme }) => theme.color.focus : ''}; */
  display: ${(props) => (props.active ? 'block' : 'none')};
  height: ${vw(107)};
  width: ${vw(2)};
  position: absolute;
  top: 5%;
  left: 0%;
  background: rgba(255, 255, 255, 0.52);
  border-radius: ${vw(10)};
  /* opacity: ${(props) => (props.show ? 1 : 0)}; */
  /* pointer-events: ${(props) => (props.show ? 'auto' : 'none')}; */
`;

const CreditInfo = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: left;
    left: ${vw(825)};
    top:${vw(365)};
   /* background: pink; */
    width: ${vw(640)};
    height: ${vw(560)};
    p{
        margin-bottom: ${vw(7)};
        margin-left: ${vw(30)};
        font-family: ${({ theme }) => theme.font.nunito};
        font-weight: 500;
        font-size:${vw(22)};
       line-height:${vw(26)};
       color: white;
    }
    
  }

`;
const Title = styled.div`
  position: absolute;
  left: ${vw(870)};
  top: ${vw(278)};
  height: ${vw(67)};
  width: ${vw(170)};
  color: #ffffff;
  font-family: ${({ theme }) => theme.font.nunito};
  font-size: ${vw(49)};
  font-weight: bold;
  letter-spacing: 1px;
  line-height: ${vw(67)};
  text-shadow: 3px 3px 4px 0 rgba(0, 0, 0, 0.5);
`;

const CreditsAD = styled.div`
  position: absolute;
  width: ${vw(640)};
  height: ${vw(650)};
  top: ${vw(280)};
  left: ${vw(800)};
`;

const CloseButton = styled.button`
  position: absolute;
  width: ${vw(39)};
  height: ${vw(48)};
  color: white;
  top: ${vw(25)};
  right: ${vw(25)};
  background-image: url(${(props) => props.src});
  background-repeat: no-repeat;
  background-position: center;
`;
