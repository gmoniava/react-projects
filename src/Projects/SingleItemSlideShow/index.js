import React from "react";
import styled, { keyframes } from "styled-components";
import one from "./images/1.jpg";
import two from "./images/2.jpg";
import three from "./images/3.jpg";

///
//
// Slide show component showing only one image at a time.
//

let defaultImages = [
  { img: one, text: "Some text" },
  { img: two, text: "Some other text" },
  { img: three, text: "Some other other text" },
];
const fadeIn = keyframes`
  from {
     opacity: 0.4;
  }
  to {
     opacity: 1;
  }
`;
let Container = styled.div`
  width: 500px;
  height: 300px;
  position: relative;
`;
let NumberText = styled.div`
  position: absolute;
  left: 0;
  color: black;
  background-color: white;
  opacity: 0.5;
  z-index: 2;
`;
let CaptionText = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  color: black;
  background-color: white;
  opacity: 0.5;
  transform: translateX(-50%);
  backgroundcolor: black;
  z-index: 2;
`;
let Arrow = styled.div`
  color: black;
  background-color: white;
  opacity: 0.5;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  cursor: pointer;
  transform: translateY(-50%);
  &:hover {
    opacity: 0.9;
  }
`;

let LeftArrow = styled(Arrow)`
  left: 10px;
`;
let RightArrow = styled(Arrow)`
  right: 10px;
`;
let Image = styled.img`
  animation: ${fadeIn} 1.5s ease-out;
`;
let DotContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;
let Dot = styled.div`
  background-color: ${({ active }) => (active ? "gray" : "lightgray")};
  border-radius: 50%;
  cursor: pointer;
  height: 20px;
  width: 20px;
  &:hover {
    background-color: gray;
  }
`;
export default function App({ images = defaultImages }) {
  let [index, setIndex] = React.useState(0);
  if (!images || !images.length) return null;
  return (
    <Container>
      <NumberText>{`${index + 1}/${images.length}`}</NumberText>
      <Image
        key={index}
        src={images?.[index]?.img}
        style={{ height: "100%", width: "100%", objectFit: "cover" }}
      />
      <CaptionText>{images?.[index]?.text}</CaptionText>
      <LeftArrow
        onClick={() => {
          if (index === 0) {
            setIndex(images.length - 1);
            return;
          }
          setIndex(index - 1);
        }}
      >
        ❮
      </LeftArrow>
      <RightArrow
        onClick={() => {
          setIndex((index + 1) % images.length);
        }}
      >
        ❯
      </RightArrow>
      <DotContainer>
        {[...Array(images.length).keys()].map((el, i) => (
          <Dot active={i === index} key={i} onClick={() => setIndex(i)} />
        ))}
      </DotContainer>
    </Container>
  );
}
