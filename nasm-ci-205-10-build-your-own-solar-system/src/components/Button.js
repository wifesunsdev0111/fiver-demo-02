import styled from 'styled-components';
import { vw } from '../styles/utils';

export default styled.button`
  height: ${vw(56)};
  width: ${vw(200)};
  background: ${({ theme }) => theme.color.primary};
  border: solid ${vw(3)} ${({ theme }) => theme.color.primaryBorder};
  border-radius: ${vw(8)};
  color: ${({ theme }) => theme.color.primaryText};
  font-size: ${vw(22)};
  line-height: ${vw(29)};
  font-family: ${({ theme }) => theme.font.nunito};
  font-weight: normal;
  font-style: normal;
  transition: background 0.25s;
  :active {
    background: ${({ theme }) => theme.color.buttonPressedBackground};
  }
`;
