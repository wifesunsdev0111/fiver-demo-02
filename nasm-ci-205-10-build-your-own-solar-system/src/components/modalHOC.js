import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

export const SHOW_MODAL_ANIMATION_DURATION = 250;

const modalHOC = (Component) => ({ open, zIndex = 999, onClose, ...rest }) => {
  const [fullyVisible, setFullyVisible] = useState(open);

  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        setFullyVisible(open);
      },
      open ? 0 : SHOW_MODAL_ANIMATION_DURATION
    );
    return () => {
      clearTimeout(timeout);
    };
  }, [open]);

  if (!open && !fullyVisible) {
    return null;
  }

  return (
    <Root zIndex={zIndex} open={open} onClick={stopPropagation}>
      <BgTapArea onClick={onClose}/>
      <Component open={open} onClose={onClose} fullyVisible={fullyVisible} {...rest} onClick={stopPropagation} />
    </Root>
  );
};

export default modalHOC;

const showOverlayAnimation = keyframes`
  0% { 
    opacity: 0;
  }
  40% { 
    opacity: 1; 
  }
  100% { 
    opacity: 1; 
  }
`;

const hideOverlayAnimation = keyframes`
  0% { 
    opacity: 1;
  }
  60% { 
    opacity: 1; 
  }
  100% { 
    opacity: 0; 
  }
`;

const Root = styled.div`
  z-index: ${({ zIndex }) => zIndex};

  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  backdrop-filter: blur(6px);
  background-color: rgba(45, 45, 45, 0.2);
  animation: ${({ open }) =>
      open ? showOverlayAnimation : hideOverlayAnimation}
    ${SHOW_MODAL_ANIMATION_DURATION}ms forwards;
`;

const BgTapArea = styled.div`
  z-index: ${({ zIndex }) => zIndex};
position: absolute;
left: 0;
top: 0;
width: 100%;
height: 100%;
`;