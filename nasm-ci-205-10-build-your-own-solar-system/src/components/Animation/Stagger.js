import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Slide from './Slide';

export default function Stagger(props) {
  const [isAnimate, setIsAnimate] = useState(false);
  const {
    content,
    delay,
    staggerDelay,
    animationComponent,
    animate,
    animationProps,
  } = props;
  const AnimationComponent = animationComponent;

  useEffect(() => {
    setIsAnimate(animate);
  }, [animate]);

  return (
    <>
      {content.map((child, index) => (
        <AnimationComponent
          key={index}
          delay={delay + index * staggerDelay}
          animate={isAnimate}
          {...animationProps}
        >
          {child}
        </AnimationComponent>
      ))}
    </>
  );
}

Stagger.propTypes = {
  delay: PropTypes.number,
  staggerDelay: PropTypes.number,
  children: PropTypes.array,
  animationComponent: PropTypes.func,
  animate: PropTypes.bool,
};

Stagger.defaultProps = {
  delay: 0,
  staggerDelay: 150,
  children: [],
  animationComponent: Slide,
  animate: true,
  animationProps: {},
};
