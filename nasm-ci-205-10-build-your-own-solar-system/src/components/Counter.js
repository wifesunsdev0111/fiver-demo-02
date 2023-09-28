import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { increment, decrement, reset } from '../redux/counter';

export default function Counter() {
  const count = useSelector((state) => state.counter.count);
  const dispatch = useDispatch();

  const handleClickIncrement = () => {
    dispatch(increment());
  };

  const handleClickDecrement = () => {
    dispatch(decrement());
  };

  const handleClickReset = () => {
    dispatch(reset());
  };

  return (
    <Root>
      <p>{count}</p>
      <button onClick={handleClickIncrement}>Increment</button>
      <button onClick={handleClickDecrement}>Decrement</button>
      <button onClick={handleClickReset}>Reset</button>
    </Root>
  );
}

const Root = styled.div`
  text-align: center;
  button {
    margin: 0 15px;
  }
`;
