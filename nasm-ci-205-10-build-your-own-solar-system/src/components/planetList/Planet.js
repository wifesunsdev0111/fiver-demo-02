import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import { vw } from '../../styles/utils';

const Planet = ({
  isGrayed,
  imgSrc,
  radius,
  onTouchStart,
  onTouchEnd,
  onClick,
  onDragEnd,
  focused,
  isDragging,
  className,
}) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onPositionChange = useCallback((e) => {
    if (e != null && e.touches != null && e.touches[0] != null) {
      const touch = e.touches[0];
      setPos({ x: touch.clientX, y: touch.clientY });
    } else {
      setPos({ x: 0, y: 0 });
    }
  }, []);

  const onStop = useCallback(
    (e) => {
      if ((pos.x === 0 && pos.y === 0) || pos.x < 329) {
        // PREVENTS SPAWN ON DOUBLE CLICK OR IF OBJECT IS PLACED INSIDE LEFT PANEL
        if (e.type === 'mouseup') {
          onClick(e);
        }
      } else {
        setPos({ x: 0, y: 0 });
        onDragEnd(e, pos);
      }
      //enable dragging after planet is dropped
      onTouchEnd();

      // console.log('pos.x is ', pos.x + 'pos y is ', pos.y);
    },
    [pos, onClick, onDragEnd, onTouchEnd]
  );

  return (
    //onTouchStart/onTouchEnd to enable dragging after planet is dropped in
    //combo with <Draggable disabled={isDragging}/> to prevent drouble dragging
    <PlanetWrapper
      focused={focused}
      onTouchStart={!isDragging ? onTouchStart : null}
      onTouchEnd={!isDragging ? onTouchEnd : null}
      className={className}
    >
      <PlanetWrapper2 isGrayed={isGrayed}>
        <PlanetPlaceholder alt="" src={imgSrc} radius={radius} />
        <Draggable
          position={{ x: 0, y: 0 }}
          scale={1}
          disabled={isDragging}
          onTouchStart={onTouchStart}
          onDrag={onPositionChange}
          onStop={onStop}
        >
          <ImageWrapper>
            <PlanetImg alt="" src={imgSrc} radius={radius} />
          </ImageWrapper>
        </Draggable>
      </PlanetWrapper2>
    </PlanetWrapper>
  );
};

export default Planet;

const PlanetPlaceholder = styled.img`
  position: relative;
  top: 0;
  left: 0;
  display: block;
  height: ${({ radius }) => vw(radius * 2)};
  width: ${({ radius }) => vw(radius * 2)};
`;

const ImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`;

export const PlanetImg = styled.img`
  display: block;
  height: ${({ radius }) => vw(radius * 2)};
  width: ${({ radius }) => vw(radius * 2)};
  pointer-events: none;
`;

const PlanetWrapper = styled.div`
  position: relative;
  outline-width: ${({ focused }) => (focused ? vw(6) : vw(0))};
  outline-style: solid;
  outline-color: orange;
`;

const PlanetWrapper2 = styled.div`
  position: relative;
  opacity: ${(props) => (props.isGrayed ? 0.2 : 1)};
`;
