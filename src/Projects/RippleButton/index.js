import React from "react";
import styled, { keyframes } from "styled-components";

///
//
// Button with ripple effect
//

const fadeInAndScale = keyframes`
  to {
    transform: translate(-50%, -50%) scale(3);
    opacity: 0;
  }
`;

let ButtonStyled = styled.button`
  background-color: royalblue;
  color: #fff;
  border: 1px royalblue solid;
  font-size: 14px;
  letter-spacing: 2px;
  padding: 20px 30px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
`;

let FadeInCircleStyled = styled.span`
  position: absolute;
  background-color: white;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  animation: ${fadeInAndScale} 1.5s ease-out;
`;

export default function RippleButton() {
  let [rippleCoords, setRippleCoords] = React.useState();
  let btnRef = React.useRef();

  let handleClick = (e) => {
    // Subtract coordinates related to viewport to obtain local coordinates
    const localX = e.clientX - btnRef.current.getBoundingClientRect().left;
    const localY = e.clientY - btnRef.current.getBoundingClientRect().top;

    // Data for the new click effect
    setRippleCoords({
      x: localX,
      y: localY,
      key: ((rippleCoords?.key || 0) + 1) % 100,
    });
  };

  return (
    <ButtonStyled ref={btnRef} onClick={handleClick}>
      {rippleCoords && (
        <FadeInCircleStyled
          key={rippleCoords.key}
          top={rippleCoords.y}
          left={rippleCoords.x}
        />
      )}
      Ripple btn
    </ButtonStyled>
  );
}
