import React from 'react';
import styled from 'styled-components';
import Button from '../components/Button';
import { vw } from '../styles/utils';
import { loader } from '../plugins/components/Preloader';
import { MAIN_EVENT_BG, CLOSE_ICON } from '../config/config';

export default function EventsBox({ active, clickExit, thumb }) {
  const handleClickExit = () => {
    clickExit();
  };

  return (
    <Root active={active}>
      <h2>Notable celestial events </h2>
      <h3>
        Forces of Gravity can trigger extraordinary events! We'll let you know
        when big things happen!
      </h3>
      <Image src={loader.get(thumb).src} />
      <XIconButton onClick={handleClickExit} />
      <GotItButton onClick={handleClickExit}>Got it</GotItButton>
    </Root>
  );
}

const Root = styled.div`
  z-index: 999;
  display: ${(props) => (props.active ? '' : 'none')};
  position: absolute;
  width: ${vw(903)};
  height: ${vw(511)};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-image: url(${loader.get(MAIN_EVENT_BG).src});
  background-repeat: no-repeat;
  background-size: cover;

  h2 {
    position: absolute;
    width: ${vw(344)};
    height: ${vw(115)};
    color: #4c4848;
    top: 30%;
    left: 75%;
    transform: translate(-50%, -30%);
    font-size: ${vw(38)};
    line-height: ${vw(50)};
  }

  h3 {
    position: absolute;
    width: ${vw(357)};
    height: ${vw(144)};
    color: #944997;
    top: 60%;
    left: 76%;
    transform: translate(-50%, -60%);
    font-size: ${vw(22)};
    line-height: ${vw(27)};
  }
`;

const Image = styled.img`
  position: absolute;
  width: ${vw(433)};
  height: ${vw(465)};
  top: 4%;
  left: 5%;
  transform: translate(-5%, 0%);
  background: pink;
`;

const XIconButton = styled.button`
  position: absolute;
  background-image: url(${loader.get(CLOSE_ICON).src});
  width: ${vw(31)};
  height: ${vw(31)};
  background-repeat: no-repeat;
  background-position: center;
  top: 5%;
  left: 98%;
  transform: translate(-98%, -5%);
`;
const GotItButton = styled(Button)`
  position: absolute;
  width: ${vw(210)};
  height: ${vw(59)};
  bottom: 18%;
  left: 72%;
  transform: translate(-70%, -10%);
`;
