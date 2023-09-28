import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { vw } from '../styles/utils';
import AudioDescription from '../components/AudioDescription';
import Button from '../components/Button';
import { Slide } from '../components/Animation';
import contentMatrix from '../data/contentMatrix';
import { tabable } from '../utils/screenreader';
import { useSelector, useDispatch } from 'react-redux';
import { loader } from '../plugins/components/Preloader';
import { CLOSE_ICON_WHITE } from '../config/config';
import { sendTutorialEventsToGA } from '../redux/gaEvents';
import { setActiveHotspotIndex } from '../redux/hotspots';
import { isTimeoutPopupActiveSelector } from '../redux/app';
import modalHOC, {
  SHOW_MODAL_ANIMATION_DURATION,
} from '../components/modalHOC';

const InstructionPanel = ({
  open,
  onClose,
  handleClickGo,
  isStartOverPopupActive,
}) => {
  const [isAnim, setIsAnim] = useState(true);
  const [instructionIndex, setInstructionIndex] = useState(0);
  const [activeInstructionIndex, setActiveInstructionIndex] = useState(null);
  const instructions = contentMatrix.intro.instructions;
  const activeInstruction = instructions[activeInstructionIndex];
  const refGroup = useRef();
  const isTimeoutPopupActive = useSelector(isTimeoutPopupActiveSelector);
  const dispatch = useDispatch();
  const changeIndex = (index) => {
    setInstructionIndex(index);
    dispatch(setActiveHotspotIndex(index));
    dispatch(sendTutorialEventsToGA());
  };

  useEffect(() => {
    if (instructionIndex !== activeInstructionIndex) {
      const timeout = setTimeout(
        () => {
          setActiveInstructionIndex(instructionIndex);
        },
        activeInstructionIndex == null ? 0 : 600
      );
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [instructionIndex, activeInstructionIndex]);

  useEffect(() => {
    const focusTimeout = setTimeout(() => {
      if (activeInstructionIndex != null && refGroup && refGroup.current) {
        refGroup.current.focus();
      }
    }, 0);
    return () => {
      clearTimeout(focusTimeout);
    };
  }, [activeInstructionIndex]);

  useEffect(() => {
    if (instructionIndex !== activeInstructionIndex) {
      setIsAnim(false);
    } else if (!isAnim) {
      const timeout = setTimeout(() => {
        setIsAnim(true);
      }, 0);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [instructionIndex, activeInstructionIndex, isAnim]);

  if (activeInstructionIndex == null) return null;

  return (
    <Content open={open}>
      <AudioDescription
        description={contentMatrix.intro.audioDescription}
        autoFocus={true}
        active={!isStartOverPopupActive}
      />
      <Slide animate={isAnim} direction="none">
        <ImageContainer>
          <Image
            tabIndex={tabable(
              3,
              !isTimeoutPopupActive && !isStartOverPopupActive
            )}
            alt={activeInstruction.imgAlt}
            aria-roledescription=" "
            src={loader.get(activeInstruction.thumb).src}
          />
        </ImageContainer>
      </Slide>
      <BodyWrapper
        ref={refGroup}
        tabIndex={tabable(2, !isTimeoutPopupActive && !isStartOverPopupActive)}
        aria-label={`${instructions[activeInstructionIndex].ariaIndex}, ${
          instructions[activeInstructionIndex].title
        }, ${activeInstructionIndex === 0 ? activeInstruction.heading : ''}, ${
          activeInstruction.body1
        } ${activeInstruction.body2 ? activeInstruction.body2 : ''}`}
        aria-roledescription={' '}
      >
        <Slide animate={isAnim}>
          <NumberSection
            aria-label={`${instructions[activeInstructionIndex].ariaIndex}, ${instructions[activeInstructionIndex].title},`}
          >
            {instructions.map((instruction, index) => {
              const active = activeInstructionIndex === index;
              return (
                <CircleNumber
                  key={index}
                  instruction={instruction}
                  active={active}
                >
                  <h1 aria-label={instruction.ariaIndex}>{index + 1}</h1>
                  <h2>{instruction.title}</h2>
                </CircleNumber>
              );
            })}
            <Line1 />
            <Line2 />
          </NumberSection>
        </Slide>
        <Slide animate={isAnim} delay={75}>
          <Body activeInstruction={activeInstruction}>
            {activeInstructionIndex === 0 && (
              <h2>{activeInstruction.heading}</h2>
            )}
            <p>{activeInstruction.body1}</p>
            {activeInstruction.body2 && (
              <>
                <br />
                <br />
                <p>{activeInstruction.body2}</p>
              </>
            )}
          </Body>
        </Slide>
      </BodyWrapper>
      <Slide animate={isAnim} delay={150}>
        <ButtonWrapper>
          <NextButton
            tabIndex={tabable(
              4,
              !isTimeoutPopupActive && !isStartOverPopupActive
            )}
            onClick={() =>
              activeInstructionIndex !== 2
                ? changeIndex(activeInstructionIndex + 1)
                : handleClickGo()
            }
            aria-roledescription={
              activeInstructionIndex !== 2
                ? contentMatrix.intro.nextButtonAriaRoleDescription
                : contentMatrix.intro.letsgoButtonAriaRoleDescription
            }
          >
            {activeInstructionIndex !== 2
              ? contentMatrix.intro.nextButtonLabel
              : contentMatrix.intro.letsgoButtonLabel}
          </NextButton>
          {activeInstructionIndex !== 0 && (
            <PreviousButton
              tabIndex={tabable(
                5,
                !isTimeoutPopupActive && !isStartOverPopupActive
              )}
              onClick={() => changeIndex(activeInstructionIndex - 1)}
              aria-roledescription={
                contentMatrix.intro.previousButtonAriaRoleDescription
              }
            >
              {contentMatrix.intro.previousButtonLabel}
            </PreviousButton>
          )}
        </ButtonWrapper>
      </Slide>
      <XIconButton
        aria-label={contentMatrix.intro.closeButtonAriaLabel}
        aria-roledescription={
          contentMatrix.intro.closeButtonAriaRoleDescription
        }
        tabIndex={tabable(7, !isTimeoutPopupActive && !isStartOverPopupActive)}
        onClick={onClose}
        data-testid="intro-closeButton"
      />
    </Content>
  );
};

export default modalHOC(InstructionPanel);

const showModalAnimation = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.75) ;
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const hideModalAnimation = keyframes`
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.75);
  }
`;

const Content = styled.div`
  z-index: 998;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #272949;
  width: ${vw(1331)};
  height: ${vw(780)};
  clip-path: polygon(
    0% 15%,
    0 0,
    15% 0%,
    85% 0%,
    100% 0,
    100% 15%,
    100% 94%,
    98% 98%,
    97% 100%,
    15% 100%,
    0 100%,
    0% 85%
  );
  animation: ${({ open }) => (open ? showModalAnimation : hideModalAnimation)}
    ${SHOW_MODAL_ANIMATION_DURATION}ms forwards;
`;

const BodyWrapper = styled.div`
  position: absolute;
  left: ${vw(688)};
  top: ${vw(82)};
  width: ${vw(555)};
`;

const Body = styled.div`
  width: ${vw(555)};
  margin-top: ${vw(77)};
  text-align: left;
  color: white;

  h2 {
    position: relative;
    top: 20%;
    font-size: ${vw(35)};
    line-height: ${vw(42)};
    font-family: ${({ theme }) => theme.font.industry};
    font-weight: 300;
    font-style: normal;
    margin-bottom: ${vw(49)};
    text-transform: capitalize;
  }

  p {
    position: relative;
    top: 30%;
    font-size: ${vw(22)};
    font-family: ${({ theme }) => theme.font.nunito};
    font-weight: normal;
    font-style: normal;
  }
`;

const Image = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
`;
const ImageContainer = styled.div`
  position: absolute;
  width: ${vw(585)};
  height: ${vw(601)};
  left: ${vw(49)};
  bottom: ${vw(95)};
`;

const NumberSection = styled.div`
  display: flex;
  width: ${vw(400)};
  height: ${vw(120)};
  h1 {
    margin-right: 67px;
  }
`;
const CircleNumber = styled.div`
  position: relative;
  margin: ${vw(35)};
  background: ${(props) => (props.active ? '#CE62D3' : null)};
  align-items: center;
  text-align: center;
  border: 4px solid #ce62d3;
  border-radius: 50%;
  width: ${vw(58)};
  height: ${vw(58)};
  font-family: ${({ theme }) => theme.font.industry};
  font-weight: 200;
  font-style: normal;
  line-height: ${vw(32)};
  :first-child {
    margin-left: 0;
  }
  :last-child {
    margin-right: 0;
  }

  h1 {
    font-size: ${vw(26)};
    line-height: ${vw(32)};
    font-family: ${({ theme }) => theme.font.nunito};
    text-align: center;
    display: block;
    margin: auto;
    top: 28%;
    transform: translateY(32%);
    color: ${(props) => (props.active ? '#272949' : '#CE62D3')};
  }

  h2 {
    position: absolute;
    bottom: -50%;
    left: 50%;
    transform: translate(-50%, 50%);
    font-family: ${({ theme }) => theme.font.industry};
    font-weight: 200;
    font-style: normal;
    font-size: ${vw(22)};
    line-height: ${vw(32)};

    text-align: center;
    overflow: hidden;
    color: #fff;
    white-space: nowrap;
  }
`;

const ButtonWrapper = styled.div`
  position: absolute;
  right: ${vw(80)};
  bottom: ${vw(84)};
`;

const NextButton = styled(Button)`
  position: absolute;
  width: ${vw(200)};
  bottom: ${vw(0)};
  right: ${vw(0)};
`;

const PreviousButton = styled(Button)`
  position: absolute;
  width: ${vw(200)};
  bottom: ${vw(0)};
  right: ${vw(233)};
`;

const XIconButton = styled.button`
  position: absolute;
  background-image: url(${loader.get(CLOSE_ICON_WHITE)});
  width: ${vw(41)};
  height: ${vw(48)};
  background-repeat: no-repeat;
  background-position: center;
  top: ${vw(35)};
  right: ${vw(35)};
`;

const Line1 = styled.div`
  position: absolute;
  left: ${vw(58)};
  top: ${vw(64)};
  width: ${vw(71)};
  height: ${vw(3)};
  background: #944997;
`;

const Line2 = styled.div`
  position: absolute;
  left: ${vw(186)};
  top: ${vw(64)};
  width: ${vw(71)};
  height: ${vw(3)};
  background: #944997;
`;
