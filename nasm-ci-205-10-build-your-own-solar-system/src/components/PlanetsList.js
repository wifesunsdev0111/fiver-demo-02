import React, { useEffect, useCallback, useState, useRef } from 'react';
import styled from 'styled-components';
import { debounce } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  isGameRunning as isGameRunningSelector,
  getAsteroidBeltCount as getAsteroidBeltCountSelector,
  createObject,
  turnUpSound,
  turnDownSound,
} from '../redux/game';
import {
  setMessageByKey,
  DISTANCE_MESSAGE_KEY,
  createDistanceMessage,
  createFirstDistanceMessage,
} from '../redux/liveMessages';
import Planet, { PlanetImg } from '../components/planetList/Planet';
import PlanetsListAudio from '../components/planetList/PlanetListAudio';
import { tabable } from '../utils/screenreader';
import { vw } from '../styles/utils';
import { loader } from '../plugins/components/Preloader';

const ENTER = 13;
const UP = 38;
const DOWN = 40;

const MAX_POS = 940;
const MIN_POS = 490;
const POS_STEP = 50;
const Y_POS = 540;

const PlanetsList = React.forwardRef(
  (
    {
      objects,
      tabIndex,
      ariaLabel,
      addingPlanetTextTabIndex,
      panelTabIndex,
      isModalOpen,
    },
    ref
  ) => {
    const outerTimeoutRef = useRef();
    const innerTimeoutRef = useRef();
    const dispatch = useDispatch();
    const isGameRunning = useSelector(isGameRunningSelector);
    const getAsteroidBeltCount = useSelector(getAsteroidBeltCountSelector);
    const [isFocused, setIsFocused] = useState(false);
    const wasFocused = useRef(false);
    const [isKeyboardDragging, setIsKeyboardDragging] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const [selectedObjectIndex, setSelectedObjectIndex] = useState(-1);
    const [lastAddedObjectIndex, setLastAddedObjectIndex] = useState(-1);
    const [posX, setPosX] = useState(790);
    const [posY, setPosY] = useState(Y_POS);

    //TODO add effect for change of position message

    const handleOnFocus = useCallback(() => {
      setIsFocused(true);
    }, [setIsFocused]);

    const handleOnBlur = useCallback(() => {
      setIsKeyboardDragging(false);
      setSelectedObjectIndex(-1);
      dispatch(setMessageByKey(DISTANCE_MESSAGE_KEY, ''));
      setIsFocused(false);
    }, [setIsFocused, dispatch]);

    const handleChangePosition = useCallback(
      debounce((x, y) => {
        setPosX(x);
        setPosY(y);
      }, 10),
      []
    );

    const handleChangePositionEnd = useCallback(
      (x, y, obj) => {
        dispatch(createObject({ x, y, obj }));
      },
      [dispatch]
    );

    useEffect(() => {
      if (!isGameRunning) {
        if (outerTimeoutRef && outerTimeoutRef.current)
          clearTimeout(outerTimeoutRef.current);
        if (innerTimeoutRef && innerTimeoutRef.current)
          clearTimeout(innerTimeoutRef.current);
        dispatch(setMessageByKey(DISTANCE_MESSAGE_KEY, ''));
        setIsKeyboardDragging(false);
      }
    }, [isGameRunning, dispatch]);

    const setDistanceMessage = useCallback(
      (x, max, min, step, planetName, first = false, planetLabel) => {
        if (outerTimeoutRef && outerTimeoutRef.current)
          clearTimeout(outerTimeoutRef.current);
        if (innerTimeoutRef && innerTimeoutRef.current)
          clearTimeout(innerTimeoutRef.current);
        dispatch(turnDownSound());
        outerTimeoutRef.current = setTimeout(() => {
          let message = '';
          if (first) {
            message = createFirstDistanceMessage(
              x,
              max,
              min,
              step,
              planetName,
              planetLabel
            );
          } else {
            message = createDistanceMessage(x, max, min, step);
          }
          dispatch(setMessageByKey(DISTANCE_MESSAGE_KEY, message));
          innerTimeoutRef.current = setTimeout(() => {
            dispatch(turnUpSound());
          }, 2500);
        }, 100);
      },
      [dispatch]
    );

    //handle keyboard use effect
    const handleKeyboardInput = useCallback(
      (e) => {
        const { which } = e;
        switch (which) {
          case ENTER:
            if (selectedObjectIndex === 4 && getAsteroidBeltCount >= 6) {
            } else {
              if (isKeyboardDragging) {
                setLastAddedObjectIndex(selectedObjectIndex);
                setIsKeyboardDragging(false);
                handleChangePositionEnd(
                  posX,
                  posY,
                  objects[selectedObjectIndex]
                );
                dispatch(setMessageByKey(DISTANCE_MESSAGE_KEY, ''));
              } else {
                setIsKeyboardDragging(true);
                setDistanceMessage(
                  posX,
                  MAX_POS,
                  MIN_POS,
                  POS_STEP,
                  objects[selectedObjectIndex].label,
                  true,
                  objects[selectedObjectIndex].name
                );
              }
            }
            break;
          case UP:
            if (isKeyboardDragging) {
              if (posX > MIN_POS) {
                const newPosX = posX - POS_STEP;
                handleChangePosition(newPosX, Y_POS);
                setDistanceMessage(
                  newPosX,
                  MAX_POS,
                  MIN_POS,
                  POS_STEP,
                  objects[selectedObjectIndex].label
                );
              } else {
                setDistanceMessage(
                  posX,
                  MAX_POS,
                  MIN_POS,
                  POS_STEP,
                  objects[selectedObjectIndex].label
                );
              }
            } else {
              const newIndex = selectedObjectIndex - 1;
              if (newIndex < 0) {
                setSelectedObjectIndex(objects.length - 1);
              } else {
                setSelectedObjectIndex(newIndex % objects.length);
              }
            }
            break;
          case DOWN:
            if (isKeyboardDragging) {
              if (posX < MAX_POS) {
                const newPosX = posX + POS_STEP;
                handleChangePosition(newPosX, Y_POS);
                setDistanceMessage(
                  newPosX,
                  MAX_POS,
                  MIN_POS,
                  POS_STEP,
                  objects[selectedObjectIndex].label
                );
              } else {
                setDistanceMessage(
                  posX,
                  MAX_POS,
                  MIN_POS,
                  POS_STEP,
                  objects[selectedObjectIndex].label
                );
              }
            } else {
              setSelectedObjectIndex(
                (selectedObjectIndex + 1) % objects.length
              );
            }
            break;
          default:
          //do nothing
        }
      },
      [
        selectedObjectIndex,
        getAsteroidBeltCount,
        isKeyboardDragging,
        handleChangePositionEnd,
        posX,
        posY,
        objects,
        dispatch,
        setDistanceMessage,
        handleChangePosition,
      ]
    );

    // efect that adds event listener to document when planetList is focused and removes it when it loses focus
    // whether it was focused is determined by isFocused state wasFocused(stores previous render value)
    useEffect(() => {
      if (isFocused && !wasFocused) {
        wasFocused.current = true;
        document.addEventListener('onkeydown', handleKeyboardInput);
      }
      if (!isFocused && wasFocused) {
        wasFocused.current = false;
        document.removeEventListener('onkeydown', handleKeyboardInput);
      }

      return () => {
        document.removeEventListener('onkeydown', handleKeyboardInput);
      };
    }, [isFocused, wasFocused, handleKeyboardInput]);

    const handleDragEnd = useCallback(
      (e, pos, obj) => {
        dispatch(
          createObject({
            x: pos.x,
            y: pos.y,
            obj,
          })
        );
      },
      [dispatch]
    );

    const handleClickObj = useCallback(
      (e, pos, obj) => {
        // console.log(e, pos, obj);
        //TODO problem with 2 functionalities maybe remove "click click adding"
        if (e.clientX < 300) {
          window.__APP_DATA__.selectedObject = obj;
        } else {
          dispatch(
            createObject({
              x: e.clientX,
              y: e.clientY,
              obj,
            })
          );
        }
      },
      [dispatch]
    );

    const onStartDrag = () => {
      setIsDragging(true);
    };
    const onEndDrag = () => {
      setIsDragging(false);
    };
    return (
      <>
        <AddPlanetText
          tabIndex={tabable(
            addingPlanetTextTabIndex,
            lastAddedObjectIndex >= 0
          )}
          setLastAddedObjectIndex={setLastAddedObjectIndex}
          object={
            lastAddedObjectIndex >= 0 ? objects[lastAddedObjectIndex] : null
          }
        />
        <Root
          ref={ref}
          tabIndex={tabable(panelTabIndex)}
          aria-label={ariaLabel}
          aria-roledescription=" "
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          onKeyDown={!isModalOpen ? handleKeyboardInput : null}
        >
          <PlanetsListAudio
            selectedObjectIndex={selectedObjectIndex}
            isKeyboardDragging={isKeyboardDragging}
            isGrayed={getAsteroidBeltCount >= 6 ? true : false}
          />
          <Container1>
            <h1>Pick some planets!</h1>
            <Planet
              imgSrc={loader.get(objects[0].thumb).src}
              key={'small-planet'}
              className={'small-planet'}
              radius={28}
              onClick={(e, pos) => handleClickObj(e, pos, objects[0])}
              onDragEnd={(e, pos) => handleDragEnd(e, pos, objects[0])}
              onTouchStart={() => onStartDrag()}
              onTouchEnd={() => onEndDrag()}
              focused={0 === selectedObjectIndex}
              isDragging={isDragging}
            />
            <Planet
              imgSrc={loader.get(objects[1].thumb).src}
              key={'medium-planet'}
              radius={45}
              onClick={(e, pos) => handleClickObj(e, pos, objects[1])}
              onDragEnd={(e, pos) => handleDragEnd(e, pos, objects[1])}
              onTouchStart={() => onStartDrag()}
              onTouchEnd={() => onEndDrag()}
              focused={1 === selectedObjectIndex}
              isDragging={isDragging}
            />
            <Planet
              imgSrc={loader.get(objects[2].thumb).src}
              key={'large-planet'}
              radius={72}
              onClick={(e, pos) => handleClickObj(e, pos, objects[2])}
              onDragEnd={(e, pos) => handleDragEnd(e, pos, objects[2])}
              onTouchEnd={() => onEndDrag()}
              onTouchStart={() => onStartDrag()}
              focused={2 === selectedObjectIndex}
              isDragging={isDragging}
            />
          </Container1>
          <Container2>
            <h1>Add comets and asteroids!</h1>
            <Planet
              imgSrc={objects[3].thumb}
              key={'comet'}
              radius={33}
              onClick={(e, pos) => handleClickObj(e, pos, objects[3])}
              onDragEnd={(e, pos) => handleDragEnd(e, pos, objects[3])}
              onTouchEnd={() => onEndDrag()}
              onTouchStart={() => onStartDrag()}
              focused={3 === selectedObjectIndex}
              isDragging={isDragging}
            />
            <Planet
              isGrayed={getAsteroidBeltCount >= 6 ? true : false}
              imgSrc={objects[4].thumb}
              key={'asteroid'}
              radius={55}
              onClick={(e, pos) => handleClickObj(e, pos, objects[4])}
              onDragEnd={(e, pos) => handleDragEnd(e, pos, objects[4])}
              onTouchEnd={() => onEndDrag()}
              onTouchStart={() => onStartDrag()}
              focused={4 === selectedObjectIndex}
              isDragging={isDragging}
            />
          </Container2>
          {getAsteroidBeltCount >= 6 && (
            <AsteroidLimitReachedLabel>
              {'All asteroids used'}
            </AsteroidLimitReachedLabel>
          )}

          {isKeyboardDragging && (
            <KeyboardDraggedWrapper top={posY} left={posX}>
              {planetImgByIndex(selectedObjectIndex, objects)}
            </KeyboardDraggedWrapper>
          )}
        </Root>
      </>
    );
  }
);

export default PlanetsList;

const planetImgByIndex = (index, objects) => {
  let radius = 28;
  switch (index) {
    case 0:
      radius = 28;
      break;
    case 1:
      radius = 45;
      break;
    case 2:
      radius = 72;
      break;
    case 3:
      radius = 33;
      break;
    case 4:
      radius = 55;
      break;
    default:
      radius = 28;
  }
  if (!objects[index]) return null;
  return <PlanetImgStyled src={objects[index].thumb} radius={radius} />;
};

const KeyboardDraggedWrapper = styled.div`
  position: absolute;
  top: ${({ top }) => vw(top)};
  left: ${({ left }) => vw(left)};
`;

const PlanetImgStyled = styled(PlanetImg)`
  transform: translate(-50%, -50%);
  outline: 6px solid orange;
`;

const Root = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  width: 100%;
  height: 100%;

  /* width: ${(props) => props.radius / 2}px; */
  h1 {
    position: absolute;

    margin: ${vw(10)};
    font-family: ${({ theme }) => theme.font.industry};
    font-weight: 300;
    font-style: normal;
    font-size: ${vw(22)};
    line-height: ${vw(30)};
  }
`;

const Container1 = styled.div`
  position: absolute;
  background: #443455;
  left: 50%;
  top: 15%;
  width: 80%;
  height: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  border-radius: ${vw(20)};
  transform: translate(-50%, -15%);
  h1 {
    top: -13%;
    align-self: flex-start;
  }
`;

const Container2 = styled.div`
  position: absolute;
  background: #443455;
  left: 50%;
  bottom: 10%;
  width: 80%;
  height: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  border-radius: ${vw(20)};
  transform: translate(-50%, -5%);
  white-space: nowrap;
  h1 {
    top: -16%;
  }
`;

const AddPlanetTextWrapper = styled.div`
  position: absolute;
  top: ${vw(54)};
  left: ${vw(400)};
  height: ${vw(200)};
  width: ${vw(200)};
  span {
    opacity: 0;
    overflow: hidden;
  }
`;

const AsteroidLimitReachedLabel = styled.div`
  position: absolute;
  left: ${vw(90)};
  top: ${vw(920)};
`;
const AddPlanetText = ({ tabIndex, object, setLastAddedObjectIndex }) => {
  const ref = useRef();

  const onBlur = useCallback(() => {
    setLastAddedObjectIndex(-1);
  }, [setLastAddedObjectIndex]);

  useEffect(() => {
    if (object && ref && ref.current) ref.current.focus();
  }, [object]);

  if (object == null) return null;

  return (
    <AddPlanetTextWrapper
      ref={ref}
      tabIndex={tabIndex}
      onBlur={onBlur}
      aria-roledescription=" "
    >
      <span>{`${object.label}is now part of the system.`}</span>
    </AddPlanetTextWrapper>
  );
};
