import React, { useCallback, useState, useRef, useEffect } from 'react';

const TAB = 9;
const UP = 38;
const DOWN = 40;

const KeypadVerticalNavList = React.forwardRef(
  ({ tabIndex, nextTabRef, className, style, children = [], ...rest }, ref) => {
    const selectedItemRef = useRef(null);
    const [selectedObjectIndex, setSelectedObjectIndex] = useState(null);
    const numberOfChildren = children.length;

    const handleOnBlur = useCallback(
      (index) => {
        if (selectedObjectIndex === index) {
          setSelectedObjectIndex(null);
        }
      },
      [selectedObjectIndex]
    );

    const handleKeyboardInput = useCallback(
      (e) => {
        const { which } = e;
        switch (which) {
          case TAB:
            if (nextTabRef && nextTabRef.current && nextTabRef.current.focus) {
              e.preventDefault();
              nextTabRef.current.focus();
            }
            break;
          case UP:
            if (selectedObjectIndex == null) {
              setSelectedObjectIndex(0);
            } else {
              setSelectedObjectIndex(
                (selectedObjectIndex + numberOfChildren - 1) % numberOfChildren
              );
            }
            break;
          case DOWN:
            if (selectedObjectIndex == null) {
              setSelectedObjectIndex(0);
            } else {
              setSelectedObjectIndex(
                (selectedObjectIndex + 1) % numberOfChildren
              );
            }
            break;
          default:
          //do nothing
        }
      },
      [selectedObjectIndex, numberOfChildren, nextTabRef]
    );

    useEffect(() => {
      if (selectedItemRef && selectedItemRef.current) {
        selectedItemRef.current.focus();
      }
    }, [selectedObjectIndex]);

    return (
      <div
        ref={ref}
        tabIndex={tabIndex}
        className={className}
        style={style}
        onKeyDown={handleKeyboardInput}
        {...rest}
      >
        {React.Children.map(children, (child, index) => {
          return React.cloneElement(child, {
            tabIndex: -1,
            ref: index === selectedObjectIndex ? selectedItemRef : null,
            selectedIndex: selectedObjectIndex,
            index: index,
            onBlur: () => handleOnBlur(index),
          });
        })}
      </div>
    );
  }
);

export default KeypadVerticalNavList;
