import React, { useRef } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { getMessagesObject } from '../../redux/liveMessages';

const LiveMessages = () => {
  const evenUse = useRef(true);
  const messagesObject = useSelector(getMessagesObject);
  evenUse.current = !evenUse.current;
  const messagesWithKeys = _.reduce(
    messagesObject,
    (result, message, key) => {
      result.push({ key, message });
      return result;
    },
    []
  );
  return (
    <>
      {messagesWithKeys.map((messageWithKey) => {
        return (
          <LiveMessage aria-live="polite" key={messageWithKey.key}>
            {`${messageWithKey.message}${evenUse.current ? '' : ' '}`}
          </LiveMessage>
        );
      })}
    </>
  );
};

export default React.memo(LiveMessages);

const LiveMessage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 0;
  width: 0;
  overflow: hidden;
`;
