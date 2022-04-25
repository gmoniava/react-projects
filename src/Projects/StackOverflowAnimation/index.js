import React from "react";
import styled, { keyframes } from "styled-components";

///
//
// Imitates animation from stackoverflow web page.
//

let names = ["Nick", "David", "John"];

let MainContainerStyled = styled.div`
  display: flex;
  font-size: 22px;
`;

let animation = keyframes`
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0px);
    opacity: 1;
  }
`;

let AnimatedWordStyled = styled.div`
  animation: ${animation} 1s linear;
  color: orange;
  margin: 0 5px 0 5px;
  font-weight: bold;
`;

export default function App() {
  let [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    let interval = setInterval(() => {
      setIndex((ps) => (ps + 1) % 3);
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <MainContainerStyled>
      Hello
      <AnimatedWordStyled key={index}>{names[index]}</AnimatedWordStyled>
      welcome.
    </MainContainerStyled>
  );
}
