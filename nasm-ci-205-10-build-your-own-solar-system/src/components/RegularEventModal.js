import React from 'react';
import styled from 'styled-components';
import Modal from '../components/Modal';
import { vw } from '../styles/utils';
import AudioDescription from '../components/AudioDescription';
import Button from '../components/Button';
import { useSelector } from 'react-redux';
import { wasKeypadUsed as wasKeypadUsedSelector } from '../redux/app';

const RegularEventModal = ({
  open,
  onClose,
  imgSrc,
  imgAlt,
  title,
  description,
  audioDescription,
  gotItButtonAriaRoleDescription,
  xButtonAriaLabel,
  xButtonAriaRoleDescription,
  textMarginTop = 120,
  isExitActive,
}) => {
  const wasKeypadUsed = useSelector(wasKeypadUsedSelector);

  return (
    <Modal
      xButtonAriaLabel={xButtonAriaLabel}
      xButtonAriaRoleDescription={xButtonAriaRoleDescription}
      open={open}
      onClose={onClose}
      xButtonTabIndex={-1}
    >
      <AudioDescription
        description={`${audioDescription} ${title}, ${description} ${imgAlt} Got it ${gotItButtonAriaRoleDescription}`}
        active={true}
        autoFocus={true}
        delay={500}
        handleKeyDown={onClose}
        additionalWidth={663}
        additionalHeight={100}
        position={{ top: '2%', left: '2%' }}
      />
      <Wrapper>
        <Image src={imgSrc} alt={imgAlt} />
        <ContentWrapper textMarginTop={textMarginTop}>
          <div>
            <Title>{title}</Title>
            <Description>{description}</Description>
          </div>
          <GotItButton
            // tabIndex={tabable(2, !isExitActive && !isTimeoutPopupActive)}
            tabIndex={-1}
            // aria-roledescription={gotItButtonAriaRoleDescription}
            onClick={onClose}
            isActive={open && wasKeypadUsed}
          >
            Got it
          </GotItButton>
        </ContentWrapper>
      </Wrapper>
    </Modal>
  );
};

export default RegularEventModal;

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
`;
const GotItButton = styled(Button)`
  outline: ${(props) => (props.isActive ? '6px solid orange' : 'none')};
`;
const Image = styled.img`
  height: ${vw(465)};
  width: ${vw(433)};
  margin: ${vw(23)} ${vw(30)} ${vw(23)} ${vw(26)};
`;

const ContentWrapper = styled.div`
  height: 100%;
  margin-right: ${vw(35)};
  margin-top: ${({ textMarginTop }) => vw(textMarginTop)};
`;

const Title = styled.h1`
  font-size: ${vw(36)};
  line-height: ${vw(47)};
  margin-bottom: ${vw(30)};
`;

const Description = styled.div`
  font-size: ${vw(22)};
  line-height: ${vw(27)};
  margin-bottom: ${vw(35)};
  font-family: ${({ theme }) => theme.font.nunito};
`;
