import React from 'react';
import styled, { keyframes } from 'styled-components';
import modalHOC, {
  SHOW_MODAL_ANIMATION_DURATION,
} from '../components/modalHOC';
import { vw } from '../styles/utils';
import { loader } from '../plugins/components/Preloader';
import { CLOSE_ICON, MAIN_EVENT_BG } from '../config/config';

const Modal = ({
  open,
  className,
  onClose,
  xButtonTabIndex,
  xButtonAriaLabel = '',
  xButtonAriaRoleDescription = '',
  children,
  bgUrl = loader.get(MAIN_EVENT_BG).src,
}) => {
  return (
    <Wrapper open={open} bgUrl={bgUrl} className={className} onClick={onClose}>
      {children}

      <XIconButton
        tabIndex={xButtonTabIndex}
        aria-label={xButtonAriaLabel}
        aria-roledescription={xButtonAriaRoleDescription}
        onClick={onClose}
      />
    </Wrapper>
  );
};

export default modalHOC(Modal);

const showModalAnimation = keyframes`
  from { 
    opacity: 0;
    transform: scale(0.75) ;
  }
  to { 
    opacity: 1; 
    transform: scale(1);
  }
`;

const hideModalAnimation = keyframes`
  from { 
    opacity: 1; 
    transform: scale(1);
  }
  to { 
    opacity: 0;
    transform: scale(0.75) ;
  }
`;

const Wrapper = styled.div`
  position: absolute;
  width: ${vw(903)};
  height: ${vw(511)};
  top: ${vw(311)};
  left: ${vw(591)};
  background-image: url(${({ bgUrl }) => bgUrl});
  background-repeat: no-repeat;
  background-size: cover;
  animation: ${({ open }) => (open ? showModalAnimation : hideModalAnimation)}
    ${SHOW_MODAL_ANIMATION_DURATION}ms forwards;
`;

const XIconButton = styled.button`
  position: absolute;
  width: ${vw(39)};
  height: ${vw(48)};
  top: ${vw(26)};
  right: ${vw(26)};
  background-image: url(${loader.get(CLOSE_ICON)});
  background-repeat: no-repeat;
  background-size: cover;
`;
