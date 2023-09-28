import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { vw } from '../..//styles/utils';

const withProps =
  (Component) =>
  ({
    delay = 0,
    duration = 1000,
    animate = true,
    value = 20,
    direction = 'up',
    ...rest
  }) => {
    const [isAnimate, setIsAnimate] = useState(false);
    useEffect(() => {
      setTimeout(() => {
        setIsAnimate(animate);
      }, 0);
    }, [animate]);

    return (
      <Component
        delay={delay}
        duration={duration}
        animate={isAnimate}
        value={value}
        direction={direction}
        {...rest}
      />
    );
  };

const cssTransition = css`
  opacity: ${({ animate }) => (animate ? 1 : 0)};
  transform: ${({ animate, value, direction }) => {
    return animate
      ? `translateY(0)`
      : direction === 'down'
      ? `translateY(${vw(-value)}) translateX(0)`
      : direction === 'up'
      ? `translateY(${vw(value)}) translateX(0)`
      : direction === 'left'
      ? `translateY(0) translateX(${vw(value)})`
      : direction === 'right'
      ? `translateY(0) translateX(${vw(-value)})`
      : 0;
  }};
  transition: transform ${({ duration }) => duration}ms,
    opacity ${({ duration }) => duration}ms;
  transition-delay: ${({ animate, delay, gradual, gradualDelay }) =>
    animate ? delay : 0}ms;
`;

const withTransition = (Component) => styled(Component)`
  ${cssTransition};
`;

const Slide = withProps(
  withTransition(
    ({
      children,
      className,
      delay,
      duration,
      animate,
      value,
      direction,
      ...rest
    }) => {
      return React.Children.map(children, (child) =>
        React.cloneElement(child, {
          className,
          ...rest,
        })
      );
    }
  )
);

export default Slide;
